"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * Ambient particle field, adapted from the supplied SpaceBackground snippet.
 *
 * Four deliberate changes from the original, all required to make it work as a
 * background *layer* behind the hero rather than a standalone full-screen page:
 *
 *  1. Colour. The original defaulted to the CSS keyword "blue". This reads
 *     --kelo-brand off :root at runtime, so particles always match whatever the
 *     palette in globals.css says — swap the brand blue there and this follows.
 *  2. Positioning. The original hardcoded `position: fixed; z-index: -1`, which
 *     puts the canvas behind the opaque page background and makes it invisible.
 *     It is now absolutely positioned and sized to its parent, so it fills the
 *     hero and nothing else.
 *  3. Geometry. The particle ring radius was a fixed 120px, which reads as a
 *     small clump in the middle of a wide hero. It now scales with the canvas.
 *  4. Reduced motion + visibility. Draws a single static frame instead of
 *     looping when the user prefers reduced motion, and parks the loop entirely
 *     while the hero is offscreen or the tab is hidden.
 */

interface Particle {
  color: string;
  radius: number;
  x: number;
  y: number;
  ring: number;
  move: number;
  random: number;
  isHeart?: boolean;
}

interface SpaceBackgroundProps {
  /** Desktop particle count. Mobile is derived from this automatically. */
  particleCount?: number;
  /** Explicit override. Leave unset to track the Kelo brand blue. */
  particleColor?: string;
  /** Alpha applied to the resolved brand colour, so it glows rather than dots. */
  opacity?: number;
  backgroundColor?: string;
  className?: string;
  /** Enable floating hearts mixed with the particles */
  showHearts?: boolean;
  /** Percentage of particles that should be hearts (0-1) */
  heartRatio?: number;
}

// --- Utility: parse RGB/hex colors ---
function parseRGB(cssColor: string): number[] | null {
  if (!cssColor) return null;
  cssColor = cssColor.trim();

  // hex
  if (cssColor[0] === "#") {
    let hex = cssColor.slice(1);
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b];
  }

  // rgb/rgba
  const m = cssColor.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
    return [parts[0], parts[1], parts[2]];
  }

  // Bare "r g b" channel triplet, the form CSS custom properties use here.
  const channels = cssColor.split(/[\s/]+/).map((s) => parseFloat(s));
  if (channels.length >= 3 && channels.slice(0, 3).every((n) => !isNaN(n))) {
    return channels.slice(0, 3);
  }

  return null;
}

function luminanceFromRgb([r, g, b]: number[]) {
  const srgb = [r / 255, g / 255, b / 255].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/** Resolve --kelo-brand (possibly an alias for --kelo-600) down to channels. */
function readBrandChannels(): number[] | null {
  const root = document.documentElement;
  const styles = getComputedStyle(root);

  for (const name of ["--kelo-brand", "--kelo-600", "--kelo-500"]) {
    const raw = styles.getPropertyValue(name);
    if (!raw) continue;
    const parsed = parseRGB(raw);
    if (parsed) return parsed;
  }

  return null;
}

export function SpaceBackground({
  particleCount = 180,
  particleColor,
  opacity = 0.6,
  backgroundColor = "transparent",
  className = "",
  showHearts = false,
  heartRatio = 0.3,
}: SpaceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [resolvedColor, setResolvedColor] = useState<string | undefined>(undefined);
  const prefersReduced = useReducedMotion();

  // --- Detect effective background color (fallback path only) ---
  const detectBackgroundColor = () => {
    if (backgroundColor && backgroundColor !== "transparent") return backgroundColor;

    const candidates = [document.body, document.documentElement];
    for (const el of candidates) {
      if (!el) continue;
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor || cs.background;
      if (!bg) continue;
      const rgb = parseRGB(bg);
      if (!rgb) continue;

      if (/rgba/.test(bg)) {
        const alpha = parseFloat(bg.split(",").pop() || "1");
        if (isNaN(alpha) || alpha === 0) continue;
      }
      return bg;
    }

    return "white";
  };

  // --- Resolve the particle colour ---
  useEffect(() => {
    if (particleColor) {
      setResolvedColor(particleColor);
      return;
    }

    const resolve = () => {
      // Preferred path: match the brand blue exactly.
      const brand = readBrandChannels();
      if (brand) {
        const [r, g, b] = brand;
        setResolvedColor(`rgba(${r}, ${g}, ${b}, ${opacity})`);
        return;
      }

      // Fallback: contrast against whatever the page background turns out to be.
      const bg = detectBackgroundColor();
      const rgb = parseRGB(bg);
      const lum = rgb ? luminanceFromRgb(rgb) : 1;
      setResolvedColor(
        lum < 0.5 ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)",
      );
    };

    resolve();

    // Re-resolve if a theme class or inline style rewrites the custom property.
    const observer = new MutationObserver(() => setTimeout(resolve, 10));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleColor, backgroundColor, opacity]);

  // --- Draw / animate ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (!resolvedColor) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const isNarrow = window.innerWidth < 768;
    const count = isNarrow ? Math.round(particleCount * 0.5) : particleCount;

    const state = {
      particles: [] as Particle[],
      r: 120,
      counter: 0,
      width: 0,
      height: 0,
    };

    const setupCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = parent.getBoundingClientRect();
      if (!width || !height) return;

      state.width = width;
      state.height = height;
      // Ring radius scales with the box so the field fills a wide hero.
      state.r = Math.max(90, Math.min(width, height) / 4.5);

      // Squash the field on very short viewports, as the original did.
      const ratio = height < 400 ? 0.6 : 1;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Y is flipped so the particle maths reads as standard cartesian.
      ctx.setTransform(
        ratio * dpr,
        0,
        0,
        -ratio * dpr,
        (width * dpr) / 2,
        (height * dpr) / 2,
      );
    };

    setupCanvas();

    const createParticle = () => {
      const isHeart = showHearts && Math.random() < heartRatio;
      state.particles.push({
        color: resolvedColor,
        radius: Math.random() * (isHeart ? 3 : 5),
        x: Math.cos(Math.random() * 7 + Math.PI) * state.r,
        y: Math.sin(Math.random() * 7 + Math.PI) * state.r,
        ring: Math.random() * state.r * 3,
        move: (Math.random() * 4 + 1) / 500,
        random: Math.random() * 7,
        isHeart,
      });
    };
    for (let i = 0; i < count; i++) createParticle();

    const moveParticle = (p: Particle) => {
      p.ring = Math.max(p.ring - 1, state.r);
      p.random += p.move;
      p.x = Math.cos(p.random + Math.PI) * p.ring;
      p.y = Math.sin(p.random + Math.PI) * p.ring;
    };

    const resetParticle = (p: Particle) => {
      p.ring = Math.random() * state.r * 3;
      p.radius = Math.random() * 5;
    };

    const disappear = (p: Particle) => {
      if (p.radius < 0.8) {
        resetParticle(p);
        if (showHearts && Math.random() < heartRatio) {
          p.isHeart = true;
        } else {
          p.isHeart = false;
        }
      }
      p.radius *= 0.994;
    };

    const drawHeart = (p: Particle) => {
      const size = p.radius;
      const x = p.x;
      const y = p.y;

      ctx.save();
      ctx.fillStyle = p.color;
      
      const hx = size * 0.5;
      const hy = size * 0.45;

      ctx.beginPath();
      ctx.moveTo(x, y - hy);
      ctx.bezierCurveTo(
        x - hx, y - hy - hx * 0.5,
        x - hx, y - hy * 0.5,
        x, y + hy * 0.3
      );
      ctx.bezierCurveTo(
        x + hx, y - hy * 0.5,
        x + hx, y - hy - hx * 0.5,
        x, y - hy
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const draw = (p: Particle) => {
      if (p.isHeart) {
        drawHeart(p);
      } else {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const clear = () => {
      ctx.clearRect(
        -state.width,
        -state.height,
        state.width * 2,
        state.height * 2,
      );
    };

    const renderFrame = (advance: boolean) => {
      clear();
      if (state.counter < state.particles.length) state.counter++;
      for (let i = 0; i < state.counter; i++) {
        if (advance) {
          disappear(state.particles[i]);
          moveParticle(state.particles[i]);
        }
        draw(state.particles[i]);
      }
    };

    // Reduced motion: one static frame, no loop. The field still reads as a
    // soft blue texture behind the hero, it just does not move.
    if (prefersReduced) {
      state.counter = state.particles.length;
      renderFrame(false);

      const handleStaticResize = () => {
        setupCanvas();
        renderFrame(false);
      };
      window.addEventListener("resize", handleStaticResize);
      return () => window.removeEventListener("resize", handleStaticResize);
    }

    let running = false;

    const loop = () => {
      renderFrame(true);
      animationRef.current = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      animationRef.current = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    // Only burn frames while the hero is actually on screen and the tab is live.
    let onScreen = true;
    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    visibility.observe(parent);

    const handleTabVisibility = () => {
      if (document.hidden || !onScreen) stop();
      else start();
    };
    document.addEventListener("visibilitychange", handleTabVisibility);

    const resizeObserver = new ResizeObserver(() => setupCanvas());
    resizeObserver.observe(parent);

    start();

    return () => {
      stop();
      visibility.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleTabVisibility);
    };
  }, [particleCount, resolvedColor, prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "block",
        width: "100%",
        height: "100%",
        background: backgroundColor,
        pointerEvents: "none",
      }}
    />
  );
}

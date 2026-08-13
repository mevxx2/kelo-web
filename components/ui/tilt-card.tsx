"use client";

import { useRef, type MouseEvent, type ReactNode, type RefObject } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type MotionStyle,
  type Variants,
} from "framer-motion";

import { cn } from "@/lib/utils";
import { useMotionSafe } from "@/lib/motion";

const TILT_SPRING = { stiffness: 260, damping: 22, mass: 0.6 } as const;

interface UseTiltOptions {
  /** Max rotation in degrees at the card's edge. */
  maxTilt?: number;
  /** Vertical lift (px) on hover, on top of the tilt. */
  lift?: number;
}

interface UseTiltResult<T extends HTMLElement> {
  safe: boolean;
  /** Goes on the element whose bounds define the tilt (the card's outer edge). */
  ref: RefObject<T>;
  handlers: {
    onMouseMove: (event: MouseEvent<T>) => void;
    onMouseLeave: () => void;
  };
  /**
   * Goes on an *inner* element, never the one carrying entrance `variants`.
   * Binding this `y`/rotate alongside a variant that also animates `y` would
   * put both in charge of the same transform (see the note in hero.tsx) —
   * splitting the tilt onto its own nested element sidesteps that entirely.
   */
  innerStyle: MotionStyle | undefined;
  spotlightBackground: ReturnType<typeof useMotionTemplate>;
}

/**
 * Pointer-driven 3D tilt + cursor spotlight, shared by every hoverable card
 * on the site (feature tiles, problem panels, testimonial quotes). A hook
 * rather than only a wrapper component so call sites that need a specific
 * outer element (e.g. Testimonials' <figure>) can apply it directly instead
 * of being forced into a generic wrapper's markup.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>({
  maxTilt = 10,
  lift = 6,
}: UseTiltOptions = {}): UseTiltResult<T> {
  const safe = useMotionSafe();
  const ref = useRef<T>(null);

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const liftRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, TILT_SPRING);
  const rotateY = useSpring(rotateYRaw, TILT_SPRING);
  const y = useSpring(liftRaw, TILT_SPRING);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightBackground = useMotionTemplate`radial-gradient(340px circle at ${mouseX}px ${mouseY}px, rgb(var(--kelo-200) / 0.5), transparent 70%)`;

  const onMouseMove = (event: MouseEvent<T>) => {
    if (!safe || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const px = event.clientX - bounds.left;
    const py = event.clientY - bounds.top;
    mouseX.set(px);
    mouseY.set(py);

    rotateYRaw.set((px / bounds.width - 0.5) * maxTilt * 2);
    rotateXRaw.set((py / bounds.height - 0.5) * -maxTilt * 2);
    liftRaw.set(-lift);
  };

  const onMouseLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    liftRaw.set(0);
  };

  return {
    safe,
    ref,
    handlers: { onMouseMove, onMouseLeave },
    innerStyle: safe
      ? { rotateX, rotateY, y, transformPerspective: 800 }
      : undefined,
    spotlightBackground,
  };
}

/** Absolutely-positioned spotlight overlay. Render as the outer card's first child. */
export function TiltSpotlight({
  background,
}: {
  background: ReturnType<typeof useMotionTemplate>;
}) {
  return (
    <motion.div
      aria-hidden="true"
      style={{ background }}
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    />
  );
}

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  maxTilt?: number;
  lift?: number;
  spotlight?: boolean;
}

/**
 * Convenience wrapper around useTilt() for the common case: a plain
 * <div>-based card. Use useTilt() directly when the outer element needs to
 * be something else (e.g. a <figure>).
 */
export function TiltCard({
  children,
  className,
  variants,
  maxTilt,
  lift,
  spotlight = true,
}: TiltCardProps) {
  const { ref, handlers, innerStyle, spotlightBackground } = useTilt<HTMLDivElement>({
    maxTilt,
    lift,
  });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      onMouseMove={handlers.onMouseMove}
      onMouseLeave={handlers.onMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card transition-shadow duration-300 hover:shadow-lift",
        className,
      )}
    >
      {spotlight && <TiltSpotlight background={spotlightBackground} />}
      <motion.div style={innerStyle} className="relative">
        {children}
      </motion.div>
    </motion.div>
  );
}

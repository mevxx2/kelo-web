import { useEffect, useState } from "react";
import { useReducedMotion, type Variants } from "framer-motion";

/*
 * Shared motion system.
 *
 * Every animated component pulls its variants from here so the whole site moves
 * with one vocabulary, and so reduced-motion handling exists in exactly one place
 * instead of being reimplemented per component.
 *
 * No "use client" here on purpose: this module is only ever imported by client
 * components, and leaving the directive off keeps the plain variant factories
 * usable from anywhere.
 */

type Ease = [number, number, number, number];

/** Decelerating ease — the default for anything entering the viewport. */
export const EASE_OUT: Ease = [0.22, 1, 0.36, 1];
/** Symmetric ease for state changes that both start and stop on screen. */
export const EASE_IN_OUT: Ease = [0.65, 0, 0.35, 1];

/*
 * `as const` rather than a `Transition` annotation on purpose: these are passed
 * both to `transition` props (which want Transition) and to useSpring (which
 * wants SpringOptions). A Transition-annotated union is not assignable to
 * SpringOptions; the inferred literal type satisfies both.
 */
export const SPRING_SOFT = {
  type: "spring",
  stiffness: 120,
  damping: 18,
  mass: 0.9,
} as const;

export const SPRING_SNAPPY = {
  type: "spring",
  stiffness: 320,
  damping: 26,
  mass: 0.6,
} as const;

/** Shared `whileInView` viewport config: fire once, a quarter of the way in. */
export const viewportOnce = { once: true, amount: 0.25 } as const;

/**
 * True when the user has NOT asked for reduced motion, i.e. when it is safe to
 * animate transforms. Pass the result into the variant factories below; they
 * collapse to a plain opacity fade when it is false.
 *
 * Deliberately reports `true` on the server AND on the first client render,
 * flipping only after mount. framer-motion's useReducedMotion reads matchMedia
 * synchronously in the browser but returns false during SSR, so using it raw
 * makes a reduced-motion user hydrate a different tree than the server sent —
 * which React 18 treats as a mismatch and recovers from by throwing away the
 * server HTML. Several call sites gate real DOM nodes on this value, so the
 * mismatch would be structural, not cosmetic. Deferring one tick keeps the
 * hydration render identical; the correction lands long before the hero's
 * 0.45s entrance delay elapses.
 */
export function useMotionSafe(): boolean {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted ? !prefersReduced : true;
}

/**
 * True on small viewports. Used to shorten travel distances and durations —
 * the same 24px slide that feels crisp on a laptop reads as sluggish on a phone.
 */
export function useIsCompact(): boolean {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return compact;
}

export interface MotionConfig {
  safe: boolean;
  compact: boolean;
  /** Scales a travel distance to 0 when reduced, 60% on small screens. */
  dist: (px: number) => number;
  /** Scales a duration to near-instant when reduced, 85% on small screens. */
  time: (seconds: number) => number;
}

/** One hook for the two things nearly every animated component needs. */
export function useMotion(): MotionConfig {
  const safe = useMotionSafe();
  const compact = useIsCompact();

  return {
    safe,
    compact,
    dist: (px) => (!safe ? 0 : compact ? px * 0.6 : px),
    time: (seconds) => (!safe ? 0.001 : compact ? seconds * 0.85 : seconds),
  };
}

/** The reduced-motion fallback every factory degrades to: opacity only. */
function plainFade(duration = 0.2): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration } },
  };
}

interface FadeUpOptions {
  safe?: boolean;
  y?: number;
  duration?: number;
  delay?: number;
}

/** The workhorse: fade in while sliding up. */
export function fadeUp({
  safe = true,
  y = 24,
  duration = 0.6,
  delay = 0,
}: FadeUpOptions = {}): Variants {
  if (!safe) return plainFade();

  return {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: EASE_OUT },
    },
  };
}

interface StaggerOptions {
  safe?: boolean;
  stagger?: number;
  delayChildren?: number;
}

/**
 * Parent wrapper that releases its children in sequence. Children must declare
 * `variants` themselves and omit `initial`/`animate` so the parent drives them.
 */
export function staggerContainer({
  safe = true,
  stagger = 0.09,
  delayChildren = 0,
}: StaggerOptions = {}): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: safe ? stagger : 0,
        delayChildren: safe ? delayChildren : 0,
      },
    },
  };
}

interface ScaleInOptions {
  safe?: boolean;
  from?: number;
  y?: number;
}

/** Soft spring up from slightly-too-small. Used for the pricing card. */
export function scaleIn({
  safe = true,
  from = 0.95,
  y = 16,
}: ScaleInOptions = {}): Variants {
  if (!safe) return plainFade();

  return {
    hidden: { opacity: 0, scale: from, y },
    visible: { opacity: 1, scale: 1, y: 0, transition: SPRING_SOFT },
  };
}

interface CardInOptions {
  safe?: boolean;
  rotate?: number;
  y?: number;
  /** Horizontal travel — 0 by default; set it for a diagonal entrance. */
  x?: number;
}

/**
 * Cards settle in with a touch of rotation, so a grid of them reads as physical
 * objects landing rather than a row of identical fades.
 */
export function cardIn({
  safe = true,
  rotate = -2.5,
  y = 28,
  x = 0,
}: CardInOptions = {}): Variants {
  if (!safe) return plainFade();

  return {
    hidden: { opacity: 0, x, y, rotate, scale: 0.96 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.65, ease: EASE_OUT },
    },
  };
}

interface DrawLineOptions {
  safe?: boolean;
  duration?: number;
  /** "y" grows downward (vertical timeline), "x" grows rightward. */
  axis?: "x" | "y";
}

/**
 * A connector line that draws itself in.
 *
 * The two axes are spelled out rather than built with a computed key, so the
 * returned object keeps a literal type that Variants accepts cleanly.
 */
export function drawLine({
  safe = true,
  duration = 1.1,
  axis = "y",
}: DrawLineOptions = {}): Variants {
  const transition = { duration, ease: EASE_IN_OUT };

  if (axis === "y") {
    if (!safe) {
      return {
        hidden: { scaleY: 1, opacity: 0 },
        visible: { scaleY: 1, opacity: 1, transition: { duration: 0.2 } },
      };
    }
    return {
      hidden: { scaleY: 0, opacity: 0.6 },
      visible: { scaleY: 1, opacity: 1, transition },
    };
  }

  if (!safe) {
    return {
      hidden: { scaleX: 1, opacity: 0 },
      visible: { scaleX: 1, opacity: 1, transition: { duration: 0.2 } },
    };
  }

  return {
    hidden: { scaleX: 0, opacity: 0.6 },
    visible: { scaleX: 1, opacity: 1, transition },
  };
}

/** SVG stroke draw-on, for the confirmation checkmark. */
export function drawPath(safe = true): Variants {
  if (!safe) {
    return {
      hidden: { pathLength: 1, opacity: 0 },
      visible: { pathLength: 1, opacity: 1, transition: { duration: 0.2 } },
    };
  }

  return {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.6, ease: EASE_OUT, delay: 0.2 },
        opacity: { duration: 0.1, delay: 0.2 },
      },
    },
  };
}

/** Horizontal entrance, for items that should feel like they slide in from a side. */
export function slideIn(from: "left" | "right", safe = true, x = 32): Variants {
  if (!safe) return plainFade();

  return {
    hidden: { opacity: 0, x: from === "left" ? -x : x },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: EASE_OUT },
    },
  };
}

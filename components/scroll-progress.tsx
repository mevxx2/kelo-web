"use client";

import { motion, useScroll, useSpring } from "framer-motion";

import { useMotionSafe } from "@/lib/motion";

/**
 * Thin gradient bar tracking scroll position across the whole page. Always
 * rendered — it's informational feedback tied directly to the user's own
 * scroll input, not an autoplaying animation — but the spring is stiffened to
 * a near-instant follow under reduced motion instead of the usual soft trail.
 */
export function ScrollProgress() {
  const safe = useMotionSafe();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: safe ? 200 : 100000,
    damping: safe ? 40 : 100000,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-kelo-500 via-kelo-600 to-sun-500"
    />
  );
}

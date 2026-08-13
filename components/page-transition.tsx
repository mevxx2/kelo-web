"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";

import { FrozenRouter } from "@/lib/frozen-router";
import { getFunnelStepIndex } from "@/lib/funnel-steps";
import { EASE_OUT, useMotionSafe } from "@/lib/motion";

/*
 * Cross-route enter/exit transitions. See lib/frozen-router.tsx for why the
 * outgoing tree needs its router context pinned during the exit animation.
 *
 * Keyed on the *full* pathname — every navigation gets a fresh motion.div
 * (and therefore a fresh FrozenRouter capturing the then-current context).
 * An earlier version keyed this on just the top-level segment so the
 * /get-started funnel wouldn't replay a generic fade on every step, but that
 * meant the wrapper never remounted across funnel steps, so FrozenRouter's
 * captured context went stale and later steps silently kept rendering the
 * first step's content. Keying on the full pathname and instead switching
 * *variant* (slide vs fade) based on route gets the same "no generic fade
 * inside the funnel" result without breaking FrozenRouter's one-shot design.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const safe = useMotionSafe();

  const inFunnel = pathname.startsWith("/get-started");
  const funnelStep = inFunnel ? getFunnelStepIndex(pathname) : 0;

  // Direction for the funnel's slide: forward (role -> signup -> confirmation)
  // slides from the right, back slides from the left.
  const prevFunnelStep = useRef(funnelStep);
  const direction = funnelStep >= prevFunnelStep.current ? 1 : -1;
  prevFunnelStep.current = funnelStep;

  const slideDistance = safe ? 28 : 0;
  const fadeDistance = safe ? 12 : 0;
  const duration = safe ? (inFunnel ? 0.36 : 0.34) : 0.001;

  const variants: Variants = inFunnel
    ? {
        enter: (dir: number) => ({ opacity: 0, x: dir * slideDistance }),
        center: { opacity: 1, x: 0 },
        exit: (dir: number) => ({ opacity: 0, x: dir * -slideDistance }),
      }
    : {
        enter: { opacity: 0, y: fadeDistance },
        center: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -fadeDistance },
      };

  return (
    // initial={false} so the very first paint is left to the hero's own
    // orchestrated reveal rather than being covered by a page-level fade.
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={pathname}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration, ease: EASE_OUT }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}

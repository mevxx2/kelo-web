"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { getFunnelStepIndex } from "@/lib/funnel-steps";
import { EASE_OUT, useMotionSafe } from "@/lib/motion";

/*
 * Cross-route enter animation. Enter-only, no exit fade, on purpose.
 *
 * An earlier version used AnimatePresence plus a `FrozenRouter` helper that
 * pinned Next's internal LayoutRouterContext so the outgoing page could keep
 * rendering its own content during an exit animation. That reached into a
 * Next.js internal in a way that could race with the App Router's own
 * concurrent SSR rendering (observed directly: "Detected multiple renderers
 * concurrently rendering the same context provider", logged during SSR) —
 * and on some page loads that race left the fixed header's entrance
 * animation, and all of its interactivity (scroll-spy, the solid/transparent
 * toggle), permanently stuck at its initial hidden state. Losing the old
 * page's fade-out is a small trade for not silently breaking the nav.
 *
 * Keyed on the full pathname, so every navigation gets a fresh motion.div
 * and replays its entrance.
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

  const initial = inFunnel
    ? { opacity: 0, x: direction * slideDistance }
    : { opacity: 0, y: fadeDistance };

  return (
    <motion.div
      key={pathname}
      initial={initial}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

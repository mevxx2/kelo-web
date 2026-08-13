"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { FUNNEL_STEPS as STEPS, getFunnelStepIndex } from "@/lib/funnel-steps";
import { EASE_OUT, useMotionSafe } from "@/lib/motion";

/*
 * No FrozenRouter/AnimatePresence here — the root PageTransition
 * (components/page-transition.tsx) already owns the slide between funnel
 * steps (it's keyed on the full pathname, so this whole layout remounts on
 * every step). That also means the stepper below plays its "done"/"active"
 * states immediately on each remount rather than transitioning between them;
 * `initial={false}` on the fill bar keeps that from looking like a fade-in.
 */
export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const safe = useMotionSafe();

  const activeIndex = getFunnelStepIndex(pathname);
  const progress = activeIndex / (STEPS.length - 1);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white pb-24 pt-28 sm:pt-32">
      {/* Same layered mesh as the hero, so the funnel feels like the same place. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgb(var(--kelo-100)/0.6),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(35%_30%_at_85%_10%,rgb(var(--sun-100)/0.5),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        {/* Single continuous track with the step dots overlaid on top, rather
            than one bar per step — a connected track reads as one journey,
            and it's what lets the glow marker slide smoothly between steps. */}
        <div className="relative mx-auto mb-16 h-16 max-w-md">
          {/* Dots sit at 0/50/100% (below), so the track uses the same
              coordinate space — an inset track would end before reaching
              the first/last dot. */}
          <div className="absolute inset-x-0 top-4 h-0.5 -translate-y-1/2 rounded-full bg-slate-200" />
          <motion.div
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ duration: safe ? 0.5 : 0, ease: EASE_OUT }}
            style={{ transformOrigin: "left" }}
            className="absolute inset-x-0 top-4 h-0.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-kelo-500 to-sun-500"
          />

          {STEPS.map((step, i) => {
            const done = i < activeIndex;
            const active = i === activeIndex;
            const pct = (i / (STEPS.length - 1)) * 100;

            return (
              <div
                key={step.label}
                style={{ left: `${pct}%` }}
                className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
              >
                <div
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300",
                    done
                      ? "bg-kelo-600 text-white"
                      : active
                        ? "bg-white text-kelo-700 ring-2 ring-kelo-600"
                        : "bg-slate-100 text-slate-400 ring-1 ring-inset ring-slate-200",
                  )}
                >
                  {done ? <CheckIcon /> : i + 1}

                  <AnimatePresence>
                    {active && (
                      <motion.span
                        layoutId="funnel-step-glow"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        aria-hidden="true"
                        className="absolute -inset-1.5 -z-10 rounded-full bg-[radial-gradient(circle,rgb(var(--kelo-400)/0.35),transparent_70%)]"
                      />
                    )}
                  </AnimatePresence>
                </div>
                <span
                  className={cn(
                    "mt-2 whitespace-nowrap text-xs font-medium transition-colors duration-300",
                    // slate-500 is the lightest grey that still clears WCAG AA
                    // on white (4.8:1); slate-400 does not.
                    active ? "text-kelo-700" : "text-slate-500",
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {children}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M3 7.3 5.6 10l5.4-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

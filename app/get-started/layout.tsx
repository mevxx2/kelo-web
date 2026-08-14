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
    <div className="theme-surface relative min-h-screen overflow-hidden bg-[#141238] pb-24 pt-28 sm:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgba(255,196,151,.14),transparent_70%),radial-gradient(50%_50%_at_15%_70%,rgba(73,67,210,.22),transparent_70%)]"
      />
      <div aria-hidden="true" className="care-grain pointer-events-none absolute inset-0 opacity-[0.055]" />
      <svg aria-hidden="true" viewBox="0 0 1000 1300" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" fill="none">
        <path d="M500 0C500 190 420 250 470 350C520 450 580 340 620 430C680 570 420 650 440 800C460 990 560 1050 500 1300" stroke="#8178ff" strokeWidth="2" className="thread-pulse" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        {/* Single continuous track with the step dots overlaid on top, rather
            than one bar per step — a connected track reads as one journey,
            and it's what lets the glow marker slide smoothly between steps. */}
        <div className="relative mx-auto mb-16 h-16 max-w-md">
          {/* Dots sit at 0/50/100% (below), so the track uses the same
              coordinate space — an inset track would end before reaching
              the first/last dot. */}
          <div className="absolute inset-x-0 top-4 h-0.5 -translate-y-1/2 rounded-full bg-white/10" />
          <motion.div
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ duration: safe ? 0.5 : 0, ease: EASE_OUT }}
            style={{ transformOrigin: "left" }}
            className="absolute inset-x-0 top-4 h-0.5 -translate-y-1/2 rounded-full bg-kelo-400"
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
                        ? "bg-[#17143a]/90 text-kelo-200 ring-2 ring-kelo-400"
                        : "bg-white/5 text-white/30 ring-1 ring-inset ring-white/10",
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
                    active ? "text-kelo-300" : "text-white/40",
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

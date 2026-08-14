"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { staggerContainer, useMotion, viewportOnce, EASE_OUT } from "@/lib/motion";

const STEPS = [
  {
    n: "01",
    title: "Set up your team",
    body: "Add caregivers and clients once. Roles decide who sees what, so families get updates without seeing payroll.",
  },
  {
    n: "02",
    title: "Log visits in real time",
    body: "Caregivers start a timer on arrival and leave a note on the way out. It takes seconds, not a Sunday evening.",
  },
  {
    n: "03",
    title: "Everyone stays in sync",
    body: "Agencies watch coverage live, families see the day's summary, and payroll exports itself at week's end.",
  },
];

export function HowItWorks() {
  const { safe, dist, time } = useMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // The connector fills as the section scrolls through the viewport, so the
  // line reads as progress rather than a static divider.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 75%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const fillScale = useTransform(fill, (v) => (safe ? v : 1));

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-ink-950 py-24 sm:py-32"
    >
      {/* Ambient glow — same drifting-blob language as the other dark block
          (final-cta.tsx), tuned to ink instead of brand blue, so the two dark
          sections feel related but not identical. */}
      {safe && (
        <>
          <motion.div
            aria-hidden="true"
            animate={{ x: [0, 40, -20, 0], y: [0, -20, 15, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-kelo-700/30 blur-3xl"
          />
          <motion.div
            aria-hidden="true"
            animate={{ x: [0, -30, 25, 0], y: [0, 20, -10, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-kelo-500/15 blur-3xl"
          />
        </>
      )}

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer({ safe })}
          className="max-w-2xl"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: dist(14) },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: time(0.5), ease: EASE_OUT },
              },
            }}
            className="text-sm font-medium uppercase tracking-widest text-kelo-400"
          >
            How it works
          </motion.p>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: dist(22) },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: time(0.65), ease: EASE_OUT },
              },
            }}
            className="mt-4 text-balance text-3xl font-normal tracking-tight text-white sm:text-4xl"
          >
            Running in an afternoon.
          </motion.h2>
        </motion.div>

        <div ref={trackRef} className="relative mt-16">
          {/* Rail: horizontal from md up, vertical below. */}
          <div
            aria-hidden="true"
            className="absolute left-[1.4rem] top-2 h-[calc(100%-3rem)] w-0.5 bg-white/10 md:left-0 md:top-[1.4rem] md:h-0.5 md:w-full"
          >
            <motion.div
              style={{
                scaleY: fillScale,
                transformOrigin: "top",
              }}
              className="h-full w-full bg-kelo-400 shadow-[0_0_12px_rgb(var(--kelo-400)/0.6)] md:hidden"
            />
            <motion.div
              style={{
                scaleX: fillScale,
                transformOrigin: "left",
              }}
              className="hidden h-full w-full bg-kelo-400 shadow-[0_0_12px_rgb(var(--kelo-400)/0.6)] md:block"
            />
          </div>

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer({ safe, stagger: 0.16 })}
            className="relative grid gap-10 md:grid-cols-3 md:gap-8"
          >
            {STEPS.map((step) => (
              <motion.li
                key={step.n}
                variants={{
                  hidden: safe
                    ? { opacity: 0, y: dist(26) }
                    : { opacity: 0 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: time(0.6), ease: EASE_OUT },
                  },
                }}
                className="group relative pl-16 md:pl-0 md:pt-16"
              >
                <motion.span
                  variants={{
                    hidden: safe ? { scale: 0.4, opacity: 0 } : { opacity: 0 },
                    visible: {
                      scale: 1,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                      },
                    },
                  }}
                  className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-kelo-600 text-sm font-bold text-white shadow-[0_0_0_4px_rgb(var(--ink-950)),0_0_24px_rgb(var(--kelo-400)/0.55)] transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                >
                  {step.n}
                </motion.span>

                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-slate-400">
                  {step.body}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

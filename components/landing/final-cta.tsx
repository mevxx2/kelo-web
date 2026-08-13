"use client";

import { motion } from "framer-motion";

import { ArrowRight, CtaButton } from "@/components/ui/button";
import { staggerContainer, useMotion, viewportOnce, EASE_OUT } from "@/lib/motion";

export function FinalCta() {
  const { safe, dist, time } = useMotion();

  return (
    <section className="relative overflow-hidden bg-kelo-600 py-24 sm:py-32">
      {/* Slow aurora drift. Three offset blobs — including a warm accent, so
          this block reads as a relative of the ink-dark sections rather than
          a flat blue rectangle. All skipped under reduced motion. */}
      {safe && (
        <>
          <motion.div
            aria-hidden="true"
            animate={{ x: [0, 60, -20, 0], y: [0, -30, 20, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-kelo-400/40 blur-3xl"
          />
          <motion.div
            aria-hidden="true"
            animate={{ x: [0, -50, 30, 0], y: [0, 25, -15, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-20 bottom-0 h-[28rem] w-[28rem] rounded-full bg-ink-900/60 blur-3xl"
          />
          <motion.div
            aria-hidden="true"
            animate={{ x: [0, 30, -40, 0], y: [0, -20, 10, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-sun-400/20 blur-3xl"
          />
        </>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_120%,rgb(var(--ink-950)/0.45),transparent_70%)]"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer({ safe, stagger: 0.1 })}
        className="relative mx-auto max-w-3xl px-5 text-center sm:px-8"
      >
        <motion.h2
          variants={{
            hidden: { opacity: 0, y: dist(24) },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: time(0.7), ease: EASE_OUT },
            },
          }}
          className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl"
        >
          Give every shift a shared memory.
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: dist(18) },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: time(0.6), ease: EASE_OUT },
            },
          }}
          className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-kelo-100"
        >
          Set up your team in an afternoon and never chase a timesheet again.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: dist(16) },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: time(0.55), ease: EASE_OUT },
            },
          }}
          className="mt-10 flex justify-center"
        >
          <CtaButton href="/get-started" variant="inverse" size="lg">
            Get started
            <ArrowRight />
          </CtaButton>
        </motion.div>
      </motion.div>
    </section>
  );
}

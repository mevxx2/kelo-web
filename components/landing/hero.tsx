"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

import { CardStack } from "@/components/landing/card-stack";
import { ArrowRight, CtaButton } from "@/components/ui/button";
import { EASE_OUT, useMotion } from "@/lib/motion";

/*
 * Hero: one orchestrated reveal on first load, then scroll-linked parallax.
 *
 * Order is nav → headline → card stack → buttons. The nav animates itself (it
 * is fixed and lives outside this tree), so the timeline here starts at 0.45s
 * to fall in behind it. Everything below is driven by the parent's variants;
 * children set `variants` only and never their own initial/animate.
 *
 * Deliberately quiet: no particle canvas, no drifting blobs. A single static
 * radial glow gives the black canvas depth without competing for attention.
 */

export function Hero() {
  const { safe, dist, time } = useMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const cardsY = useTransform(scrollYProgress, [0, 1], [0, safe ? 140 : 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, safe ? 56 : 0]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, safe ? 0.15 : 1]);

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: safe ? 0.14 : 0,
        delayChildren: safe ? 0.45 : 0,
      },
    },
  };

  const item: Variants = {
    hidden: safe ? { opacity: 0, y: dist(22) } : { opacity: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: time(0.65), ease: EASE_OUT },
    },
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative isolate overflow-hidden bg-ink-950 pb-24 pt-36 sm:pb-32 sm:pt-44"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_15%,rgb(var(--kelo-900)/0.55),transparent_70%)]"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8"
      >
        <motion.div style={{ y: copyY, opacity: copyOpacity }}>
          <motion.div variants={item} className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kelo-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-kelo-400" />
              </span>
              Now in early access
            </span>
          </motion.div>

          {/* Brand wordmark — a quiet gradient, not a glowing/shimmering
              flourish, to match a restrained dark aesthetic. */}
          <motion.p
            variants={item}
            className="mt-6 select-none text-center text-2xl font-medium tracking-tight text-white/40 sm:text-3xl"
          >
            Kelo Care
          </motion.p>

          <motion.h1
            variants={item}
            className="mx-auto mt-4 max-w-4xl text-balance text-center text-5xl font-normal leading-[1.05] tracking-tight text-white sm:text-7xl"
          >
            Care that everyone
            <br className="hidden sm:block" />{" "}
            <span className="relative inline-block bg-gradient-to-r from-kelo-300 to-kelo-500 bg-clip-text text-transparent">
              can see
              <motion.span
                aria-hidden="true"
                variants={
                  safe
                    ? {
                        hidden: { scaleX: 0 },
                        visible: {
                          scaleX: 1,
                          transition: { duration: 0.7, ease: EASE_OUT, delay: 0.15 },
                        },
                      }
                    : undefined
                }
                className="absolute inset-x-0 -bottom-1 h-px origin-left bg-gradient-to-r from-kelo-400 to-transparent"
              />
            </span>
            .
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-pretty text-center text-lg leading-relaxed text-white/50"
          >
            Kelo Care keeps caregivers, agencies, and families working from the
            same picture — visit timers, care notes, and schedules in one place.
          </motion.p>
        </motion.div>

        {/* Parallax and the entrance reveal are split across two elements on
            purpose: binding `y` to a scroll MotionValue while a variant also
            animates `y` puts both in charge of the same transform. */}
        <motion.div style={{ y: cardsY }} className="mt-14">
          <motion.div variants={item}>
            <CardStack />
          </motion.div>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <CtaButton href="/get-started" size="lg" variant="glass">
            Get started
            <ArrowRight />
          </CtaButton>
          <CtaButton
            href="/#how-it-works"
            variant="glassOutline"
            size="lg"
            magnetic={0.15}
          >
            See how it works
          </CtaButton>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-6 text-center text-sm text-white/35"
        >
          $40 per caregiver, per year. No per-visit fees.
        </motion.p>
      </motion.div>
    </section>
  );
}

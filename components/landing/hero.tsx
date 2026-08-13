"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

import { CardStack } from "@/components/landing/card-stack";
import { SpaceBackground } from "@/components/ui/space-background";
import { ArrowRight, CtaButton } from "@/components/ui/button";
import { EASE_OUT, useMotion } from "@/lib/motion";

/*
 * Hero: one orchestrated reveal on first load, then scroll-linked parallax.
 *
 * Order is nav → headline → card stack → buttons. The nav animates itself (it
 * is fixed and lives outside this tree), so the timeline here starts at 0.45s
 * to fall in behind it. Everything below is driven by the parent's variants;
 * children set `variants` only and never their own initial/animate.
 */

export function Hero() {
  const { safe, dist, time } = useMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Layers drift at different rates so the hero has depth as it leaves.
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, safe ? 140 : 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, safe ? 56 : 0]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, safe ? 0.15 : 1]);
  const blobY = useTransform(scrollYProgress, [0, 1], [0, safe ? -80 : 0]);

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
      // `relative` is what keeps the particle canvas scoped to the hero.
      className="relative isolate overflow-hidden bg-white pb-24 pt-36 sm:pb-32 sm:pt-44"
    >
      <SpaceBackground particleCount={180} opacity={0.55} showHearts={true} heartRatio={0.25} />

      {/* Soft brand wash sitting between the particles and the content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_18%,rgb(var(--kelo-100)/0.55),transparent_70%)]"
      />

      {/* Slow-drifting mesh blobs — the hero never sits perfectly still, even
          before anything scrolls. Two colours so the wash reads as depth
          rather than a flat tint. */}
      {safe && (
        <motion.div
          aria-hidden="true"
          style={{ y: blobY }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <motion.div
            animate={{ x: [0, 50, -20, 0], y: [0, -20, 30, 0] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-kelo-200/40 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -40, 30, 0], y: [0, 30, -20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-16 top-32 h-72 w-72 rounded-full bg-sun-200/40 blur-3xl"
          />
        </motion.div>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        // z-10 keeps the content above the bottom seam gradient, which is a
        // later sibling and would otherwise wash out the line under the CTAs.
        className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8"
      >
        <motion.div style={{ y: copyY, opacity: copyOpacity }}>
          <motion.div variants={item} className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-kelo-700 shadow-card ring-1 ring-inset ring-kelo-100 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-br from-kelo-500 to-sun-500" />
              </span>
              Now in early access
            </span>
          </motion.div>

          {/* Brand wordmark, the "welcome" moment before the value-prop
              headline. Two stacked spans (CSS grid overlap, not absolute
              positioning, so they can't drift apart if font metrics change):
              a blurred blue glow halo behind a sharp blue gradient span. */}
          <motion.div variants={item} className="mt-6 flex justify-center">
            <div className="relative grid place-items-center">
              <motion.span
                animate={safe ? { opacity: [0.4, 0.7, 0.4] } : undefined}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
                className="col-start-1 row-start-1 select-none bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-6xl font-black tracking-tight text-transparent blur-2xl sm:text-8xl"
              >
                Kelo Care
              </motion.span>
              <span
                className="col-start-1 row-start-1 select-none bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-6xl font-black tracking-tight text-transparent [text-shadow:0_12px_36px_rgb(59,130,246/0.35)] sm:text-8xl"
              >
                Kelo Care
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={item}
            className="mx-auto mt-6 max-w-4xl text-balance text-center text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-7xl"
          >
            Care that everyone
            <br className="hidden sm:block" />{" "}
            <span className="relative inline-block bg-gradient-to-r from-kelo-600 to-kelo-500 bg-clip-text text-transparent">
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
                className="absolute inset-x-0 -bottom-1 h-3 origin-left rounded-full bg-gradient-to-r from-kelo-200 to-sun-200"
              />
            </span>
            .
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-pretty text-center text-lg leading-relaxed text-slate-600"
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
          className="mt-6 text-center text-sm text-slate-500"
        >
          $40 per caregiver, per year. No per-visit fees.
        </motion.p>
      </motion.div>

      {/* Seam: fades the hero into the section below rather than cutting. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white"
      />
    </section>
  );
}

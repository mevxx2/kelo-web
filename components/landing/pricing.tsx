"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { ArrowRight, CtaButton } from "@/components/ui/button";
import { scaleIn, staggerContainer, useMotion, viewportOnce, EASE_OUT } from "@/lib/motion";

const INCLUDED = [
  "Unlimited visits and care notes",
  "Real-time visit timer with location stamp",
  "Shared scheduling and shift swaps",
  "Agency dashboard and live coverage view",
  "Family updates with role-based access",
  "Payroll and compliance exports",
  "iOS and Android apps",
  "Email support",
];

export function Pricing() {
  const { safe, dist, time } = useMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const haloRotate = useTransform(scrollYProgress, [0, 1], [safe ? -6 : 0, safe ? 6 : 0]);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative overflow-hidden bg-ink-950 py-24 sm:py-32"
    >
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer({ safe })}
          className="mx-auto max-w-2xl text-center"
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
            Pricing
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
            One plan. No per-visit billing.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={scaleIn({ safe })}
          className="relative mx-auto mt-14 max-w-lg"
        >
          {/* Halo behind the card, so it lifts off the black page — slowly
              rotating with scroll so the card doesn't sit dead still even
              while nothing else on it is actively animating. */}
          <motion.div
            aria-hidden="true"
            style={{ rotate: haloRotate }}
            className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgb(var(--kelo-600)/0.3),transparent_75%)]"
          />

          <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm sm:p-10">
            <span className="inline-flex rounded-full bg-kelo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-kelo-300 ring-1 ring-inset ring-kelo-400/20">
              Per caregiver
            </span>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-semibold tracking-tight text-white">
                <AnimatedNumber value={40} prefix="$" />
              </span>
              <span className="text-base font-medium text-white/40">
                / year
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Billed annually per active caregiver. Agencies, families, and
              client seats are included at no extra cost.
            </p>

            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer({ safe, stagger: 0.055, delayChildren: 0.15 })}
              className="mt-8 space-y-3 border-t border-white/10 pt-8"
            >
              {INCLUDED.map((line) => (
                <motion.li
                  key={line}
                  variants={{
                    hidden: safe ? { opacity: 0, x: -10 } : { opacity: 0 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: time(0.4), ease: EASE_OUT },
                    },
                  }}
                  className="flex items-start gap-3 text-sm text-white/70"
                >
                  <CheckMark />
                  <span>{line}</span>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-9">
              <CtaButton href="/get-started" size="lg" fullWidth>
                Get started
                <ArrowRight />
              </CtaButton>
            </div>

            <p className="mt-4 text-center text-xs text-white/40">
              No card required to join early access.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CheckMark() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-kelo-500/15 text-kelo-300"
    >
      <svg viewBox="0 0 14 14" className="h-3 w-3">
        <path
          d="M3 7.3 5.6 10l5.4-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

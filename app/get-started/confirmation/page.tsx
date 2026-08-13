"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { CtaButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  EASE_OUT,
  SPRING_SOFT,
  drawPath,
  staggerContainer,
  useMotion,
} from "@/lib/motion";

const NEXT_STEPS: Record<string, string[]> = {
  caregiver: [
    "Check your inbox for a confirmation link.",
    "We'll send your app invite the moment your spot opens.",
    "Your agency can add you to a team before then.",
  ],
  agency: [
    "Check your inbox for a confirmation link.",
    "We'll reach out to walk through team setup and imports.",
    "Have your caregiver list handy — setup takes about an afternoon.",
  ],
  family: [
    "Check your inbox for a confirmation link.",
    "Ask the agency you work with to add you to the client's circle.",
    "You'll get daily summaries once visits start logging.",
  ],
};

const DEFAULT_STEPS = [
  "Check your inbox for a confirmation link.",
  "We'll email you the moment your spot opens up.",
  "Reply to that email any time with questions.",
];

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <Confirmation />
    </Suspense>
  );
}

function Confirmation() {
  const searchParams = useSearchParams();
  const { safe, dist, time } = useMotion();

  const role = searchParams.get("role") ?? "";
  const steps = NEXT_STEPS[role] ?? DEFAULT_STEPS;

  const item = {
    hidden: safe ? { opacity: 0, y: dist(16) } : { opacity: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: time(0.5), ease: EASE_OUT },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer({ safe, stagger: 0.09, delayChildren: 0.15 })}
      className="mx-auto max-w-lg text-center"
    >
      <motion.div
        variants={{
          hidden: safe ? { scale: 0.7, opacity: 0 } : { opacity: 0 },
          visible: { scale: 1, opacity: 1, transition: SPRING_SOFT },
        }}
        className="relative mx-auto flex h-20 w-20 items-center justify-center"
      >
        {safe && (
          <span className="absolute inset-0 rounded-full bg-kelo-100 animate-pulse-ring" />
        )}
        <span className="absolute inset-0 rounded-full bg-kelo-50 ring-1 ring-inset ring-kelo-100" />
        <Burst safe={safe} />

        <svg
          viewBox="0 0 48 48"
          className="relative h-10 w-10 text-kelo-600"
          fill="none"
          aria-hidden="true"
        >
          <motion.path
            d="M13 25.5 20.5 33 35 16"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={drawPath(safe)}
          />
        </svg>
      </motion.div>

      <motion.h1
        variants={item}
        className="mt-8 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
      >
        You&apos;re on the list.
      </motion.h1>

      <motion.p
        variants={item}
        className="mx-auto mt-4 max-w-sm text-pretty text-base leading-relaxed text-slate-600"
      >
        Thanks for signing up. Here&apos;s what happens next.
      </motion.p>

      <motion.ol
        variants={staggerContainer({ safe, stagger: 0.08, delayChildren: 0.1 })}
        className="mx-auto mt-10 space-y-3 text-left"
      >
        {steps.map((step, i) => (
          <motion.li
            key={step}
            variants={item}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
          >
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-kelo-50 text-xs font-bold text-kelo-700 ring-1 ring-inset ring-kelo-100">
              {i + 1}
            </span>
            <span className="text-pretty text-sm leading-relaxed text-slate-700">
              {step}
            </span>
          </motion.li>
        ))}
      </motion.ol>

      <motion.div variants={item} className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Coming soon
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <StoreBadge store="App Store" />
          <StoreBadge store="Google Play" />
        </div>
      </motion.div>

      <motion.div variants={item} className="mt-10 flex justify-center">
        <CtaButton href="/" variant="secondary" size="lg" magnetic={0.15}>
          Back to home
        </CtaButton>
      </motion.div>
    </motion.div>
  );
}

/** Small celebratory burst of dots radiating from the checkmark on mount. */
function Burst({ safe }: { safe: boolean }) {
  if (!safe) return null;

  const dots = Array.from({ length: 10 });

  return (
    <>
      {dots.map((_, i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        const distance = 44 + (i % 3) * 10;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return (
          <motion.span
            key={i}
            aria-hidden="true"
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0], x, y, scale: [0.4, 1, 0.6] }}
            transition={{ duration: 0.9, delay: 0.5 + i * 0.03, ease: EASE_OUT }}
            className={cn(
              "absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full",
              i % 2 === 0 ? "bg-kelo-400" : "bg-sun-400",
            )}
          />
        );
      })}
    </>
  );
}

/** Placeholder badges. Swap for the official artwork once the apps are live. */
function StoreBadge({ store }: { store: string }) {
  return (
    <span className="inline-flex cursor-default items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 shadow-sm">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M12 2 4 6.5v11L12 22l8-4.5v-11L12 2Zm0 2.3 5.8 3.3L12 10.9 6.2 7.6 12 4.3Z" />
      </svg>
      {store}
    </span>
  );
}

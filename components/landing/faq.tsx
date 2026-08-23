"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { staggerContainer, useMotion, viewportOnce, EASE_OUT } from "@/lib/motion";

const FAQS = [
  {
    q: "Do caregivers need to be tech-savvy to use it?",
    a: "No. The whole visit flow is two taps: start on arrival, end on the way out. Most caregivers are running their first visit within a minute of installing the app.",
  },
  {
    q: "What happens if there's no signal at a client's home?",
    a: "Visits log offline and sync as soon as the phone reconnects. Timers keep running locally, so a basement with no bars never costs someone their hours.",
  },
  {
    q: "How much can families see?",
    a: "Exactly what you decide. Roles control access, so a family member can see the day's summary and upcoming visits without seeing pay rates, other clients, or internal agency notes.",
  },
  {
    q: "Is $40 per caregiver the whole cost?",
    a: "Yes. Client seats, family accounts, and the agency dashboard are included. There are no per-visit fees, setup fees, or charges for exports.",
  },
  {
    q: "Can we get our data out?",
    a: "Any time. Visits, notes, and timesheets export to CSV, and there's an API for agencies already running payroll or scheduling elsewhere.",
  },
  {
    q: "Is it available on both iOS and Android?",
    a: "Yes, with the same feature set on each. The agency dashboard also runs in any browser.",
  },
];

export function Faq() {
  const { safe, dist, time } = useMotion();
  // Single-open accordion. null means everything is collapsed.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{
            hidden: { opacity: 0, y: dist(22) },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: time(0.6), ease: EASE_OUT },
            },
          }}
          className="text-balance text-center text-3xl font-normal tracking-tight text-white sm:text-4xl"
        >
          Questions we get asked.
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer({ safe, stagger: 0.06, delayChildren: 0.1 })}
          className="mt-12 divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur-sm sm:p-3"
        >
          {FAQS.map((faq, i) => {
            const isOpen = open === i;

            return (
              <motion.div
                key={faq.q}
                variants={{
                  hidden: safe ? { opacity: 0, y: dist(14) } : { opacity: 0 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: time(0.45), ease: EASE_OUT },
                  },
                }}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="group flex w-full items-center justify-between gap-6 rounded-2xl px-4 py-5 text-left transition-colors hover:bg-white/5"
                  >
                    <span
                      className={cn(
                        "text-base font-semibold transition-colors duration-200",
                        isOpen
                          ? "text-kelo-300"
                          : "text-white group-hover:text-kelo-300",
                      )}
                    >
                      {faq.q}
                    </span>

                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: safe ? 0.3 : 0, ease: EASE_OUT }}
                      className={cn(
                        "flex h-8 w-8 flex-none items-center justify-center rounded-full transition-colors duration-200",
                        isOpen
                          ? "bg-kelo-600 text-white"
                          : "bg-white/10 text-white/50 group-hover:bg-kelo-500/20 group-hover:text-kelo-300",
                      )}
                    >
                      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                        <path
                          d="M4 6.5 8 10.5l4-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: safe ? 0.34 : 0, ease: EASE_OUT },
                        opacity: { duration: safe ? 0.24 : 0 },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-6 pr-14 text-pretty text-sm leading-relaxed text-white/50">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

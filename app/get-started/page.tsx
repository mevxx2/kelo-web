"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { ArrowRight, CtaButton } from "@/components/ui/button";
import {
  EASE_OUT,
  SPRING_SNAPPY,
  cardIn,
  staggerContainer,
  useMotion,
} from "@/lib/motion";

const ROLES = [
  {
    id: "caregiver",
    title: "Caregiver",
    body: "You visit clients and want logging that takes seconds, not a Sunday evening.",
    icon: (
      <path
        d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 7.5a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />
    ),
  },
  {
    id: "agency",
    title: "Agency",
    body: "You coordinate a team and need live coverage, compliance, and clean payroll exports.",
    icon: (
      <path
        d="M4 20V7l7-3v16M11 20h9V11l-9-3.5M14.5 12v.01M14.5 15.5v.01M17.5 12v.01M17.5 15.5v.01"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    id: "family",
    title: "Family member",
    body: "You want to know how the day went without having to phone and ask.",
    icon: (
      <path
        d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const { safe, dist, time } = useMotion();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer({ safe, stagger: 0.09 })}
      >
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: dist(20) },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: time(0.6), ease: EASE_OUT },
            },
          }}
          className="text-balance text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
        >
          Who&apos;s this for?
        </motion.h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: dist(16) },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: time(0.5), ease: EASE_OUT },
            },
          }}
          className="mx-auto mt-4 max-w-md text-pretty text-center text-base leading-relaxed text-slate-600"
        >
          We&apos;ll tailor setup to how you&apos;ll actually use Kelo Care.
        </motion.p>

        <motion.div
          variants={staggerContainer({ safe, stagger: 0.09, delayChildren: 0.12 })}
          role="radiogroup"
          aria-label="Select your role"
          className="mt-12 grid gap-4 sm:grid-cols-3"
        >
          {ROLES.map((role, i) => {
            const isSelected = selected === role.id;

            return (
              <motion.button
                key={role.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(role.id)}
                variants={cardIn({ safe, rotate: i === 1 ? 0 : i === 0 ? -2 : 2 })}
                whileHover={safe ? { y: -5 } : undefined}
                whileTap={safe ? { scale: 0.985 } : undefined}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className={cn(
                  "group relative flex flex-col rounded-3xl border p-6 text-left backdrop-blur-sm transition-colors duration-300",
                  isSelected
                    ? "border-kelo-600 bg-kelo-50/60 shadow-lift"
                    : "border-slate-200 bg-white/80 shadow-card hover:border-kelo-300",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-300",
                    isSelected
                      ? "bg-gradient-to-br from-kelo-500 to-sun-500 text-white"
                      : "bg-kelo-50 text-kelo-600 ring-1 ring-inset ring-kelo-100 group-hover:bg-kelo-100",
                  )}
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                    {role.icon}
                  </svg>
                </span>

                <span className="mt-4 text-base font-semibold text-slate-900">
                  {role.title}
                </span>
                <span className="mt-1.5 text-pretty text-sm leading-relaxed text-slate-600">
                  {role.body}
                </span>

                {/* Checkmark pops in on selection. */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      initial={safe ? { scale: 0, opacity: 0 } : { opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={safe ? { scale: 0, opacity: 0 } : { opacity: 0 }}
                      transition={SPRING_SNAPPY}
                      className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-kelo-500 to-sun-500 text-white"
                    >
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
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Continue reveals once a role is picked. Deliberately not an auto-advance:
          a card that navigates the instant it is clicked gives no chance to
          change your mind, and reads badly with a keyboard. */}
      <div className="mt-10 flex min-h-[3.5rem] justify-center">
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={safe ? { opacity: 0, y: 12 } : { opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={safe ? { opacity: 0, y: 8 } : { opacity: 0 }}
              transition={{ duration: time(0.35), ease: EASE_OUT }}
            >
              <CtaButton
                size="lg"
                onClick={() =>
                  router.push(`/get-started/signup?role=${selected}`)
                }
              >
                Continue
                <ArrowRight />
              </CtaButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

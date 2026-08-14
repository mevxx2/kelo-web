"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

import { TiltCard } from "@/components/ui/tilt-card";
import { cn } from "@/lib/utils";
import { cardIn, staggerContainer, useMotion, viewportOnce } from "@/lib/motion";

const FEATURES = [
  {
    id: "timer",
    title: "Visit timer",
    body: "One tap in, one tap out. Location-stamped, so hours are never a matter of recollection.",
    icon: <TimerIcon />,
  },
  {
    id: "notes",
    title: "Care notes & handoff",
    body: "Structured notes the next caregiver actually reads, attached to the client rather than a group chat.",
    icon: <NotesIcon />,
  },
  {
    id: "scheduling",
    title: "Scheduling",
    body: "Shifts, coverage gaps, and swaps in one calendar. Everyone sees changes the moment they happen.",
    icon: <CalendarIcon />,
  },
  {
    id: "dashboard",
    title: "Agency dashboard",
    body: "Live visibility across every caregiver and client, with the exports payroll and compliance need.",
    icon: <ChartIcon />,
  },
];

export function Features() {
  const { safe } = useMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [safe ? 28 : 0, safe ? -28 : 0]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative overflow-hidden bg-ink-950 py-24 sm:py-32"
    >
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer({ safe, stagger: 0.08 })}
          className="max-w-2xl"
        >
          <motion.p
            variants={cardIn({ safe, rotate: 0, y: 14 })}
            className="text-sm font-medium uppercase tracking-widest text-kelo-400"
          >
            Features
          </motion.p>
          <motion.h2
            variants={cardIn({ safe, rotate: 0, y: 20 })}
            className="mt-4 text-balance text-3xl font-normal tracking-tight text-white sm:text-4xl"
          >
            Everything a shift needs, nothing it doesn&apos;t.
          </motion.h2>
        </motion.div>

        <motion.div
          style={{ y: gridY }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer({ safe, stagger: 0.1, delayChildren: 0.1 })}
          className="mt-14 grid gap-5 sm:grid-cols-2"
        >
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.id}
              variants={cardIn({ safe, rotate: i % 2 === 0 ? -2.5 : 2.5 })}
              icon={feature.icon}
              title={feature.title}
              body={feature.body}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({
  variants,
  icon,
  title,
  body,
}: {
  variants: Variants;
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <TiltCard variants={variants} className="p-7">
      <span
        className={cn(
          "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-kelo-500/10 text-kelo-400",
          "ring-1 ring-inset ring-kelo-400/20 transition-all duration-300",
          "group-hover:bg-kelo-500 group-hover:text-white group-hover:ring-transparent",
          "motion-reduce:transition-none",
        )}
      >
        {icon}
      </span>
      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-white/50">
        {body}
      </p>
    </TiltCard>
  );
}

/* --- Icons. Each animates as part of the card's hover group. -------------- */

const ICON_CLASS = "h-6 w-6";

function TimerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON_CLASS} aria-hidden="true">
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 9.5V13l2.5 1.8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="origin-[12px_13px] transition-transform duration-500 group-hover:rotate-[120deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
      />
      <path
        d="M9.5 2.5h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON_CLASS} aria-hidden="true">
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 8.5h8M8 12h8M8 15.5h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        className="transition-opacity duration-300 group-hover:opacity-40"
      />
      <path
        d="M8.5 12.2l2 2 4.5-4.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON_CLASS} aria-hidden="true">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.5 10h17M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <rect
        x="7"
        y="13"
        width="4"
        height="4"
        rx="1"
        fill="currentColor"
        className="transition-transform duration-300 group-hover:translate-x-[6px] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON_CLASS} aria-hidden="true">
      <path
        d="M4 20h16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {[
        { x: 6, h: 5 },
        { x: 11, h: 9 },
        { x: 16, h: 7 },
      ].map((bar, i) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={17 - bar.h}
          width="3"
          height={bar.h}
          rx="1"
          fill="currentColor"
          // fill-box so the origin is the bar itself, not the SVG viewport.
          className="origin-bottom [transform-box:fill-box] transition-transform duration-300 group-hover:scale-y-125 motion-reduce:transition-none motion-reduce:group-hover:scale-y-100"
          style={{ transitionDelay: `${i * 70}ms` }}
        />
      ))}
    </svg>
  );
}

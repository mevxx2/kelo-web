"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { TiltCard } from "@/components/ui/tilt-card";
import { EASE_OUT, cardIn, staggerContainer, useMotion, viewportOnce } from "@/lib/motion";

const PAINS = [
  {
    value: 1,
    suffix: " in 4",
    title: "Visits go unlogged",
    body: "Paper timesheets and end-of-week recall mean hours get lost, disputed, or written off entirely.",
  },
  {
    value: 6,
    suffix: "+",
    title: "Places notes live",
    body: "Texts, whiteboards, a binder in the hallway. The next caregiver arrives without the last handoff.",
  },
  {
    // Counting up to zero has nothing to animate — AnimatedNumber still
    // renders it fine, just statically, so it stays visually consistent
    // with the other two cards without a special case in the markup.
    value: 0,
    suffix: "",
    title: "Real-time visibility",
    body: "Agencies and families find out something went wrong after it went wrong, not while it can be fixed.",
  },
];

// Progressive vertical offset per card, so the row reads as a cascade
// rather than a flat aligned grid. Mobile stacks normally (sm:-prefixed).
const CASCADE_OFFSET = ["sm:mt-0", "sm:mt-8", "sm:mt-16"];

export function Problem() {
  const { safe, dist, time } = useMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Continuous drift as the section crosses the viewport — scrolling itself
  // moves the grid, rather than the grid only moving once on the way in.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [safe ? 32 : 0, safe ? -32 : 0]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer({ safe, stagger: 0.1 })}
        className="relative mx-auto max-w-6xl px-5 sm:px-8"
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: dist(16) },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: time(0.5), ease: EASE_OUT },
            },
          }}
          className="text-sm font-medium uppercase tracking-widest text-kelo-400"
        >
          The problem
        </motion.p>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: dist(24) },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: time(0.65), ease: EASE_OUT },
            },
          }}
          className="mt-4 max-w-2xl text-balance text-3xl font-normal tracking-tight text-white sm:text-4xl"
        >
          Care work runs on memory and good intentions.
        </motion.h2>

        <motion.div
          style={{ y: gridY }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer({ safe, stagger: 0.12, delayChildren: 0.1 })}
          className="mt-14 grid items-start gap-5 sm:grid-cols-3"
        >
          {PAINS.map((pain, i) => (
            <TiltCard
              key={pain.title}
              variants={cardIn({
                safe,
                rotate: i % 2 === 0 ? -3 : 3,
                x: i % 2 === 0 ? -36 : 36,
                y: 34,
              })}
              className={`p-7 ${CASCADE_OFFSET[i]}`}
            >
              {/* Rule grows on hover, tying the stat to the copy below it. */}
              <span
                aria-hidden="true"
                className="absolute left-7 top-7 h-10 w-0.5 origin-top scale-y-100 bg-kelo-400/50 transition-all duration-500 group-hover:h-16 group-hover:opacity-100 motion-reduce:transition-none"
              />
              <p className="text-4xl font-semibold tabular-nums tracking-tight text-white">
                <AnimatedNumber value={pain.value} suffix={pain.suffix} />
              </p>
              <h3 className="mt-3 text-base font-semibold text-white">
                {pain.title}
              </h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-white/50">
                {pain.body}
              </p>
            </TiltCard>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { TiltSpotlight, useTilt } from "@/components/ui/tilt-card";
import { cardIn, staggerContainer, useMotion, viewportOnce, EASE_OUT } from "@/lib/motion";

/*
 * Placeholder quotes. Mev swaps these for real ones — keep the shape (quote,
 * name, role, org) and the cards will not need re-layout.
 */
const QUOTES = [
  {
    quote:
      "Placeholder quote about how much time the visit timer saves at the end of a week.",
    name: "Placeholder Name",
    role: "Caregiver",
    org: "Placeholder Home Care",
  },
  {
    quote:
      "Placeholder quote from an agency owner about finally seeing coverage without phoning around.",
    name: "Placeholder Name",
    role: "Agency owner",
    org: "Placeholder Care Group",
  },
  {
    quote:
      "Placeholder quote from a family member about knowing how the morning went without having to ask.",
    name: "Placeholder Name",
    role: "Family member",
    org: "Toronto, ON",
  },
];

export function Testimonials() {
  const { safe } = useMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [safe ? 30 : 0, safe ? -30 : 0]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={cardIn({ safe, rotate: 0, y: 20 })}
          className="max-w-2xl text-balance text-3xl font-normal tracking-tight text-white sm:text-4xl"
        >
          Built with the people doing the work.
        </motion.h2>

        <motion.div
          style={{ y: gridY }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer({ safe, stagger: 0.1, delayChildren: 0.08 })}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {QUOTES.map((item, i) => (
            <TestimonialCard key={i} item={item} rotate={i === 1 ? 0 : i === 0 ? -2 : 2} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialCard({
  item,
  rotate,
}: {
  item: (typeof QUOTES)[number];
  rotate: number;
}) {
  const { safe } = useMotion();
  const { ref, handlers, innerStyle, spotlightBackground } = useTilt<HTMLElement>();

  return (
    <motion.figure
      ref={ref}
      variants={cardIn({ safe, rotate })}
      onMouseMove={handlers.onMouseMove}
      onMouseLeave={handlers.onMouseLeave}
      whileHover={safe ? { rotate: 0 } : undefined}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.07]"
    >
      <TiltSpotlight background={spotlightBackground} />

      <motion.div style={innerStyle} className="relative flex flex-1 flex-col">
        <span
          aria-hidden="true"
          className="text-5xl font-bold leading-none text-kelo-500/40 transition-colors duration-300 group-hover:text-kelo-400/60"
        >
          &ldquo;
        </span>

        <blockquote className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-white/70">
          {item.quote}
        </blockquote>

        <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-kelo-600 text-sm font-semibold text-white">
            {item.role.charAt(0)}
          </span>
          <span className="text-sm">
            <span className="block font-semibold text-white">
              {item.name}
            </span>
            <span className="block text-white/40">
              {item.role} · {item.org}
            </span>
          </span>
        </figcaption>
      </motion.div>
    </motion.figure>
  );
}

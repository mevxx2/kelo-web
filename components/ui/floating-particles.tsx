"use client";

import { motion } from "framer-motion";

import { HeartIcon } from "@/components/ui/heart-icon";
import { cn } from "@/lib/utils";
import { useMotionSafe } from "@/lib/motion";
import { mulberry32 } from "@/lib/random";

/*
 * Ambient dots-and-hearts drift, dropped into the otherwise-static light
 * sections (Problem, Features, Testimonials, Pricing, FAQ) so the page keeps
 * some life to it between the big scroll-triggered reveals rather than only
 * moving once as each section enters.
 *
 * Deliberately cheap: a handful of absolutely-positioned elements looping a
 * slow transform+opacity drift, not a canvas — this runs continuously on
 * every section at once, so it needs to stay far lighter than the hero's
 * particle canvas.
 */

interface FloatingParticlesProps {
  count?: number;
  /** Distinct per section so their layouts don't all echo each other. */
  seed?: number;
  className?: string;
}

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  isHeart: boolean;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  tone: "kelo" | "sun";
}

function buildParticles(count: number, seed: number): Particle[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => {
    const isHeart = rand() < 0.35;
    return {
      id: i,
      left: rand() * 92 + 4,
      top: rand() * 84 + 8,
      size: isHeart ? 9 + rand() * 7 : 4 + rand() * 5,
      isHeart,
      duration: 12 + rand() * 12,
      delay: rand() * 8,
      driftX: (rand() - 0.5) * 50,
      driftY: -(24 + rand() * 46),
      tone: rand() < 0.5 ? "kelo" : "sun",
    };
  });
}

export function FloatingParticles({
  count = 7,
  seed = 1,
  className,
}: FloatingParticlesProps) {
  const safe = useMotionSafe();

  // Purely decorative ambient motion — under reduced motion it adds nothing
  // but distraction, so skip it entirely rather than render it static.
  if (!safe) return null;

  const particles = buildParticles(count, seed);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            x: [0, p.driftX, 0],
            y: [0, p.driftY, 0],
            opacity: [0, 0.55, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {p.isHeart ? (
            <HeartIcon className={p.tone === "kelo" ? "text-kelo-300" : "text-sun-300"} />
          ) : (
            <div
              className={cn(
                "h-full w-full rounded-full",
                p.tone === "kelo" ? "bg-kelo-400" : "bg-sun-400",
              )}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

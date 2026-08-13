"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { HeartIcon } from "@/components/ui/heart-icon";
import { cn } from "@/lib/utils";
import { EASE_OUT, useMotionSafe } from "@/lib/motion";
import { mulberry32 } from "@/lib/random";

/*
 * First-visit opening sequence: a scatter of dots and hearts drifts inward
 * from the edges, converges into a burst of light, then the whole curtain
 * dissolves to reveal the already-rendered page underneath.
 *
 * The page itself is not gated on this — Hero mounts and plays its own
 * entrance immediately, just hidden behind this opaque overlay. By the time
 * the overlay lifts, Hero has long since settled, so there's no visible
 * double-animation or race to coordinate.
 *
 * Plays once per browser tab (sessionStorage), and is skipped entirely under
 * reduced motion.
 */

const SESSION_KEY = "kelo-intro-seen";
const PARTICLE_COUNT = 26;

type Phase = "gathering" | "flash" | "exiting";

interface Particle {
  id: number;
  angle: number;
  /** Starting distance from centre, in vmin so it scales with the viewport. */
  radius: number;
  size: number;
  isHeart: boolean;
  delay: number;
  tone: "kelo" | "sun";
}

// Seeded, not Math.random: the layout must be identical on the server render
// and the client hydration pass, or React flags a mismatch.
const PARTICLES: Particle[] = (() => {
  const rand = mulberry32(20260812);
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    angle: rand() * Math.PI * 2,
    radius: 18 + rand() * 26,
    size: rand() < 0.32 ? 10 + rand() * 10 : 5 + rand() * 6,
    isHeart: rand() < 0.32,
    delay: rand() * 0.5,
    tone: rand() < 0.5 ? "kelo" : "sun",
  }));
})();

export function IntroOverlay() {
  const safe = useMotionSafe();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("gathering");
  const timers = useRef<number[]>([]);

  const finish = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage can throw in sandboxed/private contexts — nothing to do,
      // the overlay just replays next time, which is harmless.
    }
    setVisible(false);
  };

  // Decide once, on mount, whether to play. Deferred to an effect (rather
  // than computed during render) because sessionStorage/matchMedia aren't
  // available during SSR — see the identical reasoning on useMotionSafe.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = true;
    }
    if (seen || !safe) return;
    setVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safe]);

  useEffect(() => {
    if (!visible) return;

    const schedule = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms));
    };

    schedule(() => setPhase("flash"), 1650);
    schedule(() => setPhase("exiting"), 2100);
    schedule(finish, 2600);

    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const skip = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setPhase("exiting");
    timers.current.push(window.setTimeout(finish, 500));
  };

  if (!visible) return null;

  const burst = phase === "flash" || phase === "exiting";

  return (
    <motion.div
      role="presentation"
      aria-hidden="true"
      onClick={skip}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exiting" ? 0 : 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="fixed inset-0 z-[999] cursor-pointer overflow-hidden bg-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgb(var(--kelo-50)),transparent_75%)]" />

      {PARTICLES.map((p) => {
        const startX = Math.cos(p.angle) * p.radius;
        const startY = Math.sin(p.angle) * p.radius;

        return (
          <motion.div
            key={p.id}
            initial={{ x: `${startX}vmin`, y: `${startY}vmin`, opacity: 0, scale: 0.4 }}
            animate={
              burst
                ? { x: "0vmin", y: "0vmin", opacity: 0, scale: 2.2 }
                : { x: "0vmin", y: "0vmin", opacity: 1, scale: 1 }
            }
            transition={
              burst
                ? { duration: 0.45, ease: EASE_OUT }
                : { duration: 1.1, delay: p.delay, ease: EASE_OUT }
            }
            className="absolute left-1/2 top-1/2"
            style={{
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
            }}
          >
            {p.isHeart ? (
              <HeartIcon className={p.tone === "kelo" ? "text-kelo-400" : "text-sun-400"} />
            ) : (
              <div
                className={cn(
                  "h-full w-full rounded-full",
                  p.tone === "kelo" ? "bg-kelo-500" : "bg-sun-500",
                )}
              />
            )}
          </motion.div>
        );
      })}

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={
          burst
            ? { opacity: [0, 1, 0], scale: [0.3, 2.6, 3.4] }
            : { opacity: 0, scale: 0.3 }
        }
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(var(--kelo-300)/1),rgb(var(--sun-200)/0.6),transparent_70%)] blur-xl"
      />
    </motion.div>
  );
}

"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useMotionSafe } from "@/lib/motion";

type LivingCardProps = {
  children: ReactNode;
  className?: string;
  breathe?: number;
  interactive?: boolean;
};

export function LivingCard({
  children,
  className,
  breathe = 1.015,
  interactive = true,
}: LivingCardProps) {
  const safe = useMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, { stiffness: 180, damping: 24 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 180, damping: 24 });

  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    if (!safe || !interactive || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    rotateXRaw.set(py * -5);
    rotateYRaw.set(px * 6);
  };

  const reset = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  };

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ scale: 1 }}
      whileInView={safe ? { scale: [1, breathe, 1] } : { scale: 1 }}
      viewport={{ amount: 0.1, margin: "120px 0px 120px 0px" }}
      transition={safe ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      className={cn(
        "living-card group relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/[0.075] shadow-[0_22px_70px_-34px_rgba(4,7,28,.9),inset_0_1px_0_rgba(255,255,255,.18)] backdrop-blur-xl",
        "transition-[border-color,background-color,box-shadow] duration-500 hover:border-kelo-300/45 hover:bg-white/[0.11] hover:shadow-[0_28px_90px_-32px_rgba(50,0,202,.7),inset_0_1px_0_rgba(255,255,255,.22)]",
        "motion-reduce:transform-none motion-reduce:animate-none motion-reduce:bg-white/[0.08] motion-reduce:shadow-[0_12px_34px_-24px_rgba(4,7,28,.8)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_circle_at_var(--card-x,50%)_var(--card-y,0%),rgba(255,255,255,.11),transparent_44%)] opacity-70" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

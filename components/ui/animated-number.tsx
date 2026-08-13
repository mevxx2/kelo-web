"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";

import { EASE_OUT, useMotionSafe } from "@/lib/motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/** Counts up from 0 to `value` once it scrolls into view. Static under reduced motion. */
export function AnimatedNumber({
  value,
  duration = 1.4,
  prefix = "",
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const safe = useMotionSafe();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toString());

  useEffect(() => {
    if (!inView) return;
    if (!safe) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration, ease: EASE_OUT });
    return () => controls.stop();
  }, [inView, safe, value, duration, count]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

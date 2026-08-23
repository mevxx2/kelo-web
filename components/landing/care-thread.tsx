"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useMotionSafe } from "@/lib/motion";

const THREAD_PATH =
  "M500 0 C500 160 500 250 500 360 C500 420 430 445 455 500 C478 550 520 440 548 500 C570 548 588 525 612 500 C650 460 710 490 680 560 C645 640 500 630 500 760 C500 920 340 930 340 1080 C340 1220 610 1160 620 1340 C630 1510 415 1515 430 1690 C445 1840 650 1830 610 2030 C575 2210 365 2180 385 2380 C405 2580 650 2530 625 2750 C605 2925 380 2940 405 3160 C430 3375 655 3320 620 3540 C595 3730 350 3740 390 3960 C425 4160 660 4100 620 4350 C590 4550 420 4520 420 4740 C420 4910 600 4890 595 5100 C590 5320 390 5280 410 5500 C430 5710 655 5680 620 5900 C590 6100 360 6090 395 6340 C430 6560 640 6500 610 6750 C585 6970 415 6910 420 7180 C425 7390 600 7370 580 7580 C560 7780 470 7800 500 8000";

export function CareCanvas({
  children,
  variant = "consumer",
}: {
  children: ReactNode;
  variant?: "consumer" | "agency";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const safe = useMotionSafe();
  const [light, setLight] = useState(false);

  useEffect(() => {
    const sync = () => setLight(document.documentElement.dataset.theme === "light");
    sync();
    window.addEventListener("kelo-theme-change", sync);
    return () => window.removeEventListener("kelo-theme-change", sync);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 24, restDelta: 0.001 });
  const pathLength = useTransform(progress, (value) => (safe ? value : 1));
  const backgroundColor = useTransform(
    progress,
    [0, 0.24, 0.62, 1],
    light
      ? variant === "agency"
        ? ["#ffffff", "#f6f9ff", "#eef4ff", "#f8f7ff"]
        : ["#ffffff", "#f8faff", "#f2f5ff", "#f8f7ff"]
      : variant === "agency"
        ? ["#020713", "#06132b", "#0b1b45", "#100d29"]
        : ["#000000", "#05050a", "#0b1240", "#100d29"],
  );

  return (
    <motion.div
      ref={ref}
      style={{ backgroundColor }}
      data-care-variant={variant}
      className="care-canvas relative isolate overflow-hidden"
    >
      <div aria-hidden="true" className="care-ambient pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="care-grain pointer-events-none absolute inset-0 z-[1] opacity-[0.055]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-full">
        <svg viewBox="0 0 1000 8000" preserveAspectRatio="none" className="h-full w-full overflow-visible" fill="none">
          <path d={THREAD_PATH} stroke="rgba(139,157,255,.12)" strokeWidth="5" vectorEffect="non-scaling-stroke" />
          <motion.path
            d={THREAD_PATH}
            style={{ pathLength }}
            stroke="url(#threadGradient)"
            strokeWidth="2.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="thread-pulse global-thread"
          />
          <defs>
            <linearGradient id="threadGradient" x1="0" y1="0" x2="0" y2="8000" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffd7b0" />
              <stop offset=".22" stopColor="#aa9cff" />
              <stop offset=".55" stopColor="#6d72ff" />
              <stop offset="1" stopColor="#4d38bd" stopOpacity=".25" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

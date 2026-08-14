"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE_OUT, useIsCompact, useMotionSafe } from "@/lib/motion";

/*
 * Fanned app screens for the hero.
 *
 * Entrance is "collapse then deal": every card starts stacked dead centre,
 * slightly small and invisible, then springs out to its position in the fan one
 * after another. The component exposes itself as a stagger parent driven by
 * `variants`, so the hero's orchestration timeline controls when the deal fires
 * rather than the stack deciding for itself.
 *
 * The screens are rendered markup, not screenshots — no image assets required,
 * and they stay crisp at any density. Swap PhoneFrame's children for real
 * <Image> captures when they exist.
 */

interface CardPosition {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  z: number;
}

const FANNED: CardPosition[] = [
  { x: -268, y: 34, rotate: -14, scale: 0.88, z: 1 },
  { x: -140, y: -6, rotate: -7, scale: 0.94, z: 2 },
  { x: 0, y: -36, rotate: 0, scale: 1, z: 3 },
  { x: 140, y: -6, rotate: 7, scale: 0.94, z: 2 },
  { x: 268, y: 34, rotate: 14, scale: 0.88, z: 1 },
];

const FANNED_COMPACT: CardPosition[] = [
  { x: -96, y: 18, rotate: -11, scale: 0.84, z: 1 },
  { x: 0, y: -14, rotate: 0, scale: 0.95, z: 3 },
  { x: 96, y: 18, rotate: 11, scale: 0.84, z: 1 },
];

export function CardStack({ className }: { className?: string }) {
  const safe = useMotionSafe();
  const compact = useIsCompact();
  const [hovered, setHovered] = useState<number | null>(null);

  const layout = compact ? FANNED_COMPACT : FANNED;
  const screens = compact ? SCREENS.slice(1, 4) : SCREENS;

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: safe ? 0.085 : 0,
        delayChildren: safe ? 0.1 : 0,
      },
    },
  };

  const cardVariants = (pos: CardPosition): Variants => {
    if (!safe) {
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          x: pos.x,
          y: pos.y,
          rotate: pos.rotate,
          scale: pos.scale,
          transition: { duration: 0.2 },
        },
      };
    }

    return {
      // Collapsed: squared up in one pile at centre, edge-on and out of
      // focus — as if the stack hasn't resolved into cards yet.
      hidden: {
        opacity: 0,
        x: 0,
        y: 28,
        rotate: 0,
        rotateY: -85,
        scale: 0.86,
        filter: "blur(10px)",
      },
      // Dealt: spins open face-on and sharpens into focus as it lands in
      // the fan. Blur gets its own tween — a spring on a blur radius
      // overshoots into negative values, which is not a valid blur.
      visible: {
        opacity: 1,
        x: pos.x,
        y: pos.y,
        rotate: pos.rotate,
        rotateY: 0,
        scale: pos.scale,
        filter: "blur(0px)",
        transition: {
          default: { type: "spring", stiffness: 140, damping: 20, mass: 0.9 },
          filter: { duration: 0.5, ease: EASE_OUT },
        },
      },
    };
  };

  return (
    <motion.div
      variants={container}
      className={cn(
        "relative mx-auto w-full",
        compact ? "h-[320px]" : "h-[460px]",
        className,
      )}
      // The fan is decorative; the hero headline carries the meaning.
      aria-hidden="true"
    >
      {screens.map((screen, i) => {
        const pos = layout[i];
        const isHovered = hovered === i;
        // The centre card (highest z) idles with a gentle float, so the
        // stack still feels alive even before anyone touches it.
        const isCenter = pos.z === Math.max(...layout.map((p) => p.z));

        return (
          <motion.div
            key={screen.id}
            variants={cardVariants(pos)}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            whileHover={
              safe
                ? {
                    y: pos.y - 22,
                    rotate: pos.rotate * 0.25,
                    scale: pos.scale * 1.05,
                    transition: { duration: 0.35, ease: EASE_OUT },
                  }
                : undefined
            }
            style={{ zIndex: isHovered ? 10 : pos.z, transformPerspective: 1200 }}
            // Every wrapper fills the whole stack, so without pointer-events-none
            // the highest-z wrapper would swallow hovers meant for the cards
            // beside it. The frame itself opts back in.
            className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
          >
            <PhoneFrame
              compact={compact}
              accent={screen.accent}
              floating={safe && isCenter}
            >
              {screen.body}
            </PhoneFrame>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function PhoneFrame({
  children,
  compact,
  accent,
  floating = false,
}: {
  children: React.ReactNode;
  compact: boolean;
  accent: boolean;
  floating?: boolean;
}) {
  return (
    <div
      className={cn(
        // The mock screens inside show the actual product's (light) UI, so
        // the frame stays a light glass pane by design — it's meant to read
        // as a physical phone floating on the dark marketing page, not to
        // match the page's own theme.
        "pointer-events-auto relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 backdrop-blur-xl",
        "shadow-[0_24px_60px_-16px_rgb(0_0_0/0.7),0_0_0_1px_rgb(255_255_255/0.7)_inset]",
        compact ? "h-[280px] w-[140px]" : "h-[400px] w-[200px]",
        accent && "border-kelo-300",
        // A CSS animation, not a framer-motion one, so it composes with the
        // parent's framer-controlled transform instead of overriding it.
        floating && "animate-float",
      )}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-slate-200" />
      <div className={cn("h-full w-full pt-7", compact ? "px-2.5" : "px-3.5")}>
        {children}
      </div>
    </div>
  );
}

/* --- Mock screen contents ------------------------------------------------ */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </p>
  );
}

function Bar({ w, tone = "slate" }: { w: string; tone?: "slate" | "kelo" }) {
  return (
    <div
      className={cn(
        "h-1.5 rounded-full",
        tone === "kelo" ? "bg-kelo-200" : "bg-slate-100",
      )}
      style={{ width: w }}
    />
  );
}

const SCREENS = [
  {
    id: "schedule",
    accent: false,
    body: (
      <div className="space-y-3">
        <Label>Today</Label>
        {[
          { time: "9:00", name: "Ada M.", active: false },
          { time: "11:30", name: "Joseph K.", active: true },
          { time: "14:00", name: "Rosa L.", active: false },
          { time: "16:15", name: "Ken T.", active: false },
        ].map((visit) => (
          <div
            key={visit.time}
            className={cn(
              "flex items-center gap-2 rounded-xl p-2",
              visit.active ? "bg-kelo-50 ring-1 ring-kelo-100" : "bg-slate-50",
            )}
          >
            <span className="text-[9px] font-semibold tabular-nums text-slate-500">
              {visit.time}
            </span>
            <div className="flex-1 space-y-1">
              <div className="text-[10px] font-semibold text-slate-700">
                {visit.name}
              </div>
              <Bar w="70%" tone={visit.active ? "kelo" : "slate"} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "notes",
    accent: false,
    body: (
      <div className="space-y-3">
        <Label>Care notes</Label>
        <div className="space-y-2 rounded-xl bg-slate-50 p-2.5">
          {["Medication given", "Mobility walk", "Lunch prepared"].map(
            (task, i) => (
              <div key={task} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-3.5 w-3.5 items-center justify-center rounded-full",
                    i < 2 ? "bg-kelo-600" : "border border-slate-300",
                  )}
                >
                  {i < 2 && (
                    <svg viewBox="0 0 12 12" className="h-2 w-2 text-white">
                      <path
                        d="M2.5 6.2 5 8.5l4.5-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-[10px] text-slate-600">{task}</span>
              </div>
            ),
          )}
        </div>
        <div className="space-y-1.5 rounded-xl border border-slate-100 p-2.5">
          <Bar w="90%" />
          <Bar w="75%" />
          <Bar w="55%" />
        </div>
      </div>
    ),
  },
  {
    id: "timer",
    accent: true,
    body: (
      <div className="flex h-full flex-col items-center pt-6">
        <Label>Visit in progress</Label>
        <div className="relative mt-6 flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-kelo-100/70 animate-pulse-ring" />
          <span className="absolute inset-0 rounded-full border-2 border-kelo-200" />
          <span className="relative text-base font-bold tabular-nums text-kelo-700">
            41:08
          </span>
        </div>
        <p className="mt-5 text-[11px] font-semibold text-slate-700">Joseph K.</p>
        <p className="text-[9px] text-slate-400">12 Ellsworth Ave</p>
        <div className="mt-5 w-full rounded-full bg-kelo-600 py-2 text-center text-[10px] font-semibold text-white">
          End visit
        </div>
      </div>
    ),
  },
  {
    id: "handoff",
    accent: false,
    body: (
      <div className="space-y-3">
        <Label>Handoff</Label>
        <div className="space-y-2">
          <div className="ml-4 rounded-2xl rounded-tr-sm bg-kelo-600 p-2 text-[9px] leading-relaxed text-white">
            Ada slept well. Breakfast at 8.
          </div>
          <div className="mr-4 space-y-1 rounded-2xl rounded-tl-sm bg-slate-100 p-2">
            <Bar w="85%" />
            <Bar w="60%" />
          </div>
          <div className="ml-4 rounded-2xl rounded-tr-sm bg-kelo-600 p-2 text-[9px] leading-relaxed text-white">
            Refill due Thursday.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "dashboard",
    accent: false,
    body: (
      <div className="space-y-3">
        <Label>This week</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { v: "98%", l: "On time" },
            { v: "142", l: "Visits" },
          ].map((stat) => (
            <div key={stat.l} className="rounded-xl bg-slate-50 p-2">
              <div className="text-xs font-bold text-kelo-700">{stat.v}</div>
              <div className="text-[8px] text-slate-400">{stat.l}</div>
            </div>
          ))}
        </div>
        <div className="flex h-20 items-end gap-1.5 rounded-xl border border-slate-100 p-2">
          {[45, 70, 55, 88, 62, 95, 74].map((h, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-sm",
                i === 5 ? "bg-kelo-600" : "bg-kelo-100",
              )}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    ),
  },
];

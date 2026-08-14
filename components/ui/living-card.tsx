import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type LivingCardProps = {
  children: ReactNode;
  className?: string;
  breathe?: number;
  interactive?: boolean;
};

/**
 * A lightweight glass surface. The former version created two springs and an
 * infinite scale animation for every card; a page full of cards therefore kept
 * the main thread busy even while idle. Hover feedback is now handled by CSS,
 * which stays on the compositor and is disabled for touch/reduced-motion users.
 */
export function LivingCard({ children, className }: LivingCardProps) {
  return (
    <div
      className={cn(
        "living-card group relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/[0.075] shadow-[0_22px_70px_-34px_rgba(4,7,28,.9),inset_0_1px_0_rgba(255,255,255,.18)] backdrop-blur-md",
        "transition-[transform,border-color,background-color,box-shadow] duration-300 hover:border-kelo-300/45 hover:bg-white/[0.11] hover:shadow-[0_24px_70px_-34px_rgba(50,0,202,.62),inset_0_1px_0_rgba(255,255,255,.22)]",
        "motion-reduce:transform-none motion-reduce:transition-none motion-reduce:bg-white/[0.08] motion-reduce:shadow-[0_12px_34px_-24px_rgba(4,7,28,.8)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_circle_at_50%_0%,rgba(255,255,255,.1),transparent_44%)] opacity-60" />
      <div className="relative">{children}</div>
    </div>
  );
}

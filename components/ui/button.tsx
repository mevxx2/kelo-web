"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";
import { SPRING_SNAPPY, useMotionSafe } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "glass" | "glassOutline";
type Size = "md" | "lg";

interface CtaButtonProps {
  children: ReactNode;
  /** Renders a next/link when set, a native button otherwise. */
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  /** Magnetic pull strength. 0 disables it — right for dense secondary actions. */
  magnetic?: number;
  /**
   * Stretch to the container width. Needed as a prop rather than a `w-full`
   * class because the magnetic wrapper sits between the container and the
   * element that receives `className`.
   */
  fullWidth?: boolean;
  className?: string;
  "aria-label"?: string;
}

const VARIANTS: Record<Variant, string> = {
  // The gradient stays fixed rather than shifting on hover: background-image
  // (what a gradient renders as) can't be CSS-transitioned, so a hover-state
  // gradient swap would snap instead of animate. Hover feedback instead comes
  // from the existing scale/shadow/sheen, which do animate.
  primary:
    "heartbeat-button bg-gradient-to-br from-kelo-500 to-kelo-700 text-white shadow-glow hover:shadow-lift focus-visible:outline-kelo-400",
  secondary:
    "bg-white/8 text-white ring-1 ring-inset ring-white/15 hover:bg-white/14 hover:ring-white/25 focus-visible:outline-kelo-400",
  ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
  inverse:
    "bg-white text-kelo-700 shadow-lift hover:bg-kelo-50 focus-visible:outline-white",
  // Small, restrained glass pills — a light translucent pane with a subtle
  // ring, not a thick glowing slab. `glass` mirrors a light pill with a
  // saturated accent-colored label (the primary action); `glassOutline` is a
  // quieter grey-glass pill for the secondary action.
  glass:
    "bg-white/90 text-kelo-700 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)] ring-1 ring-inset ring-white/60 backdrop-blur-xl hover:bg-white focus-visible:outline-kelo-400",
  glassOutline:
    "bg-white/10 text-white ring-1 ring-inset ring-white/20 backdrop-blur-xl hover:bg-white/16 focus-visible:outline-white",
};

const SIZES: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

/**
 * Primary call to action. On capable pointers it leans toward the cursor while
 * hovered, then springs back on exit — enough to feel responsive without the
 * button ever drifting far enough to be hard to click.
 */
export function CtaButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  magnetic = 0.28,
  fullWidth = false,
  className,
  ...rest
}: CtaButtonProps) {
  const safe = useMotionSafe();
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_SNAPPY);
  const y = useSpring(rawY, SPRING_SNAPPY);

  const pullEnabled = safe && magnetic > 0 && !disabled;

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!pullEnabled || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - (bounds.left + bounds.width / 2);
    const offsetY = event.clientY - (bounds.top + bounds.height / 2);
    // Cap the travel so the hit target never runs away from the pointer.
    rawX.set(Math.max(-14, Math.min(14, offsetX * magnetic)));
    rawY.set(Math.max(-10, Math.min(10, offsetY * magnetic)));
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold",
    "transition-colors duration-200 will-change-transform",
    "disabled:cursor-not-allowed disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    fullWidth && "w-full",
    className,
  );

  const inner = (
    <>
      {/* Sheen sweep on hover. Purely decorative, sits under the label. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden"
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={pullEnabled ? { x, y } : undefined}
      whileHover={safe && !disabled ? { scale: 1.03 } : undefined}
      whileTap={safe && !disabled ? { scale: 0.97 } : undefined}
      transition={SPRING_SNAPPY}
      className={cn("inline-flex", fullWidth && "w-full")}
    >
      {href && !disabled ? (
        <Link href={href} className={classes} {...rest}>
          {inner}
        </Link>
      ) : (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={classes}
          {...rest}
        >
          {inner}
        </button>
      )}
    </motion.div>
  );
}

/** Arrow that nudges right on parent hover. Pairs with CtaButton's group class. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn(
        "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0",
        className,
      )}
    >
      <path
        d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

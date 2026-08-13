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
    "bg-gradient-to-br from-kelo-500 to-kelo-700 text-white shadow-glow hover:shadow-lift focus-visible:outline-kelo-700",
  secondary:
    "bg-white text-slate-900 ring-1 ring-inset ring-slate-200 shadow-card hover:ring-kelo-300 hover:text-kelo-700",
  ghost: "bg-transparent text-slate-700 hover:text-kelo-700 hover:bg-kelo-50",
  inverse:
    "bg-white text-kelo-700 shadow-lift hover:bg-kelo-50 focus-visible:outline-white",
  // "Liquid glass" — a thick frosted pane rather than a flat translucent
  // tint: a bright inset rim catches light at the top edge, a deep tinted
  // shadow gives it glass thickness, and a diagonal specular streak (added
  // separately in `inner`, since it needs its own layer) sits on top like a
  // reflection. `glass` is the saturated blue pane (primary CTA); `glassOutline`
  // is the same construction in a lighter, unsaturated pane (secondary CTA).
  glass: cn(
    "bg-gradient-to-br from-kelo-400/60 via-kelo-600/55 to-kelo-800/65 text-white backdrop-blur-2xl",
    "ring-1 ring-inset ring-white/50",
    "hover:from-kelo-400/70 hover:via-kelo-600/65 hover:to-kelo-800/75 focus-visible:outline-white",
    "shadow-[0_16px_40px_-12px_rgb(37_96_235/0.55),inset_0_1.5px_1px_rgb(255_255_255/0.8),inset_0_-10px_18px_-10px_rgb(15_35_90/0.45)]",
  ),
  glassOutline: cn(
    "bg-white/25 text-slate-900 backdrop-blur-2xl",
    "ring-1 ring-inset ring-white/60",
    "hover:bg-white/40 focus-visible:outline-kelo-700",
    "shadow-[0_16px_36px_-14px_rgb(15_23_42/0.3),inset_0_1.5px_1px_rgb(255_255_255/0.9),inset_0_-10px_18px_-10px_rgb(15_23_42/0.06)]",
  ),
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

  const isLiquidGlass = variant === "glass" || variant === "glassOutline";

  const inner = (
    <>
      {isLiquidGlass && (
        <>
          {/* Static diagonal reflection — the part that actually reads as
              "glass" rather than just a translucent tint. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 22%, rgb(255 255 255 / 0.55) 40%, rgb(255 255 255 / 0.12) 53%, transparent 68%)",
            }}
          />
          {/* Thin bright top edge, like light catching the rim of the pane. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-3 top-0 h-px bg-white/80"
          />
        </>
      )}

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

"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "glass" | "glassOutline";
type Size = "md" | "lg";

interface CtaButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  magnetic?: number;
  fullWidth?: boolean;
  className?: string;
  "aria-label"?: string;
}

const VARIANTS: Record<Variant, string> = {
  primary: "heartbeat-button bg-gradient-to-br from-kelo-500 to-kelo-700 text-white shadow-glow focus-visible:outline-kelo-400",
  secondary: "bg-white/8 text-white ring-1 ring-inset ring-white/15 hover:bg-white/14 hover:ring-white/25 focus-visible:outline-kelo-400",
  ghost: "bg-transparent text-white/70 hover:bg-white/5 hover:text-white",
  inverse: "bg-white text-kelo-700 shadow-lift hover:bg-kelo-50 focus-visible:outline-white",
  glass: "bg-white/90 text-kelo-700 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)] ring-1 ring-inset ring-white/60 backdrop-blur-md hover:bg-white focus-visible:outline-kelo-400",
  glassOutline: "bg-white/10 text-white ring-1 ring-inset ring-white/20 backdrop-blur-md hover:bg-white/16 focus-visible:outline-white",
};

const SIZES: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export function CtaButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  magnetic: _magnetic = 0,
  fullWidth = false,
  className,
  ...rest
}: CtaButtonProps) {
  void _magnetic;
  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold",
    "transition-[transform,background-color,color,box-shadow] duration-200 hover:scale-[1.025] active:scale-[.98] motion-reduce:transform-none",
    "disabled:cursor-not-allowed disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    fullWidth && "w-full",
    className,
  );

  const inner = (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full motion-reduce:hidden" />
      <span className="relative flex items-center gap-2">{children}</span>
    </>
  );

  if (href && !disabled) {
    return <Link href={href} className={classes} {...rest}>{inner}</Link>;
  }

  return <button type={type} onClick={onClick} disabled={disabled} className={classes} {...rest}>{inner}</button>;
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={cn("h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0", className)}>
      <path d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

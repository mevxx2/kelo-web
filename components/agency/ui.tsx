"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type ClassValue = string | number | null | undefined | false;
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "ag-cta bg-gradient-to-br from-kelo-500 to-kelo-700 text-white shadow-glow",
  secondary: "bg-white text-kelo-700 ring-1 ring-inset ring-kelo-600/20 hover:bg-kelo-50",
  ghost: "bg-transparent text-ink-800 hover:bg-kelo-50",
};
const SIZES: Record<Size, string> = { md: "min-h-11 px-5 py-2.5 text-sm", lg: "min-h-14 px-7 py-3 text-base" };

export function CtaButton({ children, href, onClick, type = "button", variant = "primary", size = "md", disabled = false, fullWidth = false, className }: {
  children: ReactNode; href?: string; onClick?: () => void; type?: "button" | "submit"; variant?: Variant; size?: Size; disabled?: boolean; fullWidth?: boolean; className?: string;
}) {
  const classes = cn(
    "group relative inline-flex min-w-0 max-w-full items-center justify-center gap-2 overflow-hidden rounded-full text-center font-semibold",
    "transition-[transform,background-color,color,box-shadow] duration-200 hover:scale-[1.025] active:scale-[.98] motion-reduce:transform-none",
    "disabled:cursor-not-allowed disabled:opacity-60",
    VARIANTS[variant], SIZES[size], fullWidth && "w-full", className,
  );
  const inner = (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full motion-reduce:hidden" />
      <span className="relative flex min-w-0 items-center justify-center gap-2">{children}</span>
    </>
  );
  if (href && !disabled) return <Link href={href} className={classes}>{inner}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={classes}>{inner}</button>;
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={cn("h-4 w-4 transition-transform duration-300 group-hover:translate-x-1", className)}>
      <path d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LivingCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("living-card group relative min-w-0 overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/[0.075] transition-[transform,border-color,box-shadow] duration-300", className)}>
      <div className="relative min-w-0 [overflow-wrap:anywhere]">{children}</div>
    </div>
  );
}

export function CareCanvas({ children }: { children: ReactNode; variant?: "agency" }) {
  return (
    <div className="ag-canvas relative isolate min-h-screen overflow-hidden" data-care-variant="agency">
      {children}
    </div>
  );
}

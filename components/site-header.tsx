"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { Nav } from "@/components/landing/nav";
import { EASE_OUT, useMotionSafe } from "@/lib/motion";
import { ThemeToggle } from "@/components/theme-toggle";

/*
 * Route-aware header.
 *
 * Rendered by the root layout *outside* PageTransition on purpose: the
 * transition wrapper animates `transform`, and a transformed ancestor turns
 * `position: fixed` into position-relative-to-that-ancestor, which would break
 * the sticky nav. Keeping the header out of that subtree avoids the whole class
 * of bug.
 */
export function SiteHeader() {
  const pathname = usePathname();

  if (pathname.startsWith("/get-started")) {
    return <FunnelHeader />;
  }

  return <Nav />;
}

function FunnelHeader() {
  const safe = useMotionSafe();

  return (
    <motion.header
      initial={safe ? { y: -16, opacity: 0 } : { opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: safe ? 0.45 : 0.15, ease: EASE_OUT }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4"
    >
        <div className="flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border border-white/15 bg-white/[0.075] px-4 py-2.5 shadow-lift backdrop-blur-xl sm:px-5 sm:py-3">
        <Link
          href="/"
          className="group flex items-center"
          aria-label="Kelo Care home"
        >
          <Image
            src="/images/logo.png"
            alt="Kelo Care"
            width={332}
            height={277}
            className="h-9 w-auto flex-shrink-0 transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
          />
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="nav-underline group inline-flex items-center gap-1.5 text-sm font-medium text-white/65"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden="true">
              <path d="M16 10H4m0 0 4.5-4.5M4 10l4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to site
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

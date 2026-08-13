"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { CtaButton } from "@/components/ui/button";
import { EASE_OUT, useMotionSafe } from "@/lib/motion";

const LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export function Nav() {
  const safe = useMotionSafe();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // The pill stays translucent over the hero and turns opaque once the hero
  // has scrolled past it. Watching the hero element directly beats a magic
  // pixel threshold, since the hero's height varies with viewport and copy.
  useEffect(() => {
    const hero = document.getElementById("hero");

    if (!hero) {
      const onScroll = () => setSolid(window.scrollY > 24);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setSolid(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Scroll-spy: tracks which section is currently in view so the nav pill
  // can slide to sit behind the matching link as you scroll.
  useEffect(() => {
    const ids = LINKS.map((link) => link.href.replace("/#", ""));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActiveId(topmost.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close the mobile sheet on resize to desktop, so state can't get stranded.
  useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => window.innerWidth >= 768 && setMenuOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  return (
    <motion.header
      initial={safe ? { y: -20, opacity: 0 } : { opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: safe ? 0.55 : 0.2, ease: EASE_OUT, delay: 0.05 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4"
    >
      <div className="relative w-full max-w-5xl">
        <nav
          className={cn(
            "flex items-center justify-between gap-4 rounded-full px-3.5 py-2.5 transition-[background-color,box-shadow,backdrop-filter] duration-500 sm:px-5 sm:py-3",
            solid
              ? "bg-white/85 shadow-lift ring-1 ring-slate-200/80 backdrop-blur-xl"
              : "bg-white/30 shadow-card ring-1 ring-white/40 backdrop-blur-md",
          )}
          aria-label="Main"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 pl-1.5"
            aria-label="Kelo Care home"
          >
            <LogoMark />
          </Link>

          <ul className="hidden items-center gap-1.5 md:flex">
            {LINKS.map((link) => {
              const id = link.href.replace("/#", "");
              const isActive = activeId === id;

              return (
                <li key={link.href} className="relative">
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-kelo-50 ring-1 ring-inset ring-kelo-100"
                      />
                    )}
                  </AnimatePresence>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative z-10 block whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "text-kelo-700"
                        : "text-slate-600 hover:text-slate-900",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <CtaButton href="/get-started" size="md">
                Get started
              </CtaButton>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-900/5 md:hidden"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </nav>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={safe ? { opacity: 0, y: -8, scale: 0.98 } : { opacity: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={safe ? { opacity: 0, y: -8, scale: 0.98 } : { opacity: 0 }}
              transition={{ duration: safe ? 0.24 : 0, ease: EASE_OUT }}
              className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-lift backdrop-blur-xl md:hidden"
            >
              <ul className="space-y-1 p-3">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-kelo-50 hover:text-kelo-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <CtaButton href="/get-started" size="lg" magnetic={0} fullWidth>
                    Get started
                  </CtaButton>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

function LogoMark() {
  // Cropped tight to the wordmark itself (no card/background), so this is a
  // plain sized <Image> rather than a `fill` box — a `fill` box needs a fixed
  // aspect-ratio container, and this asset isn't square.
  return (
    <Image
      src="/images/logo.png"
      alt="Kelo Care"
      width={332}
      height={277}
      priority
      className="h-9 w-auto flex-shrink-0 transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
    />
  );
}

/*
 * Hamburger that morphs into an X.
 *
 * Both `d` endpoints of each animated bar carry the same count of numbers
 * (four) and use absolute commands only. framer-motion interpolates path
 * strings by mixing the numbers pairwise, so mismatched counts — "M4 7h16"
 * (three) against "M6 6l12 12" (four) — make it give up and snap instantly.
 */
const BAR_TOP = { closed: "M4 7 L20 7", open: "M6 6 L18 18" };
const BAR_BOTTOM = { closed: "M4 17 L20 17", open: "M6 18 L18 6" };

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <motion.path
        d={BAR_TOP.closed}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ d: open ? BAR_TOP.open : BAR_TOP.closed }}
        transition={{ duration: 0.25 }}
      />
      <motion.path
        d="M4 12 L20 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.path
        d={BAR_BOTTOM.closed}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ d: open ? BAR_BOTTOM.open : BAR_BOTTOM.closed }}
        transition={{ duration: 0.25 }}
      />
    </svg>
  );
}

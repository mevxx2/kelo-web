"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { staggerContainer, useMotion, viewportOnce, EASE_OUT } from "@/lib/motion";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#" },
      { label: "Careers", href: "/#" },
      { label: "Contact", href: "mailto:hello@kelocare.com" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/#" },
      { label: "Terms", href: "/#" },
      { label: "Accessibility", href: "/#" },
    ],
  },
];

export function Footer() {
  const { safe, dist, time } = useMotion();

  return (
    <footer id="contact" className="relative overflow-hidden bg-ink-950">
      {/* Hairline gradient accent bookending the ink-dark how-it-works block. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-kelo-500/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(60%_100%_at_50%_100%,rgb(var(--kelo-800)/0.25),transparent_70%)]"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer({ safe, stagger: 0.07 })}
        className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8"
      >
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: dist(16) },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: time(0.5), ease: EASE_OUT },
              },
            }}
          >
            <span className="text-lg font-bold tracking-tight text-white">
              Kelo<span className="text-kelo-400">Care</span>
            </span>
            <p className="mt-3 max-w-xs text-pretty text-sm leading-relaxed text-slate-400">
              Visit tracking, care notes, and scheduling for the people who show
              up.
            </p>
            <div className="mt-5 flex gap-2">
              <Social label="Kelo Care on X" href="https://x.com">
                <path d="M4 4l7.5 9.5L4.4 20h2l5.8-6.2L17 20h3l-7.8-9.9L19.6 4h-2l-5.4 5.8L7.2 4H4Z" />
              </Social>
              <Social label="Kelo Care on LinkedIn" href="https://linkedin.com">
                <path d="M5 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM3.4 9h3.3v11.5H3.4V9Zm5.6 0h3.1v1.6h.05c.44-.8 1.5-1.65 3.1-1.65 3.3 0 3.9 2.1 3.9 4.9v6.65h-3.25v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.5-2.3 3.1v6h-3.25V9Z" />
              </Social>
              <Social label="Email Kelo Care" href="mailto:hello@kelocare.com">
                <path d="M3.5 6.5A2.5 2.5 0 0 1 6 4h12a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5v-11Zm2.2-.3L12 11.4l6.3-5.2H5.7Z" />
              </Social>
            </div>
          </motion.div>

          {COLUMNS.map((column) => (
            <motion.div
              key={column.heading}
              variants={{
                hidden: { opacity: 0, y: dist(16) },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: time(0.5), ease: EASE_OUT },
                },
              }}
            >
              <h2 className="text-sm font-semibold text-white">
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      <span className="relative">
                        {link.label}
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-kelo-400 transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Kelo Care. All rights reserved.
          </p>
          <p className="text-sm text-white/40">Made for caregivers.</p>
        </div>
      </motion.div>
    </footer>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-kelo-600 hover:text-white motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}

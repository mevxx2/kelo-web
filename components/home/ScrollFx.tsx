"use client";

import { useEffect } from "react";

const REVEAL =
  ".rd-head, .rd-card, .rd-step, .rd-roles article, .rd-showcase figure, .rd-plan, .rd-note, .rd-faq-list details, .rd-agency-in, .rd-portal div, .rd-final, .rd-foot-in, .rd-stats li";

export function ScrollFx() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".rd");
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    root.classList.add("rd-js");

    // Reveal-on-scroll with a small stagger between siblings.
    const items = Array.from(root.querySelectorAll<HTMLElement>(REVEAL));
    items.forEach((el) => {
      el.dataset.rd = "";
      const siblings = el.parentElement ? Array.from(el.parentElement.children).filter((c) => (c as HTMLElement).matches(REVEAL)) : [];
      el.style.setProperty("--d", `${Math.max(0, siblings.indexOf(el)) * 90}ms`);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add("rd-in");
          io.unobserve(el);
          window.setTimeout(() => el.classList.add("rd-done"), 1800);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    items.forEach((el) => io.observe(el));

    // Scroll progress, sticky-nav state and gentle parallax.
    const nav = root.querySelector<HTMLElement>(".rd-nav");
    const bar = root.querySelector<HTMLElement>(".rd-progress");
    const parallax = Array.from(root.querySelectorAll<HTMLElement>("[data-speed]"));
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      nav?.classList.toggle("rd-scrolled", y > 12);
      if (y < window.innerHeight * 1.4) {
        parallax.forEach((el) => el.style.setProperty("--py", `${(-y * Number(el.dataset.speed)).toFixed(1)}px`));
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.classList.remove("rd-js");
    };
  }, []);

  return <div className="rd-progress" aria-hidden="true" />;
}

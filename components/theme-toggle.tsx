"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    localStorage.setItem("kelo-theme", next);
    window.dispatchEvent(new CustomEvent("kelo-theme-change", { detail: next }));
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      aria-pressed={isLight}
      className={`theme-toggle ${className}`}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb">
          {isLight ? <SunIcon /> : <MoonIcon />}
        </span>
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
      <circle cx="10" cy="10" r="3" fill="currentColor" />
      <path d="M10 2v2m0 12v2M2 10h2m12 0h2M4.35 4.35l1.4 1.4m8.5 8.5 1.4 1.4m0-11.3-1.4 1.4m-8.5 8.5-1.4 1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
      <path d="M15.8 12.8A6.4 6.4 0 0 1 7.2 4.2 6.4 6.4 0 1 0 15.8 12.8Z" fill="currentColor" />
    </svg>
  );
}

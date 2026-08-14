import type { Config } from "tailwindcss";

// Kelo palette values live in app/globals.css as space-separated RGB channels
// (`--kelo-600: 37 96 235`). Tailwind maps them here so `<alpha-value>` modifiers
// like `bg-kelo-600/40` keep working, and so runtime consumers (the particle
// canvas) can read the exact same value off :root instead of duplicating a hex.
const kelo = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((step) => [
    step,
    `rgb(var(--kelo-${step}) / <alpha-value>)`,
  ]),
) as Record<string, string>;

const sun = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700].map((step) => [
    step,
    `rgb(var(--sun-${step}) / <alpha-value>)`,
  ]),
) as Record<string, string>;

const ink = Object.fromEntries(
  [700, 800, 900, 950].map((step) => [
    step,
    `rgb(var(--ink-${step}) / <alpha-value>)`,
  ]),
) as Record<string, string>;

const config: Config = {
  // Dark theme only. Kept as "class" (rather than "media") so a stray OS
  // light-mode preference can never flip the site — nothing ever adds the class.
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kelo: { ...kelo, DEFAULT: `rgb(var(--kelo-brand) / <alpha-value>)` },
        sun,
        ink,
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px -8px rgb(15 23 42 / 0.10)",
        lift: "0 2px 4px rgb(15 23 42 / 0.05), 0 24px 48px -12px rgb(15 23 42 / 0.18)",
        glow: "0 12px 32px -8px rgb(var(--kelo-600) / 0.45)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "text-shine": {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.24, 0, 0.38, 1) infinite",
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
        "text-shine": "text-shine 3.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

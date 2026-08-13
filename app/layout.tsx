import type { Metadata, Viewport } from "next";

import { IntroOverlay } from "@/components/intro-overlay";
import { PageTransition } from "@/components/page-transition";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kelocare.com"),
  title: {
    default: "Kelo Care — Care that everyone can see",
    template: "%s · Kelo Care",
  },
  description:
    "Kelo Care keeps caregivers, agencies, and families working from the same picture — visit timers, care notes, and scheduling in one app. $40 per caregiver, per year.",
  openGraph: {
    title: "Kelo Care — Care that everyone can see",
    description:
      "Visit timers, care notes, and scheduling for home care teams. $40 per caregiver, per year.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-kelo-600 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <IntroOverlay />
        <ScrollProgress />

        {/* Outside PageTransition: see the note in site-header.tsx. */}
        <SiteHeader />

        <main id="main">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";

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
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "Kelo Care — Thread of Care",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kelo Care — Care that everyone can see",
    description:
      "Visit timers, care notes, and scheduling for home care teams.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#100d29" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var saved=localStorage.getItem('kelo-theme');var theme=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch(e){document.documentElement.dataset.theme='dark'}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-ink-950 font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-kelo-600 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

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

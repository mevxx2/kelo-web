import type { Metadata } from "next";
import { Host_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const host = Host_Grotesk({ subsets: ["latin"], variable: "--font-host" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://kelo-care.com"),
  title: "Kelo Care | Care, coordinated.",
  description: "Kelo Care brings clients, routines, medications, visits, and handoffs into one coordinated mobile app for caregivers.",
  icons: { icon: "/images/kelo-care-logo.png", apple: "/images/kelo-care-logo.png" },
  openGraph: { title: "Kelo Care | Care, coordinated.", description: "One calm place for the people, tasks, visits, and handoffs behind everyday care.", images: [{ url: "/og-kelo-care.png", width: 1792, height: 936, alt: "Kelo Care mobile app preview" }] },
  twitter: { card: "summary_large_image", title: "Kelo Care | Care, coordinated.", description: "One calm place for the people, tasks, visits, and handoffs behind everyday care.", images: ["/og-kelo-care.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${host.variable} ${inter.variable}`} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var saved=localStorage.getItem('template-theme');var theme=saved==='light'||saved==='dark'?saved:'light';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch(e){document.documentElement.dataset.theme='light'}})()` }} /></head><body>{children}</body></html>;
}

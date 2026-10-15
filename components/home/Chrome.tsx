import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import "./home.css";
import { ScrollFx } from "./ScrollFx";

export function Brand({ home = false }: { home?: boolean }) {
  return (
    <Link className="rd-brand" href={home ? "#top" : "/"} aria-label="Kelo Care home">
      <span className="rd-logo"><Image src="/images/app/kelo-wordmark.png" alt="" width={733} height={343} /></span>
      <b>Kelo Care</b>
    </Link>
  );
}

export function SiteHeader({ home = false }: { home?: boolean }) {
  const base = home ? "" : "/";
  return (
    <header className="rd-nav">
      <div className="rd-shell rd-nav-in">
        <Brand home={home} />
        <nav aria-label="Main navigation">
          <a href={`${base}#features`}>Features</a>
          <a href={`${base}#how`}>How it works</a>
          <a href={`${base}#who`}>Who it’s for</a>
          <a href={`${base}#portal`}>Agencies</a>
          <a href={`${base}#pricing`}>Pricing</a>
          <a href={`${base}#faq`}>FAQ</a>
        </nav>
        <Link className="rd-btn rd-btn-ghost rd-btn-sm rd-nav-signin" href="/for-agencies">Agency sign in</Link>
        <Link className="rd-btn rd-btn-dark rd-btn-sm" href="/get-started">Get started</Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="rd-ft">
      <div className="rd-shell rd-ft-top">
        <div className="rd-ft-brand">
          <Brand />
          <p>One coordinated record for everyone who makes care happen: caregivers, families and agencies.</p>
          <div className="rd-ft-stores" aria-label="Kelo Care is coming soon to the App Store and Google Play">
            <span><small>Coming soon to the</small><b>App Store</b></span>
            <span><small>Coming soon to</small><b>Google Play</b></span>
          </div>
        </div>
        <nav className="rd-ft-col" aria-label="Product">
          <h4>Product</h4>
          <a href="/#features">Features</a>
          <a href="/#how">How it works</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#faq">FAQ</a>
        </nav>
        <nav className="rd-ft-col" aria-label="For agencies">
          <h4>For agencies</h4>
          <a href="/#portal">Agency portal</a>
          <Link href="/for-agencies">Agency sign in</Link>
          <Link href="/get-started">Get started</Link>
        </nav>
        <nav className="rd-ft-col" aria-label="Legal">
          <h4>Legal &amp; help</h4>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/terms">Terms of service</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/delete-account">Delete your account</Link>
        </nav>
        <div className="rd-ft-col">
          <h4>Contact</h4>
          <a href="mailto:hello@kelo-care.com">hello@kelo-care.com</a>
          <p className="rd-ft-note">Questions, privacy requests or accessibility help? Write to us and we’ll reply.</p>
        </div>
      </div>
      <div className="rd-shell rd-ft-bot">
        <span>© 2026 Kelo Care. All rights reserved.</span>
        <span className="rd-ft-disc">Kelo is not an emergency service or medical device.</span>
        <span className="rd-ft-power">Powered by <b>Redmoose AI</b></span>
      </div>
    </footer>
  );
}

/** Shell for the information pages (privacy, terms, accessibility, ...). */
export function SitePage({ children }: { children: ReactNode }) {
  return (
    <div className="rd">
      <ScrollFx />
      <SiteHeader />
      <main className="rd-doc-page">{children}</main>
      <SiteFooter />
    </div>
  );
}

type Section = readonly [string, string];

export function LegalDoc({ eyebrow, title, meta, note, sections, cta }: {
  eyebrow: string; title: string; meta: string; note?: string; sections: readonly Section[]; cta: { href: string; label: string };
}) {
  const slug = (h: string) => "s-" + h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return (
    <SitePage>
      <section className="rd-doc-hero">
        <div className="rd-shell">
          <p className="rd-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="rd-doc-meta">{meta}</p>
          {note ? <p className="rd-doc-note">{note}</p> : null}
        </div>
      </section>
      <section className="rd-shell rd-doc-body">
        <aside className="rd-toc" aria-label="On this page">
          <b>On this page</b>
          {sections.map(([h]) => <a key={h} href={`#${slug(h)}`}>{h.replace(/^\d+\.\s*/, "")}</a>)}
        </aside>
        <article className="rd-doc-text">
          {sections.map(([h, c]) => (
            <section key={h} id={slug(h)}>
              <h2>{h}</h2>
              <p>{c}</p>
            </section>
          ))}
          <a className="rd-btn rd-btn-primary" href={cta.href}>{cta.label} <span aria-hidden="true">→</span></a>
        </article>
      </section>
    </SitePage>
  );
}

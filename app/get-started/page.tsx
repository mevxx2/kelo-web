import type { Metadata } from "next";

import { SitePage } from "../../components/home/Chrome";
import { GetStarted } from "../../components/home/GetStarted";

export const metadata: Metadata = {
  title: "Get started | Kelo Care",
  description: "Tell us who you are and we'll let you know as soon as Kelo Care is ready for you.",
};

export default function GetStartedPage() {
  return (
    <SitePage>
      <section className="rd-doc-hero">
        <div className="rd-shell">
          <p className="rd-eyebrow">Get started</p>
          <h1>Who is Kelo for?</h1>
          <p className="rd-doc-meta">Pick your role and we’ll tailor what we tell you when Kelo Care is ready.</p>
        </div>
      </section>
      <section className="rd-shell rd-gs-wrap">
        <GetStarted />
      </section>
    </SitePage>
  );
}

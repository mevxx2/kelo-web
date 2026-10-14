import type { Metadata } from "next";

import { SitePage } from "../../components/home/Chrome";

const description = "Kelo Care's commitment to making the website and app easier to use for everyone.";

export const metadata: Metadata = {
  title: "Accessibility | Kelo Care",
  description,
  openGraph: { title: "Kelo Care accessibility", description, images: ["/og-kelo-care.png"] },
};

export default function AccessibilityPage() {
  return (
    <SitePage>
      <section className="rd-doc-hero">
        <div className="rd-shell">
          <p className="rd-eyebrow">Kelo Care</p>
          <h1>Accessibility</h1>
          <p className="rd-doc-meta">
            We want Kelo Care to be straightforward to use, whether you are coordinating a team, caring for someone, or
            checking in on a loved one.
          </p>
        </div>
      </section>
      <section className="rd-shell rd-steps-doc">
        <article className="rd-card-doc">
          <h2>How we design Kelo</h2>
          <p>
            We aim for readable text, clear labels, visible keyboard focus, useful form feedback, and controls that work
            with a keyboard and screen reader. Motion can be reduced through your device settings.
          </p>
        </article>
        <article className="rd-card-doc">
          <h2>Need another way to use Kelo?</h2>
          <p>
            If you have trouble using the website or app, tell us what you were trying to do and the device or browser
            you were using. We will work with you on an accessible alternative where we can.
          </p>
        </article>
        <article className="rd-card-doc">
          <h2>Contact us</h2>
          <p>
            Email <a href="mailto:hello@kelo-care.com?subject=Kelo%20Care%20accessibility">hello@kelo-care.com</a> with
            the subject “Kelo Care accessibility.” Please do not include passwords or private care details in your
            message.
          </p>
        </article>
      </section>
    </SitePage>
  );
}

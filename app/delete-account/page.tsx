import type { Metadata } from "next";
import Link from "next/link";

import { SitePage } from "../../components/home/Chrome";

export const metadata: Metadata = {
  title: "Delete your account | Kelo Care",
  description: "How to permanently delete your Kelo Care account and associated personal data.",
};

const MAIL = "mailto:hello@kelo-care.com?subject=Delete%20my%20Kelo%20account";

export default function DeleteAccountPage() {
  return (
    <SitePage>
      <section className="rd-doc-hero">
        <div className="rd-shell">
          <p className="rd-eyebrow">Account &amp; data</p>
          <h1>Delete your Kelo account</h1>
          <p className="rd-doc-meta">
            Open the Kelo Care app to delete your account or submit a deletion request. If you cannot access the app,
            contact us from the email address connected to your account.
          </p>
        </div>
      </section>

      <section className="rd-shell rd-steps-doc">
        <article className="rd-card-doc">
          <span className="rd-step-n">01</span>
          <h2>Delete it in the app</h2>
          <p>
            Open Kelo Care, go to <strong>Profile</strong>, choose <strong>Delete account</strong>, and follow the
            confirmation steps. Caregivers and client/family users can confirm deletion there. Team leaders can submit a
            request in the app; agency ownership and shared records must be reviewed before their account is removed.
          </p>
        </article>
        <article className="rd-card-doc">
          <span className="rd-step-n">02</span>
          <h2>Cannot access the app?</h2>
          <p>
            Email <a href={MAIL}>hello@kelo-care.com</a> from the address used for your Kelo account with the subject
            “Delete my Kelo account.” We will verify the request before removing the account. Do not include passwords
            or private care details.
          </p>
          <a className="rd-btn rd-btn-primary" href={MAIL}>Request account deletion <span aria-hidden="true">→</span></a>
        </article>
        <article className="rd-card-doc">
          <span className="rd-step-n">03</span>
          <h2>What deletion means</h2>
          <p>
            Your login, personal profile, and profile photo are removed when deletion is completed. A caregiver&apos;s
            independently owned care data is permanently deleted. Client/family account deletion ends access to shared
            care records, which remain with their caregiver or agency. If you worked through an agency, records it must
            retain, such as completed visit history, may remain in a de-identified form labelled “Former caregiver.”
            Future assigned work must be covered by the agency.
          </p>
        </article>
        <p className="rd-doc-back"><Link href="/">← Back to Kelo Care</Link></p>
      </section>
    </SitePage>
  );
}

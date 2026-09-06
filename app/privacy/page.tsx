import type { Metadata } from "next";

import { CareCanvas } from "@/components/landing/care-thread";
import { SiteFooter } from "@/components/site-footer";
import { LivingCard } from "@/components/ui/living-card";

const description =
  "Learn how Kelo Care collects, uses, protects, and shares information used to coordinate care.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  openGraph: { title: "Kelo Care Privacy Policy", description, images: ["/og.png"] },
  twitter: { title: "Kelo Care Privacy Policy", description, images: ["/og.png"] },
};

const sections = [
  {
    title: "1. What this policy covers",
    body: "This Privacy Policy explains how Kelo Care handles information when you use the Kelo Care mobile app, agency web portal, website, and related support services (together, the “Services”). It applies to caregivers, agency leaders, family members, and other authorized users of the Services.",
  },
  {
    title: "2. Information we collect",
    body: "We collect information you provide to create or use an account, such as your name, email address, password, role, and agency affiliation. We also process care-coordination information entered into the Services, including client and caregiver details, visit dates and times, schedules, assignments, care notes, routines, medication records, task completion records, reports, and messages. If a caregiver uses a location-stamped visit feature, we process the location stamp associated with the visit. We may also receive limited technical information needed to operate and secure the Services, such as device, browser, log, and diagnostic information.",
  },
  {
    title: "3. How we use information",
    body: "We use information to provide and improve the Services; authenticate users; show the right records to authorized people; create schedules, reports, and care records; provide support; communicate about the Services; prevent misuse; and protect the security and reliability of Kelo Care.",
  },
  {
    title: "4. Who can see care information",
    body: "Care information is shared within Kelo Care according to the role and access permissions set for an account. For example, authorized agency leaders can access records belonging to their agency, while caregivers can access clients and work assigned to them. Users and agencies are responsible for assigning access carefully and keeping their account credentials private.",
  },
  {
    title: "5. When we share information",
    body: "We share information with service providers that help us run Kelo Care, including our hosted database and authentication provider, Supabase. These providers may process information only to provide services to Kelo Care. We may also disclose information when required by law, to protect the rights, safety, and security of Kelo Care or others, or as part of a business transaction such as a merger or acquisition. Kelo Care does not sell personal information.",
  },
  {
    title: "6. Retention and deletion",
    body: "We retain information for as long as needed to provide the Services, meet legal or operational requirements, resolve disputes, and enforce agreements. An agency may need to retain care records for its own operational or legal reasons. To request account deletion or ask about information associated with your account, contact us at hello@kelo-care.com. We may need to verify your identity and coordinate with the relevant agency before acting on a request.",
  },
  {
    title: "7. Your choices and rights",
    body: "You can update certain account information through the Services. Depending on where you live, you may have rights to request access to, correction of, deletion of, or a copy of your personal information, subject to applicable law. To make a request, email hello@kelo-care.com with enough detail for us to understand and verify it.",
  },
  {
    title: "8. Security",
    body: "We use reasonable administrative, technical, and organizational safeguards designed to protect information. No method of transmission or storage is completely secure, so please use a strong, unique password and contact us promptly if you believe your account has been accessed without permission.",
  },
  {
    title: "9. Changes to this policy",
    body: "We may update this Privacy Policy as Kelo Care evolves. If we make material changes, we will post the updated policy here and update the effective date below. Continued use of the Services after an update means the updated policy applies to your use.",
  },
];

export default function PrivacyPage() {
  return (
    <CareCanvas>
      <section id="hero" className="relative px-5 pb-16 pt-36 sm:pb-24 sm:pt-44">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[.28em] text-kelo-200">
            Kelo Care
          </p>
          <h1 className="mt-5 text-balance text-5xl font-medium tracking-[-.055em] text-white sm:text-7xl">
            Privacy Policy
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65">
            How Kelo Care handles the information used to coordinate care.
          </p>
          <p className="mt-5 text-sm text-white/45">Effective date: September 6, 2026</p>
        </div>
      </section>

      <section className="relative px-5 pb-28 sm:pb-36">
        <div className="mx-auto max-w-3xl">
          <LivingCard className="p-6 sm:p-10">
            <div className="space-y-10">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-white/65">
                    {section.body}
                  </p>
                </section>
              ))}

              <section className="border-t border-white/10 pt-10">
                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  10. Contact us
                </h2>
                <p className="mt-3 text-base leading-relaxed text-white/65">
                  Questions about this Privacy Policy or Kelo Care&apos;s privacy practices can be sent to{" "}
                  <a className="font-medium text-kelo-200 underline underline-offset-4" href="mailto:hello@kelo-care.com">
                    hello@kelo-care.com
                  </a>.
                </p>
              </section>
            </div>
          </LivingCard>
        </div>
      </section>

      <SiteFooter />
    </CareCanvas>
  );
}

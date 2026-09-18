import type { Metadata } from "next";

import { CareCanvas } from "@/components/landing/care-thread";
import { SiteFooter } from "@/components/site-footer";
import { LivingCard } from "@/components/ui/living-card";

const description = "Kelo Care's commitment to making the website and app easier to use for everyone.";

export const metadata: Metadata = {
  title: "Accessibility",
  description,
  openGraph: { title: "Kelo Care accessibility", description, images: ["/og.png"] },
  twitter: { title: "Kelo Care accessibility", description, images: ["/og.png"] },
};

export default function AccessibilityPage() {
  return (
    <CareCanvas>
      <section className="relative px-5 pb-16 pt-36 sm:pb-24 sm:pt-44">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[.28em] text-kelo-200">Kelo Care</p>
          <h1 className="mt-5 text-balance text-5xl font-medium tracking-[-.055em] text-white sm:text-7xl">Accessibility</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65">We want Kelo Care to be straightforward to use, whether you are coordinating a team, caring for someone, or checking in on a loved one.</p>
        </div>
      </section>

      <section className="relative px-5 pb-28 sm:pb-36">
        <div className="mx-auto max-w-3xl">
          <LivingCard className="p-6 sm:p-10">
            <div className="space-y-9 text-base leading-relaxed text-white/65">
              <section>
                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">How we design Kelo</h2>
                <p className="mt-3">We aim for readable text, clear labels, visible keyboard focus, useful form feedback, and controls that work with a keyboard and screen reader. Motion can be reduced through your device settings.</p>
              </section>
              <section>
                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">Need another way to use Kelo?</h2>
                <p className="mt-3">If you have trouble using the website or app, tell us what you were trying to do and the device or browser you were using. We will work with you on an accessible alternative where we can.</p>
              </section>
              <section className="border-t border-white/10 pt-9">
                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">Contact us</h2>
                <p className="mt-3">Email <a href="mailto:hello@kelo-care.com?subject=Kelo%20Care%20accessibility" className="font-semibold text-kelo-100 underline underline-offset-4">hello@kelo-care.com</a> with the subject “Kelo Care accessibility.” Please do not include passwords or private care details in your message.</p>
              </section>
            </div>
          </LivingCard>
        </div>
      </section>
      <SiteFooter />
    </CareCanvas>
  );
}

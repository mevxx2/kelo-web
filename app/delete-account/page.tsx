import type { Metadata } from "next";

import { CareCanvas } from "@/components/landing/care-thread";
import { SiteFooter } from "@/components/site-footer";
import { LivingCard } from "@/components/ui/living-card";

const description = "How to delete a Kelo Care account and what happens to associated information.";

export const metadata: Metadata = {
  title: "Delete your account",
  description,
  openGraph: { title: "Delete your Kelo Care account", description, images: ["/og.png"] },
  twitter: { title: "Delete your Kelo Care account", description, images: ["/og.png"] },
};

export default function DeleteAccountPage() {
  return (
    <CareCanvas>
      <section className="relative px-5 pb-12 pt-36 sm:pb-18 sm:pt-44">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[.28em] text-kelo-200">Kelo Care account</p>
          <h1 className="mt-5 text-balance text-5xl font-medium tracking-[-.055em] text-white sm:text-7xl">Delete your account</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65">You can delete your Kelo Care account in the app whenever you need to. This page explains the quickest way to do that and what deletion means for your information.</p>
        </div>
      </section>

      <section className="relative px-5 pb-28 sm:pb-36">
        <div className="mx-auto grid max-w-3xl gap-5">
          <LivingCard className="p-6 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-kelo-200">In the app</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Delete it yourself</h2>
            <ol className="mt-6 space-y-4 text-base leading-relaxed text-white/65">
              <li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-kelo-500/20 text-sm font-semibold text-kelo-100">1</span><span>Open Kelo Care and go to <strong className="font-semibold text-white">Profile</strong>.</span></li>
              <li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-kelo-500/20 text-sm font-semibold text-kelo-100">2</span><span>Choose <strong className="font-semibold text-white">Delete account</strong> and follow the confirmation steps.</span></li>
              <li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-kelo-500/20 text-sm font-semibold text-kelo-100">3</span><span>You may be asked to sign in again before deletion is completed.</span></li>
            </ol>
          </LivingCard>

          <LivingCard className="p-6 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-kelo-200">Need help?</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Request deletion by email</h2>
            <p className="mt-4 text-base leading-relaxed text-white/65">If you cannot access the app, email <a className="font-semibold text-kelo-100 underline underline-offset-4" href="mailto:hello@kelo-care.com?subject=Delete%20my%20Kelo%20account">hello@kelo-care.com</a> from the email address on your Kelo account. Use the subject line <strong className="font-semibold text-white">“Delete my Kelo account”</strong>.</p>
            <p className="mt-4 text-sm leading-relaxed text-white/45">For your safety, do not include passwords or care details in your email. We may need to verify that you own the account before we process the request.</p>
          </LivingCard>

          <LivingCard className="p-6 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-kelo-200">What is deleted</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Your access and personal information</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-white/65">
              <p>Deleting your account removes your login, personal profile, and profile photo.</p>
              <p>Care data that you independently own is permanently deleted.</p>
              <p>When an agency is required to retain completed visit records, those records may remain de-identified as <strong className="font-semibold text-white">“Former caregiver”</strong>. Your personal access to them is removed.</p>
            </div>
          </LivingCard>
        </div>
      </section>
      <SiteFooter />
    </CareCanvas>
  );
}

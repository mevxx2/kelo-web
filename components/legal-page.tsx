import { CareCanvas } from "@/components/landing/care-thread";
import { SiteFooter } from "@/components/site-footer";
import { LivingCard } from "@/components/ui/living-card";

type LegalPageProps = {
  title: string;
  version: string;
  sections: string[][];
  contact: string;
};

export function LegalPage({ title, version, sections, contact }: LegalPageProps) {
  const contactHeading = title === "Privacy Policy" ? "15. Contact" : "18. Contact";

  return (
    <CareCanvas>
      <section id="hero" className="relative px-5 pb-16 pt-36 sm:pb-24 sm:pt-44">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[.28em] text-kelo-200">Kelo Care</p>
          <h1 className="mt-5 text-balance text-5xl font-medium tracking-[-.055em] text-white sm:text-7xl">{title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-white/65">Kelo Care · {version} · Effective September 6, 2026</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Draft for review. This document reflects the current Kelo Care product and is intended for review and website preparation. It is not a substitute for advice from qualified legal counsel before public launch.</p>
        </div>
      </section>
      <section className="relative px-5 pb-28 sm:pb-36">
        <div className="mx-auto max-w-3xl">
          <LivingCard className="p-6 sm:p-10">
            <div className="space-y-10">
              {sections.map(([heading, body]) => (
                <section key={heading}>
                  <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{heading}</h2>
                  <p className="mt-3 text-base leading-relaxed text-white/65">{body}</p>
                </section>
              ))}
              <section className="border-t border-white/10 pt-10">
                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{contactHeading}</h2>
                <p className="mt-3 text-base leading-relaxed text-white/65">{contact}</p>
              </section>
            </div>
          </LivingCard>
        </div>
      </section>
      <SiteFooter />
    </CareCanvas>
  );
}

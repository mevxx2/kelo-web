import Link from "next/link";

export function SiteFooter() {
  return (
    <footer id="contact" className="relative px-5 pb-10 pt-24">
      <div className="mx-auto max-w-6xl border-t border-white/10 pt-12">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-xl font-semibold text-white">Kelo Care</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">Visit tracking, care notes, and scheduling for the people who show up.</p>
            <p className="mt-4 text-sm text-white/55">Questions or support? <a href="mailto:hello@kelo-care.com" className="font-medium text-kelo-200 underline underline-offset-4">hello@kelo-care.com</a></p>
          </div>
          <FooterColumn title="Product" links={[["Features", "/#features"], ["How it works", "/#how-it-works"], ["Pricing", "/#pricing"], ["FAQ", "/#faq"]]} />
          <FooterColumn title="Company" links={[["Support & contact", "mailto:hello@kelo-care.com"], ["Privacy", "/#"], ["Terms", "/#"], ["Accessibility", "/#"]]} />
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-sm text-white/35 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Kelo Care. All rights reserved.</p>
          <p>Made for caregivers.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map(([label, href]) => <li key={label}><Link href={href} className="nav-underline text-sm text-white/45">{label}</Link></li>)}
      </ul>
    </div>
  );
}

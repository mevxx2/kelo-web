"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll } from "framer-motion";

import { CareCanvas } from "@/components/landing/care-thread";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRight, CtaButton } from "@/components/ui/button";
import { LivingCard } from "@/components/ui/living-card";
import { cn } from "@/lib/utils";
import { EASE_OUT, useMotionSafe } from "@/lib/motion";

const VALUES = [
  { marker: "01", title: "Full team visibility", body: "See every caregiver’s visits, notes, and current status from one web dashboard." },
  { marker: "02", title: "Consistent handoffs", body: "Shared care notes keep context intact between shifts, teams, and new hires." },
  { marker: "03", title: "Zero procurement friction", body: "Your agency receives no invoice. Each caregiver subscribes individually for $40 a year." },
  { marker: "04", title: "Compliance-friendly records", body: "Visit timers and logged notes create a clear record that can support reviews and audits." },
  { marker: "05", title: "Easy rollout", body: "No IT project or complex setup. Staff install the app while admins work from the browser portal." },
];

const ROLLOUT = [
  { title: "Set up your roster", body: "An agency admin adds the team once in the web portal.", view: "roster" },
  { title: "Assign clients and tasks", body: "Match the right caregivers to the right clients and make responsibilities visible.", view: "assignments" },
  { title: "Caregivers subscribe", body: "Each caregiver installs Kelo and pays their own $40 annual subscription.", view: "subscriptions" },
  { title: "Oversee care from one place", body: "Admins follow visits, notes, and schedules without adding another daily reporting task.", view: "overview" },
];

const QUOTES = [
  { quote: "Placeholder quote about finally seeing every visit without phoning staff for updates.", focus: "Team visibility" },
  { quote: "Placeholder quote about making new-hire onboarding and handoffs much more consistent.", focus: "Staff consistency" },
  { quote: "Placeholder quote about reducing weekly admin while keeping a clearer service record.", focus: "Lower admin overhead" },
];

const FAQS = [
  ["Do we get billed as an agency?", "No. Kelo does not invoice the agency. Each caregiver subscribes individually for $40 per year, while authorized agency admins receive access to the web dashboard."],
  ["What if a caregiver leaves? Do we lose their data?", "Placeholder policy answer: Kelo’s final data-retention and offboarding rules still need to be confirmed before launch. We will replace this answer once that policy is approved."],
  ["Can we see visit history for reviews or audits?", "Yes. Authorized admins can review logged visits and care notes and export records to CSV. These records can support your internal review process, but Kelo does not claim a specific regulatory certification."],
  ["Is there a minimum number of caregivers?", "No. There are no seat minimums, agency contracts, or bulk tiers. The model remains $40 per caregiver, per year."],
  ["How is client data separated between caregivers?", "Kelo uses role-based, row-level access. Caregivers see the clients assigned to them, while authorized agency admins can see records belonging to their agency."],
];

const sectionIn = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } } };

export function AgencyPage() {
  return (
    <MotionConfig reducedMotion="user">
      <CareCanvas variant="agency">
        <AgencyHero />
        <WhyAgencies />
        <Rollout />
        <DashboardWalkthrough />
        <AgencyTestimonials />
        <AgencyPricing />
        <AgencyFaq />
        <AgencyClosing />
        <SiteFooter />
      </CareCanvas>
    </MotionConfig>
  );
}

function AgencyHero() {
  const safe = useMotionSafe();
  return (
    <section id="hero" className="relative min-h-[980px] overflow-hidden px-5 pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-6xl text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: safe ? 0.45 : 0.15 }} className="flex justify-center">
          <Image src="/images/logo.png" alt="Kelo Care" width={332} height={277} priority className="h-24 w-auto" />
        </motion.div>
        <motion.div initial={safe ? { opacity: 0, y: 22 } : { opacity: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: safe ? 0.75 : 0.2, delay: safe ? 0.35 : 0, ease: EASE_OUT }}>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[.28em] text-kelo-200">For home care agencies</p>
          <h1 className="mx-auto mt-5 max-w-5xl text-balance text-5xl font-medium leading-[.98] tracking-[-.055em] text-white sm:text-7xl lg:text-[6rem]">One thread connecting your <span className="thread-text">whole care team.</span></h1>
          <p className="mx-auto mt-7 max-w-3xl text-pretty text-lg leading-relaxed text-white/65 sm:text-xl">Give your agency one web dashboard for visits, notes, schedules, and assignments, at $0 direct cost to the agency. Each caregiver subscribes for $40 a year.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: safe ? 0.8 : 0, duration: safe ? 0.5 : 0.15 }} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaButton href="/for-agencies/contact" size="lg">Bring Kelo to your team <ArrowRight /></CtaButton>
          <CtaButton href="/for-agencies#rollout" variant="secondary" size="lg">See how rollout works</CtaButton>
        </motion.div>
        <p className="mt-5 text-sm text-white/45">No agency invoice. No contracts. No seat minimums.</p>
        <motion.div initial={safe ? { opacity: 0, y: 30, scale: 0.97 } : { opacity: 0 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: safe ? 1 : 0, duration: safe ? 0.7 : 0.2, ease: EASE_OUT }} className="mx-auto mt-16 max-w-5xl text-left">
          <LivingCard className="p-3 sm:p-5"><AgencyDashboardPreview view="overview" /></LivingCard>
        </motion.div>
      </div>
    </section>
  );
}

function WhyAgencies() {
  const safe = useMotionSafe();
  return (
    <section id="why-kelo" className="relative px-5 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionIn} className="max-w-3xl">
          <Eyebrow>Why agencies use Kelo</Eyebrow>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-[-.04em] text-white sm:text-6xl">Oversight without another layer of overhead.</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">Kelo gives teams a consistent way to work and gives leaders the visibility to support them, without a procurement project.</p>
        </motion.div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {VALUES.map((value, index) => (
            <motion.div key={value.title} initial={safe ? { opacity: 0, y: 22 } : { opacity: 0 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: safe ? 0.5 : 0.15, delay: safe ? index * 0.05 : 0, ease: EASE_OUT }} className={cn("lg:col-span-3", index === 4 && "sm:col-span-2 lg:col-span-4 lg:col-start-2")}>
              <LivingCard className="h-full min-h-56 p-7"><span className="inline-flex rounded-full border border-kelo-300/30 bg-kelo-500/10 px-3 py-1 text-xs font-bold tracking-[.18em] text-kelo-200">{value.marker}</span><h3 className="mt-7 text-2xl font-semibold tracking-tight text-white">{value.title}</h3><p className="mt-3 max-w-lg leading-relaxed text-white/58">{value.body}</p></LivingCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Rollout() {
  const ref = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(ROLLOUT.length - 1, Math.floor(value * ROLLOUT.length));
    if (next !== activeRef.current) { activeRef.current = next; setActive(next); }
  });
  return (
    <section ref={ref} id="rollout" className="relative px-5 py-32 sm:py-44">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>How rollout works</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-balance text-4xl font-medium tracking-[-.04em] text-white sm:text-6xl">From decision to team-wide visibility in four steps.</h2>
        <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_1fr]">
          <ol className="relative space-y-5 before:absolute before:bottom-8 before:left-[1.4rem] before:top-8 before:w-px before:bg-white/15">
            {ROLLOUT.map((step, index) => <li key={step.title} className="relative flex gap-6"><motion.span initial={false} animate={{ scale: active === index ? 1.14 : 1, backgroundColor: active >= index ? "#6f5cff" : "rgba(255,255,255,.1)" }} className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white shadow-[0_0_28px_rgba(91,71,255,.3)]">0{index + 1}</motion.span><motion.div initial={false} animate={{ opacity: active === index ? 1 : 0.45, x: active === index ? 8 : 0 }} className="pb-7"><h3 className="text-xl font-semibold text-white">{step.title}</h3><p className="mt-2 max-w-lg leading-relaxed text-white/60">{step.body}</p></motion.div></li>)}
          </ol>
          <div className="lg:sticky lg:top-32 lg:h-fit"><LivingCard className="p-4 sm:p-5"><AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}><AgencyDashboardPreview view={ROLLOUT[active].view} compact /></motion.div></AnimatePresence></LivingCard></div>
        </div>
      </div>
    </section>
  );
}

function DashboardWalkthrough() {
  const callouts = [["Roster control", "See availability and team status without chasing a spreadsheet."], ["Assignments in one view", "Connect clients, caregivers, and tasks from the browser portal."], ["Live visit oversight", "Follow what is complete, in progress, or needs attention."]];
  return (
    <section id="dashboard" className="relative px-5 py-32 sm:py-40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65, ease: EASE_OUT }}><LivingCard className="p-3 sm:p-5"><AgencyDashboardPreview view="dashboard" /></LivingCard></motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionIn}><Eyebrow>The agency portal</Eyebrow><h2 className="mt-4 text-balance text-4xl font-medium tracking-[-.04em] text-white sm:text-5xl">Built for the people coordinating the whole picture.</h2><p className="mt-6 text-lg leading-relaxed text-white/55">Caregivers stay focused in the mobile app. Agency leaders manage the team from a separate web-based dashboard on their computer.</p><ul className="mt-8 space-y-4">{callouts.map(([title, body], index) => <li key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-kelo-500/20 text-xs font-bold text-kelo-200">{index + 1}</span><div><h3 className="font-semibold text-white">{title}</h3><p className="mt-1 text-sm leading-relaxed text-white/52">{body}</p></div></li>)}</ul></motion.div>
      </div>
    </section>
  );
}

function AgencyTestimonials() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="mx-auto max-w-6xl px-5"><Eyebrow>Agency perspective</Eyebrow><h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-[-.04em] text-white sm:text-6xl">What team leaders should be able to say.</h2><p className="mt-5 text-sm text-white/45">Placeholder testimonials; replace with verified agency quotes before launch.</p></div>
      <div className="marquee-group mt-14 flex w-max gap-6 px-3">{[...QUOTES, ...QUOTES].map((item, index) => <LivingCard key={`${item.focus}-${index}`} className="w-[340px] p-7 sm:w-[420px]"><span className="inline-flex rounded-full bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-amber-200">Placeholder</span><blockquote className="mt-5 min-h-24 text-lg leading-relaxed text-white/75">“{item.quote}”</blockquote><figcaption className="mt-7 border-t border-white/12 pt-5"><strong className="block text-white">Placeholder agency owner</strong><span className="mt-1 block text-sm text-white/45">{item.focus} · Replace with verified customer</span></figcaption></LivingCard>)}</div>
    </section>
  );
}

function AgencyPricing() {
  const included = ["$0 billed to the agency", "$40/year paid by each caregiver", "No contracts or seat minimums", "Web dashboard included", "CSV exports and API access", "iOS, Android, and web"];
  return (
    <section id="pricing" className="relative px-5 py-36"><div className="relative mx-auto max-w-2xl text-center"><Eyebrow>Agency-friendly pricing</Eyebrow><h2 className="mt-4 text-balance text-4xl font-medium tracking-[-.04em] text-white sm:text-6xl">Oversight at $0 direct cost to your agency.</h2><LivingCard className="mt-12 p-8 text-left sm:p-12"><p className="text-sm font-semibold uppercase tracking-[.22em] text-kelo-200">Each caregiver subscribes</p><div className="mt-5 flex items-end gap-3"><span className="text-7xl font-medium tracking-[-.06em] text-white">$40</span><span className="pb-2 text-white/50">per caregiver<br />per year</span></div><ul className="mt-9 grid gap-3 sm:grid-cols-2">{included.map((item) => <li key={item} className="flex gap-2 text-sm text-white/68"><span className="text-kelo-200">✓</span>{item}</li>)}</ul><div className="mt-10"><CtaButton href="/for-agencies/contact" size="lg" fullWidth>Bring Kelo to your team <ArrowRight /></CtaButton></div><p className="mt-4 text-center text-xs text-white/40">No agency invoice. No invented tiers or bulk pricing.</p></LivingCard></div></section>
  );
}

function AgencyFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const [ripple, setRipple] = useState(0);
  return (
    <section id="faq" className="relative px-5 py-32"><div className="mx-auto max-w-4xl"><Eyebrow>Agency FAQ</Eyebrow><h2 className="mt-4 text-4xl font-medium tracking-[-.04em] text-white sm:text-6xl">The rollout questions, answered plainly.</h2><LivingCard className="mt-14 p-3">{FAQS.map(([question, answer], index) => { const active = open === index; return <div key={question} className="relative border-b border-white/10 last:border-0">{ripple === index + 1 ? <motion.span key={ripple} initial={{ scale: 0.2, opacity: 0.8 }} animate={{ scale: 12, opacity: 0 }} transition={{ duration: 0.9 }} className="pointer-events-none absolute left-1 top-7 h-3 w-3 rounded-full border border-kelo-200" /> : null}<button type="button" aria-expanded={active} onClick={() => { setOpen(active ? null : index); setRipple(index + 1); window.setTimeout(() => setRipple(0), 950); }} className="flex w-full items-center justify-between gap-5 rounded-2xl px-5 py-6 text-left text-base font-semibold text-white">{question}<motion.span initial={false} animate={{ rotate: active ? 45 : 0 }} className="text-2xl font-light text-kelo-200">+</motion.span></button><AnimatePresence initial={false}>{active ? <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="px-5 pb-6 pr-14 leading-relaxed text-white/58">{answer}</p></motion.div> : null}</AnimatePresence></div>; })}</LivingCard></div></section>
  );
}

function AgencyClosing() {
  return <section className="relative px-5 py-40 text-center"><motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-4xl"><p className="text-sm font-semibold uppercase tracking-[.3em] text-kelo-200">One team. One clear picture.</p><h2 className="mt-5 text-balance text-5xl font-medium tracking-[-.05em] text-white sm:text-7xl">Bring every moment of care into view.</h2><p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/55">Give caregivers a simpler workflow and give agency leaders the oversight to support consistent care.</p><div className="mt-10 flex justify-center"><CtaButton href="/for-agencies/contact" size="lg">Bring Kelo to your team <ArrowRight /></CtaButton></div></motion.div></section>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[.28em] text-kelo-200">{children}</p>;
}

function AgencyDashboardPreview({ view, compact = false }: { view: string; compact?: boolean }) {
  const roster = view === "assignments" ? ["Mobility walk · Ada", "Medication · Joseph", "Meal prep · Rosa"] : view === "subscriptions" ? ["Ada · Active", "Joseph · Invite sent", "Rosa · Active"] : ["Ada Mensah · Johnson", "Joseph King · Lee", "Rosa Lee · Patel"];
  const title = view === "roster" ? "Team roster" : view === "assignments" ? "Task assignments" : view === "subscriptions" ? "Caregiver access" : "Agency overview";
  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-[#f6f7fb] text-[#17152a]"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-kelo-700">Kelo Care</p><p className="mt-1 text-sm font-semibold">{title}</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">12 caregivers active</span></div><div className={cn("grid gap-4 p-5 sm:grid-cols-[1.2fr_.8fr] sm:p-7", compact ? "min-h-[330px]" : "min-h-[390px]")}><div className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="font-semibold">{view === "assignments" ? "Today’s tasks" : view === "subscriptions" ? "Subscription status" : "Today’s visits"}</h3><span className="text-xs text-slate-400">Live</span></div><div className="mt-5 space-y-3">{roster.map((row, index) => <div key={row} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className={index === 1 ? "h-2.5 w-2.5 rounded-full bg-amber-400" : "h-2.5 w-2.5 rounded-full bg-emerald-500"} /><span className="text-sm font-medium">{row}</span></div>)}</div></div><div className="grid gap-4"><div className="rounded-2xl bg-kelo-600 p-5 text-white"><p className="text-sm text-white/70">Visits complete</p><p className="mt-2 text-4xl font-semibold">28</p><p className="mt-4 text-xs text-white/55">4 currently in progress</p></div><div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-semibold">Coverage today</p><p className="mt-3 text-sm text-slate-500">18 of 20 visits assigned</p><div className="mt-4 h-2 rounded-full bg-kelo-100"><div className="h-full w-[90%] rounded-full bg-kelo-500" /></div></div></div></div></div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

import { CareCanvas } from "@/components/landing/care-thread";
import { LivingCard } from "@/components/ui/living-card";
import { ArrowRight, CtaButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EASE_OUT, useMotionSafe } from "@/lib/motion";

const FEATURES = [
  {
    title: "Visit timer",
    body: "One tap in, one tap out. Location-stamped, so hours are never a matter of recollection.",
    path: "M12 4v2m-4-2h8M12 9v4l3 2m5-2a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  },
  {
    title: "Care notes & handoff",
    body: "Structured notes the next caregiver actually reads, attached to the client rather than a group chat.",
    path: "M7 3h10a3 3 0 0 1 3 3v15H4V6a3 3 0 0 1 3-3Zm1 6h8M8 13h8m-8 4h5",
  },
  {
    title: "Scheduling",
    body: "Shifts, coverage gaps, and swaps in one calendar. Everyone sees changes the moment they happen.",
    path: "M6 3v4m12-4v4M4 10h16M6 5h12a2 2 0 0 1 2 2v14H4V7a2 2 0 0 1 2-2Zm3 9h2v2H9z",
  },
  {
    title: "Agency dashboard",
    body: "Live visibility across every caregiver and client, with the exports payroll and compliance need.",
    path: "M4 20h16M7 17v-5m5 5V7m5 10V10",
  },
];

const STEPS = [
  {
    title: "Set up your team",
    body: "Add caregivers and clients once. Roles decide who sees what, so families get updates without seeing payroll.",
    screen: "team",
  },
  {
    title: "Log visits in real time",
    body: "Caregivers start a timer on arrival and leave a note on the way out. It takes seconds, not a Sunday evening.",
    screen: "visit",
  },
  {
    title: "Everyone stays in sync",
    body: "Agencies watch coverage live, families see the day's summary, and payroll exports itself at week's end.",
    screen: "sync",
  },
];

const QUOTES = [
  {
    quote: "Placeholder quote about how much time the visit timer saves at the end of a week.",
    name: "Placeholder Name",
    meta: "Caregiver · Placeholder Home Care",
  },
  {
    quote: "Placeholder quote from an agency owner about finally seeing coverage without phoning around.",
    name: "Placeholder Name",
    meta: "Agency owner · Placeholder Care Group",
  },
  {
    quote: "Placeholder quote from a family member about knowing how the morning went without having to ask.",
    name: "Placeholder Name",
    meta: "Family member · Toronto, ON",
  },
];

const FAQS = [
  ["Do caregivers need to be tech-savvy to use it?", "No. The whole visit flow is two taps — start on arrival, end on the way out. Most caregivers are running their first visit within a minute of installing the app."],
  ["What happens if there's no signal at a client's home?", "Visits log offline and sync as soon as the phone reconnects. Timers keep running locally, so a basement with no bars never costs someone their hours."],
  ["How much can families see?", "Exactly what you decide. Roles control access, so a family member can see the day's summary and upcoming visits without seeing pay rates, other clients, or internal agency notes."],
  ["Is $40 per caregiver the whole cost?", "Yes. Client seats, family accounts, and the agency dashboard are included. There are no per-visit fees, setup fees, or charges for exports."],
  ["Can we get our data out?", "Any time. Visits, notes, and timesheets export to CSV, and there's an API for agencies already running payroll or scheduling elsewhere."],
  ["Is it available on both iOS and Android?", "Yes, with the same feature set on each. The agency dashboard also runs in any browser."],
];

const sectionIn = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

export function ThreadOfCare() {
  return (
    <MotionConfig reducedMotion="user">
      <CareCanvas>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Faq />
        <Closing />
        <Footer />
      </CareCanvas>
    </MotionConfig>
  );
}

function Hero() {
  const safe = useMotionSafe();

  return (
    <section id="hero" className="relative min-h-[1050px] overflow-hidden px-5 pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-6xl text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: safe ? 0.5 : 0.15 }} className="flex justify-center">
          <Image src="/images/logo.png" alt="Kelo Care" width={332} height={277} priority className="h-28 w-auto" />
        </motion.div>

        <motion.svg viewBox="0 0 900 180" className="mx-auto mt-5 h-32 w-full max-w-4xl overflow-visible" fill="none" aria-hidden="true">
          <motion.path d="M0 90H900" stroke="rgba(255,255,255,.24)" strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: safe ? 1.4 : 0.2, times: [0, .25, .7, 1] }} />
          <motion.path
            d="M0 90 C120 90 185 90 250 90 C290 90 305 78 325 90 L350 90 L370 42 L397 142 L425 72 L450 90 C520 90 560 10 650 52 C730 88 780 90 900 90"
            stroke="url(#heroThread)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: safe ? 2.15 : 0.25, delay: safe ? .75 : 0, ease: EASE_OUT }}
            className="thread-pulse"
          />
          <defs><linearGradient id="heroThread"><stop stopColor="#ffd5ae"/><stop offset=".6" stopColor="#8f83ff"/><stop offset="1" stopColor="#5149e6"/></linearGradient></defs>
        </motion.svg>

        <motion.div
          initial={safe ? { clipPath: "inset(0 100% 0 0)", opacity: 1 } : { opacity: 0 }}
          animate={safe ? { clipPath: "inset(0 0% 0 0)", opacity: 1 } : { opacity: 1 }}
          transition={{ duration: safe ? 1.15 : .2, delay: safe ? 1.55 : 0, ease: EASE_OUT }}
        >
          <p className="text-xs font-semibold uppercase tracking-[.26em] text-white/55">Now in early access</p>
          <h1 className="mx-auto mt-5 max-w-5xl text-balance text-5xl font-medium leading-[.98] tracking-[-.055em] text-white sm:text-7xl lg:text-[6.5rem]">
            Care that everyone <span className="thread-text">can see.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-white/65 sm:text-xl">
            Kelo Care keeps caregivers, agencies, and families working from the same picture — visit timers, care notes, and schedules in one place.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: safe ? 2.25 : 0, duration: .65 }} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaButton href="/get-started" size="lg" className="heartbeat-button">Get started <ArrowRight /></CtaButton>
          <CtaButton href="/#how-it-works" variant="secondary" size="lg" magnetic={.15}>See how it works</CtaButton>
        </motion.div>
        <p className="mt-5 text-sm text-white/45">$40 per caregiver, per year. No per-visit fees.</p>

        <div className="relative mx-auto mt-14 h-[350px] max-w-5xl sm:h-[430px]">
          {["schedule", "notes", "timer", "dashboard"].map((screen, i) => (
            <motion.div
              key={screen}
              initial={{ opacity: 0, scale: .8, x: 0, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: safe ? 2.35 + i * .12 : 0, duration: safe ? .5 : .15, ease: EASE_OUT }}
              className={cn("absolute", i === 0 && "left-[2%] top-20", i === 1 && "left-[25%] top-0", i === 2 && "right-[25%] top-7", i === 3 && "right-[2%] top-24", i > 1 && "hidden sm:block")}
            >
              <LivingCard className="w-52 p-4 text-left sm:w-60" breathe={1.012}><AppPreview type={screen} /></LivingCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const safe = useMotionSafe();
  return (
    <section id="features" className="relative px-5 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .35 }} variants={sectionIn} className="max-w-3xl">
          <Eyebrow>Features</Eyebrow>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-[-.04em] text-white sm:text-6xl">Everything a shift needs, nothing it doesn&apos;t.</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/55">Care work runs on memory and good intentions. Kelo turns those scattered moments into one visible thread.</p>
        </motion.div>
        <div className="mt-20 grid gap-8 sm:grid-cols-2">
          {FEATURES.map((feature, i) => (
            <motion.div key={feature.title} initial={safe ? { opacity: 0, y: 24 } : { opacity: 0 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: safe ? .55 : .2, delay: safe ? i * .06 : 0, ease: EASE_OUT }} className={cn(i % 2 ? "sm:translate-y-20" : "") }>
              <span aria-hidden="true" className={cn("absolute top-1/2 hidden h-px w-20 bg-gradient-to-r from-kelo-300/70 to-transparent sm:block", i % 2 ? "right-full" : "left-full rotate-180")} />
              <LivingCard className="min-h-64 p-8">
                <motion.svg viewBox="0 0 24 24" className="h-12 w-12 text-[#b8b0ff]" fill="none" aria-hidden="true">
                  <motion.path d={feature.path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: safe ? 0 : 1 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: safe ? 1.1 : 0, delay: safe ? .15 : 0 }} />
                </motion.svg>
                <h3 className="mt-8 text-2xl font-semibold tracking-tight text-white">{feature.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-white/58">{feature.body}</p>
              </LivingCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(2, Math.floor(value * 3));
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
  });

  return (
    <section ref={ref} id="how-it-works" className="relative px-5 py-32 sm:py-44">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-4 text-4xl font-medium tracking-[-.04em] text-white sm:text-6xl">Running in an afternoon.</h2>
        <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_.9fr]">
          <ol className="relative space-y-8 before:absolute before:bottom-8 before:left-[1.4rem] before:top-8 before:w-px before:bg-white/15">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative flex gap-6">
                <motion.span initial={false} animate={{ scale: active === i ? 1.18 : 1, backgroundColor: active >= i ? "#6f5cff" : "rgba(255,255,255,.1)" }} className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white shadow-[0_0_28px_rgba(91,71,255,.35)]">0{i + 1}</motion.span>
                <motion.div initial={false} animate={{ opacity: active === i ? 1 : .45, x: active === i ? 8 : 0 }} className="pb-8">
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 max-w-lg leading-relaxed text-white/60">{step.body}</p>
                </motion.div>
              </li>
            ))}
          </ol>
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <LivingCard className="p-5" breathe={1.008}>
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .35 }}>
                  <AppPreview type={STEPS[active].screen} large />
                </motion.div>
              </AnimatePresence>
            </LivingCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="mx-auto max-w-6xl px-5"><Eyebrow>In their words</Eyebrow><h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-[-.04em] text-white sm:text-6xl">Built with the people doing the work.</h2></div>
      <div className="marquee-group mt-16 flex w-max gap-6 px-3">
        {[...QUOTES, ...QUOTES].map((item, i) => (
          <LivingCard key={`${item.meta}-${i}`} className="w-[340px] p-7 sm:w-[420px]" breathe={1.008}>
            <span className="text-5xl leading-none text-kelo-300/50">“</span>
            <blockquote className="mt-3 min-h-24 text-lg leading-relaxed text-white/75">{item.quote}</blockquote>
            <figcaption className="mt-7 border-t border-white/12 pt-5"><strong className="block text-white">{item.name}</strong><span className="mt-1 block text-sm text-white/45">{item.meta}</span></figcaption>
          </LivingCard>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const included = ["Unlimited visits and care notes", "Scheduling and coverage", "Family access", "Agency dashboard", "CSV exports and API access", "iOS, Android, and web"];
  return (
    <section id="pricing" className="relative px-5 py-36">
      <svg aria-hidden="true" viewBox="0 0 800 380" className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-45" fill="none"><path d="M40 190C150 20 650 20 760 190C650 360 150 360 40 190Z" stroke="#7f73ff" strokeWidth="2" className="thread-pulse" /></svg>
      <div className="relative mx-auto max-w-2xl text-center">
        <Eyebrow>Simple pricing</Eyebrow>
        <LivingCard className="mt-12 p-8 text-left sm:p-12" breathe={1.022}>
          <p className="text-sm font-semibold uppercase tracking-[.22em] text-kelo-200">Everything included</p>
          <div className="mt-5 flex items-end gap-3"><span className="text-7xl font-medium tracking-[-.06em] text-white">$40</span><span className="pb-2 text-white/50">per caregiver<br/>per year</span></div>
          <ul className="mt-9 grid gap-3 sm:grid-cols-2">{included.map((item) => <li key={item} className="flex gap-2 text-sm text-white/68"><span className="text-kelo-200">✓</span>{item}</li>)}</ul>
          <div className="mt-10"><CtaButton href="/get-started" size="lg" fullWidth className="heartbeat-button">Get started <ArrowRight /></CtaButton></div>
          <p className="mt-4 text-center text-xs text-white/40">No setup fees. No per-visit fees. No fake tiers.</p>
        </LivingCard>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const [ripple, setRipple] = useState(0);
  return (
    <section id="faq" className="relative px-5 py-32">
      <div className="mx-auto max-w-4xl"><Eyebrow>FAQ</Eyebrow><h2 className="mt-4 text-4xl font-medium tracking-[-.04em] text-white sm:text-6xl">Questions we get asked.</h2>
        <LivingCard className="mt-14 p-3" breathe={1.006}>
          {FAQS.map(([q, a], i) => {
            const active = open === i;
            return <div key={q} className="relative border-b border-white/10 last:border-0">
              {ripple === i + 1 && <motion.span key={ripple} initial={{ scale: .2, opacity: .8 }} animate={{ scale: 12, opacity: 0 }} transition={{ duration: .9 }} className="pointer-events-none absolute left-1 top-7 h-3 w-3 rounded-full border border-kelo-200" />}
              <button type="button" aria-expanded={active} onClick={() => { setOpen(active ? null : i); setRipple(i + 1); window.setTimeout(() => setRipple(0), 950); }} className="flex w-full items-center justify-between gap-5 rounded-2xl px-5 py-6 text-left text-base font-semibold text-white">
                {q}<motion.span animate={{ rotate: active ? 45 : 0 }} className="text-2xl font-light text-kelo-200">+</motion.span>
              </button>
              <AnimatePresence initial={false}>{active && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="px-5 pb-6 pr-14 leading-relaxed text-white/58">{a}</p></motion.div>}</AnimatePresence>
            </div>;
          })}
        </LivingCard>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative px-5 py-40 text-center">
      <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[.3em] text-kelo-200">One team. One picture.</p>
        <h2 className="mt-5 text-balance text-5xl font-medium tracking-[-.05em] text-white sm:text-7xl">Keep every moment of care connected.</h2>
        <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-white/55">Visit tracking, care notes, and scheduling for the people who show up.</p>
        <div className="mt-10 flex justify-center"><CtaButton href="/get-started" size="lg" className="heartbeat-button heartbeat-slow">Get started <ArrowRight /></CtaButton></div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="relative px-5 pb-10 pt-24">
      <div className="mx-auto max-w-6xl border-t border-white/10 pt-12">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div><p className="text-xl font-semibold text-white">Kelo Care</p><p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">Visit tracking, care notes, and scheduling for the people who show up.</p></div>
          <FooterColumn title="Product" links={[["Features","/#features"],["How it works","/#how-it-works"],["Pricing","/#pricing"],["FAQ","/#faq"]]} />
          <FooterColumn title="Company" links={[["Contact","mailto:hello@kelocare.com"],["Privacy","/#"],["Terms","/#"],["Accessibility","/#"]]} />
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-sm text-white/35 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} Kelo Care. All rights reserved.</p><p>Made for caregivers.</p></div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return <div><h3 className="text-sm font-semibold text-white">{title}</h3><ul className="mt-4 space-y-3">{links.map(([label, href]) => <li key={label}><Link href={href} className="nav-underline text-sm text-white/45">{label}</Link></li>)}</ul></div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[.28em] text-kelo-200">{children}</p>;
}

function AppPreview({ type, large = false }: { type: string; large?: boolean }) {
  const rows = type === "schedule" || type === "team" ? ["Ada Mensah", "Joseph King", "Rosa Lee"] : type === "notes" || type === "visit" ? ["Medication given", "Mobility walk", "Lunch prepared"] : ["Visits completed", "Hours logged", "Notes shared"];
  return <div className={cn("rounded-[1.5rem] bg-[#f7f7fb] p-4 text-[#17152a]", large ? "min-h-[360px] p-6" : "min-h-[230px]") }>
    <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-widest text-kelo-700">Kelo Care</span><span className="h-7 w-7 rounded-full bg-kelo-100" /></div>
    <p className={cn("mt-7 font-semibold", large ? "text-2xl" : "text-base")}>{type === "timer" || type === "visit" ? "Visit in progress" : type === "sync" || type === "dashboard" ? "This week" : "Today"}</p>
    {(type === "timer" || type === "visit") && <div className="mx-auto my-8 flex h-28 w-28 items-center justify-center rounded-full border-4 border-kelo-200 text-xl font-bold text-kelo-700">41:08</div>}
    <div className="mt-5 space-y-3">{rows.map((row, i) => <div key={row} className="rounded-xl bg-white p-3 shadow-sm"><div className="flex items-center gap-3"><span className={cn("h-7 w-7 rounded-full", i === 0 ? "bg-kelo-600" : "bg-kelo-100")} /><div><p className="text-xs font-semibold">{row}</p><span className="mt-1 block h-1.5 w-20 rounded-full bg-slate-100" /></div></div></div>)}</div>
  </div>;
}

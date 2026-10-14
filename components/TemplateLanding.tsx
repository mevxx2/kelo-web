"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

type Theme = "dark" | "light";

const features = [
  ["/images/hero/home-screen.png", "Kelo caregiver home screen", <><strong>Keep every client profile</strong> in one clear place</>, "Store the people you care for with their routines, medications, and essential care details."],
  ["/images/hero/visit-timer.png", "Kelo visit timer", <>Log each visit with a <strong>built-in care timer</strong></>, "Start and stop visits for a reliable record of care time and professional proof of service."],
  ["/images/hero/weekly-schedule.png", "Kelo weekly schedule", <>Turn routines and medications into <strong>a manageable day</strong></>, "See what is due, check off completed care, and keep recurring responsibilities visible."],
  ["/images/hero/handoff-notes.png", "Kelo caregiver handoff notes", <>Leave <strong>handoff notes that carry care forward</strong></>, "Give the next caregiver useful context so a shift change never means starting from memory."],
  ["/images/hero/weekly-schedule.png", "Kelo reminders and schedule", <>Get <strong>timely reminders</strong> for what matters next</>, "Use push notifications to stay ahead of medications, visits, meals, walks, and routines."],
  ["/images/hero/home-screen.png", "Kelo client feedback view", <>Keep <strong>clients involved in their care</strong></>, "Let care recipients view or complete permitted tasks and share straightforward feedback."],
  ["/images/hero/agency-overview.png", "Kelo pattern overview", <>Notice changes with <strong>rule-based pattern flags</strong></>, "Surface meaningful changes in a person’s condition or routine without pretending to replace clinical judgment."],
  ["/images/hero/handoff-notes.png", "Kelo care notes summary", <>Create a <strong>doctor-visit summary in one tap</strong></>, "Turn the care record into a useful overview while supporting the wellbeing of the caregiver too."],
] as const;

const steps = [
  ["STEP 1", "Add the person you care for", "Create a client profile and attach the medications, routines, and care details that matter.", "/images/hero/welcome-screen.png", "Kelo onboarding screen"],
  ["STEP 2", "Plan the care day", "Bring visits, recurring tasks, medications, and reminders into one understandable schedule.", "/images/hero/weekly-schedule.png", "Kelo weekly care schedule"],
  ["STEP 3", "Complete and log the visit", "Start the timer, follow the next right task, and record what was completed during care.", "/images/hero/visit-timer.png", "Kelo live visit timer"],
  ["STEP 4", "Leave a clear handoff", "Share notes that help the next caregiver arrive informed and keep the care story connected.", "/images/hero/handoff-notes.png", "Kelo handoff notes"],
] as const;

const testimonials = [
  ["Caregiver quote placeholder", "A verified caregiver story about replacing sticky notes and scattered messages will appear here.", "CG"],
  ["Family quote placeholder", "A verified family story about clearer visibility into a loved one’s care will appear here.", "FM"],
  ["Agency quote placeholder", "A verified agency story about handoffs, visit records, or team coordination will appear here.", "AA"],
  ["Caregiver quote placeholder", "A verified story about saving time or arriving better prepared for a shift will appear here.", "CG"],
  ["Client quote placeholder", "A verified care-recipient story about participation and feedback will appear here.", "CL"],
  ["Team lead quote placeholder", "A verified team-lead story about visibility across care delivery will appear here.", "TL"],
] as const;

const faqGroups = {
  General: [
    ["What is Kelo Care?", "Kelo Care is a mobile app for professional caregivers and personal or family caretakers. It brings clients, visits, medications, routines, reminders, and handoffs into one coordinated record."],
    ["Who can use Kelo?", "The primary user is the caregiver. Clients or care recipients can participate depending on permissions, and agency admins use a separate desk-based web portal."],
    ["Is Kelo available now?", "Not yet. Kelo Care is being prepared for iOS and Android, and final store availability will be announced when it is ready."],
  ],
  Caregivers: [
    ["Can I use Kelo for family care?", "Yes. The same core workflow can support someone caring for one or two loved ones at home as well as a professional caregiver managing multiple clients."],
    ["What can clients complete themselves?", "A care recipient can view or check off permitted tasks and share feedback. Access depends on the role and permissions configured for that care relationship."],
    ["Does Kelo replace professional medical judgment?", "No. Kelo is a coordination and record-keeping tool. It is not an emergency service, medical device, or substitute for professional medical judgment and established care procedures."],
  ],
  "Agencies & Billing": [
    ["How do agencies use Kelo?", "Agency admins use a separate PC-based web portal to manage the roster, assign clients and tasks, and see visit activity across the team. Field caregivers use the mobile app."],
    ["Who pays for Kelo?", "The planned model is $44.99 per year or $6.99 per month for each caregiver. Each caregiver owns and pays for their subscription, even when an agency requires the app across its staff."],
    ["Do clients belong to one caregiver?", "In an agency setting, clients belong to the agency and can be shared across assigned staff. In personal care, the experience is scaled for one caregiver or a small family care circle."],
  ],
} as const;

type FaqGroup = keyof typeof faqGroups;

function useVisibleCount() {
  const [count, setCount] = useState(4);
  useEffect(() => {
    const update = () => setCount(window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : window.innerWidth < 1180 ? 3 : 4);
    update(); window.addEventListener("resize", update); return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

function Brand() { return <Link className="wordmark" href="#top" aria-label="Kelo Care home"><Image src="/images/kelo-care-logo.png" alt="" width={405} height={405} /><b>Kelo Care</b></Link>; }

function StoreButtons() {
  return <div className="store-buttons" aria-label="Kelo Care is coming soon to app stores"><button type="button" disabled><span>Download on the</span><strong>App Store</strong></button><button type="button" disabled><span>Get it on</span><strong>Google Play</strong></button></div>;
}

export function TemplateLanding() {
  const visibleFeatures = useVisibleCount();
  const [featureIndex, setFeatureIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [faqGroup, setFaqGroup] = useState<FaqGroup>("General");
  const [openFaq, setOpenFaq] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoTriggerRef = useRef<HTMLButtonElement>(null);
  const maxFeature = Math.max(0, features.length - visibleFeatures);
  const testimonialVisible = Math.min(visibleFeatures, 3);
  const maxTestimonial = Math.max(0, testimonials.length - testimonialVisible);
  const safeFeatureIndex = Math.min(featureIndex, maxFeature);
  const safeTestimonialIndex = Math.min(testimonialIndex, maxTestimonial);

  useEffect(() => {
    queueMicrotask(() => setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light"));
  }, []);
  useEffect(() => {
    if (!modalOpen) return;
    const videoTrigger = videoTriggerRef.current;
    const previousOverflow = document.body.style.overflow; document.body.style.overflow = "hidden"; closeRef.current?.focus();
    const onEscape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") setModalOpen(false); };
    window.addEventListener("keydown",onEscape); return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown",onEscape); videoTrigger?.focus(); };
  },[modalOpen]);

  function trapModal(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !modalRef.current) return;
    const items = [...modalRef.current.querySelectorAll<HTMLElement>("button,[href],[tabindex]:not([tabindex='-1'])")].filter((item) => !item.hasAttribute("disabled"));
    if (!items.length) return; const first = items[0]; const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  function toggleTheme() { const nextTheme: Theme = theme === "dark" ? "light" : "dark"; setTheme(nextTheme); document.documentElement.dataset.theme = nextTheme; document.documentElement.style.colorScheme = nextTheme; localStorage.setItem("template-theme",nextTheme); }
  function closeMenu() { setMenuOpen(false); }

  return <div className="template-page">
    <header className="site-header"><div className="shell nav-shell"><Brand /><nav className="desktop-nav" aria-label="Main navigation"><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#roles">Who it’s for</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></nav><div className="nav-actions"><button className="theme-toggle" type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} aria-pressed={theme === "light"} onClick={toggleTheme}><span className="theme-sun" aria-hidden="true">☀</span><span className="theme-moon" aria-hidden="true">☾</span></button><a className="button button-small button-secondary" href="#availability">Coming soon</a><button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((value) => !value)}><span className="sr-only">Toggle menu</span><i /><i /></button></div></div>{menuOpen && <nav className="mobile-nav shell" id="mobile-menu" aria-label="Mobile navigation"><a href="#features" onClick={closeMenu}>Features</a><a href="#how-it-works" onClick={closeMenu}>How it works</a><a href="#roles" onClick={closeMenu}>Who it’s for</a><a href="#pricing" onClick={closeMenu}>Pricing</a><a href="#faq" onClick={closeMenu}>FAQ</a></nav>}</header>

    <main>
      <section className="hero section" id="top"><div className="shell hero-inner"><div className="trust-pill"><span className="avatar-row" aria-hidden="true"><i>CG</i><i>FM</i><i>RN</i><i>AA</i></span><span>Built for professional caregivers and family caretakers</span></div><h1>Care shouldn’t live in sticky notes, texts, and memory.</h1><p className="hero-lede">Kelo Care brings clients, routines, medications, visits, and handoffs into one calm mobile app—so every caregiver knows what happened and what comes next.</p><a className="button button-primary" href="#availability">See launch availability <span aria-hidden="true">→</span></a>
        <div className="hero-window"><div className="window-bar"><div><i /><i /><i /></div><span>Kelo Care mobile app</span><b>Product preview</b></div><div className="phone-showcase"><figure><Image src="/images/hero/weekly-schedule.png" alt="Kelo weekly care schedule" width={1179} height={2556} priority /></figure><figure className="hero-phone-main"><Image src="/images/hero/home-screen.png" alt="Kelo caregiver home screen" width={1179} height={2556} priority /></figure><figure><Image src="/images/hero/visit-timer.png" alt="Kelo visit timer" width={1179} height={2556} priority /></figure></div><button ref={videoTriggerRef} className="video-trigger" type="button" onClick={() => setModalOpen(true)}><span>▶</span><b>See how Kelo works</b><small>Walkthrough preview</small></button></div>
      </div></section>

      <section className="section feature-section" id="features"><div className="shell"><div className="section-head split-head"><div><p className="eyebrow">ONE COORDINATED CARE RECORD</p><h2>Everything a caregiver needs for the day ahead</h2><p>Keep the practical details of care close without losing the human context behind them.</p></div><div className="carousel-controls"><button type="button" aria-label="Previous features" disabled={safeFeatureIndex===0} onClick={() => setFeatureIndex(Math.max(0,safeFeatureIndex-1))}>←</button><button type="button" aria-label="Next features" disabled={safeFeatureIndex===maxFeature} onClick={() => setFeatureIndex(Math.min(maxFeature,safeFeatureIndex+1))}>→</button></div></div><div className="feature-carousel" style={{gridTemplateColumns:`repeat(${visibleFeatures},minmax(0,1fr))`}}>{features.slice(safeFeatureIndex,safeFeatureIndex+visibleFeatures).map(([image,alt,title,copy])=><article className="feature-card" key={`${alt}-${copy}`}><div className="feature-visual"><Image src={image} alt={alt} width={1179} height={2556} /></div><div className="feature-copy"><h3>{title}</h3><p>{copy}</p></div></article>)}</div><div className="carousel-progress" aria-hidden="true"><span style={{width:`${((safeFeatureIndex+visibleFeatures)/features.length)*100}%`}} /></div></div></section>

      <section className="section steps-section" id="how-it-works"><div className="shell"><div className="section-head centered"><p className="eyebrow">HOW IT WORKS</p><h2>From the first care plan to the next clear handoff</h2><p>Kelo follows the real rhythm of care: prepare, complete what matters, record the visit, and keep the next person informed.</p></div><div className="steps-layout"><div className="step-list">{steps.map(([label,title,copy],index)=><article key={label}><span>{label}</span><div><h3>{title}</h3><p>{copy}</p></div><b>0{index+1}</b></article>)}</div><div className="step-showcase step-screens">{steps.map(([label,title,,image,alt])=><figure key={label}><Image src={image} alt={alt} width={1179} height={2556} /><figcaption><span>{label}</span><strong>{title}</strong></figcaption></figure>)}</div></div></div></section>

      <section className="roles-section section" id="roles"><div className="shell"><div className="section-head centered"><p className="eyebrow">CARE HAS MORE THAN ONE VIEW</p><h2>Designed around the people who make care happen</h2></div><div className="role-grid"><article><span>01</span><h3>Caregivers</h3><p>Manage clients, follow routines and medications, log visits, complete tasks, and leave the next caregiver a useful handoff.</p></article><article><span>02</span><h3>Clients & families</h3><p>Participate in permitted tasks, give feedback, and gain a clearer view of a loved one’s care without chasing updates.</p></article><article><span>03</span><h3>Agency teams</h3><p>Share agency-owned clients across assigned staff while team leaders coordinate the roster and assignments from a separate web portal.</p></article></div></div></section>

      <section className="agency-section"><div className="shell agency-grid"><div><p className="eyebrow">A SEPARATE DESK-BASED PORTAL</p><h2>Field care stays mobile. Agency coordination stays on the desktop.</h2><p>Agency admins manage staff, assign clients and tasks, and review visit activity from a dedicated web portal. Caregivers keep a focused mobile experience for the work happening in the field.</p></div><div className="agency-visual"><Image src="/images/hero/agency-overview.png" alt="Kelo agency admin overview" width={1179} height={2556} /></div></div></section>

      <section className="section proof-section"><div className="shell"><div className="section-head split-head"><div><p className="eyebrow">TESTIMONIAL PLACEHOLDERS — NOT VERIFIED</p><h2>Real caregiver stories will live here</h2><p className="proof-disclaimer">Every quote below is an internal content placeholder. None is a real customer testimonial.</p></div><div className="carousel-controls"><button type="button" aria-label="Previous testimonials" disabled={safeTestimonialIndex===0} onClick={()=>setTestimonialIndex(Math.max(0,safeTestimonialIndex-1))}>←</button><button type="button" aria-label="Next testimonials" disabled={safeTestimonialIndex===maxTestimonial} onClick={()=>setTestimonialIndex(Math.min(maxTestimonial,safeTestimonialIndex+1))}>→</button></div></div><div className="testimonial-carousel" style={{gridTemplateColumns:`repeat(${testimonialVisible},minmax(0,1fr))`}}>{testimonials.slice(safeTestimonialIndex,safeTestimonialIndex+testimonialVisible).map(([name,quote,initials])=><article className="quote-card" key={`${name}-${quote}`}><span className="sample-tag">PLACEHOLDER — NOT A REAL QUOTE</span><p>{quote}</p><div><i>{initials}</i><span><b>{name}</b><small>Replace with approved attribution</small></span></div></article>)}</div></div></section>

      <section className="section pricing-section" id="pricing"><div className="shell pricing-single"><div className="section-head"><p className="eyebrow">SIMPLE CAREGIVER PRICING</p><h2>One complete plan. Two ways to pay.</h2><p>Kelo is designed to be useful for an individual caregiver first, whether they work professionally or care for someone at home.</p></div><article className="plan-card popular"><span className="popular-tag">SAVE 46% ANNUALLY</span><h3>Kelo Care Plus</h3><p>The full caregiver mobile experience for professional and personal care.</p><div className="plan-price"><b>$44.99</b><span>/year<br /><small>or $6.99/month</small></span></div><strong>Includes:</strong><ul><li>✓ <span>Client profiles, routines, and medications</span></li><li>✓ <span>Visit timer and care records</span></li><li>✓ <span>Tasks, reminders, feedback, and handoffs</span></li><li>✓ <span>Pattern flags, summaries, and wellbeing check-ins</span></li></ul><div className="payer-note"><strong>How agency billing works</strong><p>Each caregiver owns and pays for their subscription. An agency may require Kelo across its staff, but the agency is not presented as the direct payer.</p></div><StoreButtons /></article></div></section>

      <section className="section faq-section" id="faq"><div className="shell faq-layout"><div className="section-head"><p className="eyebrow">FAQ</p><h2>Questions before launch?</h2><p>Kelo Care is still being prepared for public availability. Here is what is confirmed today.</p><a href="mailto:hello@kelo-care.com">Contact Kelo Care →</a></div><div><div className="faq-tabs" role="tablist" aria-label="FAQ categories">{(Object.keys(faqGroups) as FaqGroup[]).map((group)=><button type="button" role="tab" aria-selected={faqGroup===group} key={group} onClick={()=>{setFaqGroup(group);setOpenFaq(0);}}>{group}</button>)}</div><div className="faq-list" role="tabpanel">{faqGroups[faqGroup].map(([question,answer],index)=><article className={openFaq===index?"open":""} key={question}><h3><button type="button" aria-expanded={openFaq===index} onClick={()=>setOpenFaq((value)=>value===index?-1:index)}><span>{question}</span><i aria-hidden="true">+</i></button></h3>{openFaq===index&&<p>{answer}</p>}</article>)}</div></div></div></section>

      <section className="section closing-section" id="availability"><div className="shell closing-card"><div><p className="eyebrow">COMING TO IOS & ANDROID</p><h2>A clearer care day is on its way.</h2><p>Kelo Care is being prepared for the App Store and Google Play. Store availability and final billing terms will be confirmed before release.</p><StoreButtons /><a className="closing-contact" href="mailto:hello@kelo-care.com?subject=Kelo%20Care%20launch%20updates">Ask about Kelo Care →</a></div><button className="closing-video" type="button" onClick={()=>setModalOpen(true)}><span>▶</span><b>See the Kelo workflow</b><small>Walkthrough preview</small></button></div></section>
    </main>

    <footer className="site-footer"><div className="shell footer-grid"><div><Brand /><p>One coordinated record for everyone who makes care happen.</p></div><nav aria-label="Footer navigation"><div><strong>Product</strong><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#pricing">Pricing</a></div><div><strong>Company</strong><a href="#roles">Who it’s for</a><a href="mailto:hello@kelo-care.com">Contact</a><a href="#availability">Availability</a></div><div><strong>Legal</strong><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/delete-account">Delete account</Link></div></nav></div><div className="shell footer-bottom"><span>© 2026 Kelo Care. All rights reserved.</span><span>Not an emergency service or medical device.</span></div></footer>

    {modalOpen&&<div className="modal-backdrop" role="presentation" onMouseDown={(event)=>{if(event.target===event.currentTarget)setModalOpen(false);}}><div ref={modalRef} className="video-modal" role="dialog" aria-modal="true" aria-labelledby="video-title" onKeyDown={trapModal}><button ref={closeRef} className="modal-close" type="button" aria-label="Close walkthrough" onClick={()=>setModalOpen(false)}>×</button><div className="video-placeholder kelo-video"><div><Image src="/images/hero/visit-timer.png" alt="Kelo visit timer walkthrough preview" width={1179} height={2556} /></div></div><div><p className="eyebrow">KELO CARE WALKTHROUGH</p><h2 id="video-title">Plan, care, record, and hand off.</h2><p>Follow the care day from a client’s schedule through a timed visit and into a clear note for the next caregiver.</p><button className="button button-secondary" type="button" onClick={()=>setModalOpen(false)}>Close preview</button></div></div></div>}
  </div>;
}

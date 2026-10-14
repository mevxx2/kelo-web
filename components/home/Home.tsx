import Image from "next/image";
import Link from "next/link";
import "./home.css";
import { ScrollFx } from "./ScrollFx";
import { SiteFooter, SiteHeader } from "./Chrome";
import { PortalShowcase } from "./PortalShowcase";

const bento = [
  { cls: "b-wide", icon: "♡", tag: "Clients", title: "Every client, one clear profile", copy: "Routines, medications and essential care details, always within reach.", img: "/images/app/careplan.jpg", alt: "Kelo care plan screen" },
  { cls: "b-tall", icon: "", tag: "Visits", title: "A built-in care timer", copy: "Start and stop visits for a reliable record of care time.", img: "/images/app/timer.jpg", alt: "Kelo care visit timer" },
  { cls: "", icon: "✎", tag: "Handoffs", title: "Notes that carry care forward", copy: "The next caregiver arrives informed, never starting from memory.", img: "/images/app/handoff.jpg", alt: "Kelo handoff notes" },
  { cls: "", icon: "▦", tag: "Schedule", title: "Your week, planned", copy: "Weekly patterns create each upcoming visit automatically.", img: "/images/app/schedule.jpg", alt: "Kelo weekly schedule" },
  { cls: "b-accent", icon: "☰", tag: "One tap", title: "Doctor-visit summaries", copy: "Turn the care record into a useful overview in a single tap.", img: "", alt: "" },
  { cls: "b-dark", icon: "◔", tag: "Patterns", title: "Rule-based pattern flags", copy: "Surface meaningful changes without pretending to replace clinical judgment.", img: "", alt: "" },
];

const steps = [
  ["01", "Add the person you care for", "Create a profile with the medications, routines and details that matter.", "/images/app/careplan.jpg"],
  ["02", "Plan the care day", "Visits, tasks, medications and reminders in one understandable schedule.", "/images/app/schedule.jpg"],
  ["03", "Complete and log the visit", "Start the timer, follow the next right task, record what was done.", "/images/app/timer.jpg"],
  ["04", "Leave a clear handoff", "Share notes so the next caregiver keeps the care story connected.", "/images/app/handoff.jpg"],
] as const;

const gallery = [
  ["/images/app/home-live.jpg", "Today at a glance", "Progress, shift brief and the next visit"],
  ["/images/app/timer.jpg", "Care visit timer", "A live record of care time"],
  ["/images/app/careplan.jpg", "Care plan", "Medications and routines, due today"],
  ["/images/app/handoff.jpg", "Handoff notes", "Shared with the whole care team"],
  ["/images/app/schedule.jpg", "Your week", "Recurring weekly patterns"],
  ["/images/app/quick-actions.jpg", "Quick actions", "Add clients, routines and reminders"],
] as const;

const roles = [
  ["Caregivers", "Manage clients, follow routines, log visits and hand off with confidence."],
  ["Clients & families", "Take part in permitted tasks, give feedback and see care clearly, without chasing updates."],
  ["Agency teams", "Share clients across staff while team leaders coordinate the roster, schedule and assignments."],
] as const;

const faqs = [
  ["What is Kelo Care?", "Kelo Care is a mobile app for professional caregivers and family caretakers. It brings clients, visits, medications, routines, reminders and handoffs into one coordinated record."],
  ["Is Kelo available now?", "Not yet. Kelo Care is being prepared for iOS and Android, and store availability will be announced when it is ready."],
  ["Who pays for Kelo?", "The planned model is $59 per year or $6.99 per month for each caregiver. Each caregiver owns their subscription, even when an agency requires the app across its staff."],
  ["How do agencies use Kelo?", "Team leaders use the agency portal on desktop, and an agency space in the mobile app, to manage the roster, assign caregivers to clients, run the schedule, build care plans and review visit activity and weekly reports. Field caregivers use the caregiver experience."],
  ["Does Kelo replace professional medical judgment?", "No. Kelo is a coordination and record-keeping tool. It is not an emergency service, medical device, or substitute for professional medical judgment."],
] as const;

export function Home() {
  return (
    <div className="rd" id="top">
      <ScrollFx />
      <SiteHeader home />

      <main>
        <section className="rd-hero">
          <div className="rd-blob rd-blob-1" data-speed="0.12" aria-hidden="true" />
          <div className="rd-blob rd-blob-2" data-speed="0.05" aria-hidden="true" />
          <div className="rd-shell rd-hero-grid">
            <div className="rd-hero-copy">
              <span className="rd-pill"><i /> Built for caregivers &amp; family caretakers</span>
              <h1>Care that <em>connects.</em></h1>
              <p>Kelo gives caregivers, families and agencies one shared record for medications, routines, visits and handoffs, so the next person always knows what happened and what to do next.</p>
              <div className="rd-cta">
                <a className="rd-btn rd-btn-primary" href="#availability">See launch availability <span aria-hidden="true">→</span></a>
                <a className="rd-btn rd-btn-ghost" href="#how">How it works</a>
              </div>
              <ul className="rd-stats">
                <li><b>1</b><span>shared care record</span></li>
                <li><b>0</b><span>sticky notes needed</span></li>
                <li><b>iOS + Android</b><span>coming soon</span></li>
              </ul>
            </div>

            <div className="rd-hero-visual">
              <div className="rd-phone rd-phone-back" data-speed="0.04">
                <Image className="rd-shot" src="/images/app/timer.jpg" alt="Kelo care visit timer" width={780} height={1688} priority />
              </div>
              <div className="rd-phone rd-phone-main" data-speed="0.1">
                <Image className="rd-shot" src="/images/app/home-live.jpg" alt="Kelo home screen" width={780} height={1688} priority />
              </div>
              <div className="rd-chip rd-chip-1" data-speed="0.16"><span className="rd-dot">⏰</span><div><b>Stay on time</b><small>Medications, routines, visits</small></div></div>
              <div className="rd-chip rd-chip-2" data-speed="0.07"><span className="rd-dot ok">♥</span><div><b>Care for the caregiver too</b><small>Quick wellbeing check-ins</small></div></div>
            </div>
          </div>
        </section>

        <section className="rd-section" id="features">
          <div className="rd-shell">
            <div className="rd-head">
              <p className="rd-eyebrow">Everything in one place</p>
              <h2>Everything a caregiver needs for the day ahead</h2>
              <p>The practical details of care, without losing the human context behind them.</p>
            </div>
            <div className="rd-bento">
              {bento.map((b) => (
                <article className={`rd-card ${b.cls}`} key={b.title}>
                  <div className="rd-card-text">
                    {b.icon ? <span className="rd-icon" aria-hidden="true">{b.icon}</span> : null}
                    <span className="rd-tag">{b.tag}</span>
                    <h3>{b.title}</h3>
                    <p>{b.copy}</p>
                  </div>
                  {"img" in b && b.img && (
                    <div className="rd-card-img">
                      <Image src={b.img} alt={b.alt ?? ""} width={585} height={1266} />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rd-section rd-soft" id="how">
          <div className="rd-shell">
            <div className="rd-head center">
              <p className="rd-eyebrow">How it works</p>
              <h2>From the first care plan to the next clear handoff</h2>
            </div>
            <div className="rd-steps">
              {steps.map(([n, t, c, img]) => (
                <article className="rd-step" key={n}>
                  <div className="rd-step-img"><Image src={img} alt={t} width={780} height={1688} /></div>
                  <span className="rd-step-n">{n}</span>
                  <h3>{t}</h3>
                  <p>{c}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rd-section">
          <div className="rd-shell">
            <div className="rd-head center">
              <p className="rd-eyebrow">A look inside</p>
              <h2>Calm, clear and built for busy days</h2>
            </div>
            <div className="rd-showcase">
              {gallery.map(([img, t, c]) => (
                <figure key={t}><div className="rd-frame"><Image className="rd-shot" src={img} alt={t} width={780} height={1688} /></div><figcaption>{t}<small>{c}</small></figcaption></figure>
              ))}
            </div>
          </div>
        </section>

        <section className="rd-section" id="who">
          <div className="rd-shell rd-who">
            <div className="rd-head">
              <p className="rd-eyebrow">Care has more than one view</p>
              <h2>Designed around the people who make care happen</h2>
            </div>
            <div className="rd-roles">
              {roles.map(([t, c], i) => (
                <article key={t}><span>0{i + 1}</span><h3>{t}</h3><p>{c}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="rd-section rd-soft" id="portal">
          <div className="rd-shell">
            <div className="rd-head center">
              <p className="rd-eyebrow">Agency portal</p>
              <h2>Supercharged caregiver and client management software.</h2>
              <p>Your roster, client assignments, visits, care plans and weekly reports together on the desktop. Built for the people coordinating the whole picture.</p>
            </div>
            <PortalShowcase />
            <div className="rd-cta rd-cta-center"><Link className="rd-btn rd-btn-primary" href="/for-agencies">Agency sign in <span aria-hidden="true">→</span></Link></div>
            <p className="rd-note">Caregiver-paid access: $0 billed to your agency. Each caregiver chooses their own plan, with 14 days free. Only verified agency team leaders can sign in.</p>
          </div>
        </section>

        <section className="rd-shell rd-agency" id="agency">
          <div className="rd-agency-in">
            <div className="rd-agency-copy">
              <p className="rd-eyebrow light">Agency space in the app</p>
              <h2>Leading the team on the go.</h2>
              <p>Team leaders also get an agency space in the Kelo mobile app: see today’s care at a glance, assign caregivers to clients, run the schedule and act on what needs attention.</p>
              <ul className="rd-agency-list">
                <li>Action centre for incidents, exceptions, shifts and approvals</li>
                <li>Assignments showing caregiver and client coverage</li>
                <li>Agency reports, feedback inbox and timesheets</li>
                <li>Switch between care workspaces</li>
              </ul>
            </div>
            <div className="rd-agency-shots">
              {[
                ["/images/app/agency-home.jpg", "Agency home"],
                ["/images/app/agency-team.jpg", "Team"],
                ["/images/app/agency-schedule.jpg", "Schedule"],
                ["/images/app/agency-more.jpg", "Action centre and reports"],
              ].map(([img, alt]) => (
                <div className="rd-agency-phone" key={alt}><Image className="rd-shot" src={img} alt={`Kelo ${alt} screen`} width={780} height={1688} /></div>
              ))}
            </div>
          </div>
        </section>

        <section className="rd-section" id="pricing">
          <div className="rd-shell">
            <div className="rd-head center">
              <p className="rd-eyebrow">Simple caregiver pricing</p>
              <h2>One complete plan. Two ways to pay.</h2>
            </div>
            <div className="rd-plans">
              <article className="rd-plan">
                <span className="rd-tag">Monthly</span>
                <div className="rd-price"><b>$6.99</b><span>/month</span></div>
                <p>Flexible, for caregivers who want to start light.</p>
              </article>
              <article className="rd-plan rd-plan-hot">
                <span className="rd-save">Save 30%</span>
                <span className="rd-tag">Yearly</span>
                <div className="rd-price"><b>$59</b><span>/year</span></div>
                <ul>
                  <li>Client profiles, routines and medications</li>
                  <li>Visit timer and care records</li>
                  <li>Tasks, reminders, feedback and handoffs</li>
                  <li>Pattern flags and doctor-visit summaries</li>
                </ul>
              </article>
            </div>
            <p className="rd-note">Each caregiver owns and pays for their subscription. An agency may require Kelo across its staff, but is not the direct payer.</p>
          </div>
        </section>

        <section className="rd-section rd-soft" id="faq">
          <div className="rd-shell rd-faq">
            <div className="rd-head">
              <p className="rd-eyebrow">FAQ</p>
              <h2>Questions before launch?</h2>
              <p>Here is what is confirmed today.</p>
              <a className="rd-link" href="mailto:hello@kelo-care.com">Contact Kelo Care →</a>
            </div>
            <div className="rd-faq-list">
              {faqs.map(([q, a], i) => (
                <details key={q} open={i === 0}>
                  <summary>{q}<i aria-hidden="true" /></summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="rd-shell" id="availability">
          <div className="rd-final">
            <div className="rd-blob rd-blob-3" aria-hidden="true" />
            <div className="rd-final-phones" aria-hidden="true">
              <div className="rd-final-phone side l"><Image className="rd-shot" src="/images/app/timer.jpg" alt="" width={780} height={1688} /></div>
              <div className="rd-final-phone mid"><Image className="rd-shot" src="/images/app/home-live.jpg" alt="" width={780} height={1688} /></div>
              <div className="rd-final-phone side r"><Image className="rd-shot" src="/images/app/careplan.jpg" alt="" width={780} height={1688} /></div>
            </div>
            <p className="rd-eyebrow light">Coming to iOS &amp; Android</p>
            <h2>A clearer care day is on its way.</h2>
            <p>Store availability and final billing terms will be confirmed before release.</p>
            <div className="rd-stores">
              <button type="button" disabled><small>Download on the</small><b>App Store</b></button>
              <button type="button" disabled><small>Get it on</small><b>Google Play</b></button>
            </div>
            <a className="rd-link light" href="mailto:hello@kelo-care.com?subject=Kelo%20Care%20launch%20updates">Ask about Kelo Care →</a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

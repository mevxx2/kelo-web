"use client";

import Image from "next/image";
import { useState } from "react";

const views = [
  { id: "overview", label: "Overview", img: "/images/portal/overview.jpg", title: "See today's coverage at a glance", copy: "Active caregivers, visits today and anything that needs coverage, with a live feed of appointment updates you can filter by date, coverage and status." },
  { id: "team", label: "Care team", img: "/images/portal/team.jpg", title: "Build and invite your roster", copy: "Invite caregivers to their own Kelo account, then see how many clients each person is assigned." },
  { id: "clients", label: "Clients", img: "/images/portal/clients.jpg", title: "Add clients and assign a caregiver", copy: "Save care details and choose a primary caregiver. Everything is shared live with the Kelo app." },
  { id: "schedule", label: "Schedule", img: "/images/portal/schedule.jpg", title: "Plan the week in a few clicks", copy: "Pick a client, caregiver, time and days, then copy a whole week forward to the next." },
  { id: "care", label: "Care plans", img: "/images/portal/careplans.jpg", title: "Build the weekly plan once", copy: "Set medications and routines for the week and Kelo creates the daily tasks automatically." },
  { id: "reports", label: "Reports", img: "/images/portal/reports.jpg", title: "Weekly care reports, ready to share", copy: "A clear weekly snapshot per client from the care your team recorded, with a downloadable PDF." },
] as const;

export function PortalShowcase() {
  const [active, setActive] = useState(0);
  const view = views[active];
  return (
    <div className="rd-portal-wrap">
      <div className="rd-portal-tabs" role="tablist" aria-label="Agency portal views">
        {views.map((v, i) => (
          <button key={v.id} type="button" role="tab" aria-selected={i === active} className={i === active ? "on" : ""} onClick={() => setActive(i)}>
            {v.label}
          </button>
        ))}
      </div>
      <div className="rd-browser">
        <div className="rd-browser-bar" aria-hidden="true">
          <i /><i /><i />
          <span>Agency workspace · Kelo Care</span>
        </div>
        <div className="rd-browser-view">
          {views.map((v, i) => (
            <Image key={v.id} className={i === active ? "show" : ""} src={v.img} alt={`Kelo agency portal: ${v.label}`} width={800} height={560} sizes="(max-width: 980px) 100vw, 900px" />
          ))}
        </div>
      </div>
      <div className="rd-portal-caption" key={view.id}>
        <h3>{view.title}</h3>
        <p>{view.copy}</p>
      </div>
    </div>
  );
}

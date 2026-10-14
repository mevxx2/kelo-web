"use client";

import Link from "next/link";
import { useState } from "react";

const ROLES = [
  { id: "caregiver", title: "Caregiver", body: "You visit clients and want logging that takes seconds, not a Sunday evening.", icon: "♡" },
  { id: "agency", title: "Agency", body: "You coordinate a team and need live coverage, assignments and weekly reports.", icon: "▦" },
  { id: "family", title: "Family member", body: "You want to know how the day went without having to phone and ask.", icon: "⌂" },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

export function GetStarted() {
  const [role, setRole] = useState<RoleId | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const picked = ROLES.find((r) => r.id === role);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter your name and a valid email address.");
      return;
    }
    const subject = encodeURIComponent(`Kelo Care early access: ${picked?.title ?? "Caregiver"}`);
    const body = encodeURIComponent(`Hi Kelo team,\n\nI'd like to hear when Kelo Care is available.\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nI am a: ${picked?.title ?? ""}\n`);
    window.location.href = `mailto:hello@kelo-care.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="rd-gs">
      <div className="rd-gs-steps" aria-hidden="true">
        <span className="on">1 · Your role</span>
        <span className={role ? "on" : ""}>2 · Your details</span>
        <span className={sent ? "on" : ""}>3 · Send</span>
      </div>

      <div className="rd-gs-roles" role="radiogroup" aria-label="Select your role">
        {ROLES.map((r) => (
          <button key={r.id} type="button" role="radio" aria-checked={role === r.id} className={role === r.id ? "on" : ""} onClick={() => { setRole(r.id); setSent(false); }}>
            <span className="rd-icon" aria-hidden="true">{r.icon}</span>
            <b>{r.title}</b>
            <small>{r.body}</small>
          </button>
        ))}
      </div>

      {role ? (
        <form className="rd-gs-form" onSubmit={submit} noValidate>
          <h2>Tell us how to reach you</h2>
          <p>Kelo Care is being prepared for iOS and Android. Send us your details and we’ll let you know as soon as it’s ready.</p>
          <label>Your name<input value={name} onChange={(e) => { setName(e.target.value); setError(""); }} autoComplete="name" placeholder="Ada Mensah" /></label>
          <label>Email address<input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} autoComplete="email" placeholder="ada@example.com" /></label>
          {error ? <p role="alert" className="rd-gs-error">{error}</p> : null}
          <button className="rd-btn rd-btn-primary" type="submit">Email Kelo to get early access <span aria-hidden="true">→</span></button>
          <small>This opens your email app with a message to hello@kelo-care.com. Nothing is sent until you press send there.</small>
          {sent ? <p role="status" className="rd-gs-sent">Your email app should now be open. If it didn’t open, write to <a href="mailto:hello@kelo-care.com">hello@kelo-care.com</a>.</p> : null}
          {role === "agency" ? <p className="rd-gs-agency">Already an agency leader? <Link href="/for-agencies">Open the agency portal</Link>.</p> : null}
        </form>
      ) : (
        <p className="rd-gs-hint">Choose the option that fits you best to continue.</p>
      )}
    </div>
  );
}

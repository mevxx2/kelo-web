"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { ArrowRight, CtaButton } from "@/components/ui/button";
import { CareCanvas } from "@/components/landing/care-thread";
import { LivingCard } from "@/components/ui/living-card";
import { cn } from "@/lib/utils";
import { EASE_OUT, useMotionSafe } from "@/lib/motion";

const TEAM_SIZES = ["1–10", "11–25", "26–50", "51–100", "101+"];

export function AgencySignup() {
  const safe = useMotionSafe();
  const router = useRouter();
  const [values, setValues] = useState({ agency: "", name: "", email: "", teamSize: "", password: "" });
  const [error, setError] = useState("");
  const update = (key: keyof typeof values, value: string) => { setValues((current) => ({ ...current, [key]: value })); setError(""); };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!values.agency.trim() || !values.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) || !values.teamSize || values.password.length < 8) {
      setError("Complete each field and choose a password with at least 8 characters.");
      return;
    }
    router.push("/for-agencies/dashboard");
  };
  return <CareCanvas variant="agency"><section className="relative min-h-screen px-5 pb-16 pt-28 sm:pt-32"><motion.div initial={safe ? { opacity: 0, y: 20 } : { opacity: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: safe ? 0.55 : 0.15, ease: EASE_OUT }} className="mx-auto max-w-xl"><p className="text-center text-xs font-semibold uppercase tracking-[.28em] text-kelo-200">Agency portal</p><h1 className="mt-4 text-balance text-center text-4xl font-medium tracking-[-.05em] text-white sm:text-5xl">Create your agency workspace.</h1><p className="mx-auto mt-4 max-w-md text-center leading-relaxed text-white/55">Set up the place your team will use to coordinate care. You can invite teammates after creating it.</p><LivingCard className="mt-10 p-7 sm:p-9"><form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2"><Field id="agency-name" label="Agency name" value={values.agency} placeholder="North Star Home Care" onChange={(value) => update("agency", value)} /><Field id="contact-name" label="Your name" value={values.name} placeholder="Ada Mensah" onChange={(value) => update("name", value)} /><Field id="signup-email" label="Work email" type="email" value={values.email} placeholder="ada@agency.com" onChange={(value) => update("email", value)} /><div><label htmlFor="team-size" className="block text-sm font-medium text-white/72">Team size</label><select id="team-size" value={values.teamSize} onChange={(event) => update("teamSize", event.target.value)} className="mt-2 block w-full rounded-2xl border border-white/15 bg-[#101838] px-4 py-3 text-base text-white outline-none focus:border-kelo-400 focus:ring-4 focus:ring-kelo-500/15"><option value="">Select a range</option>{TEAM_SIZES.map((size) => <option key={size} value={size}>{size} caregivers</option>)}</select></div><div className="sm:col-span-2"><Field id="signup-password" label="Create a password" type="password" value={values.password} placeholder="At least 8 characters" onChange={(value) => update("password", value)} /></div>{error ? <p role="alert" className="sm:col-span-2 text-sm text-red-300">{error}</p> : null}<div className="sm:col-span-2"><CtaButton type="submit" size="lg" fullWidth>Create workspace <ArrowRight /></CtaButton></div></form><p className="mt-5 text-center text-xs leading-relaxed text-white/38">Preview only—this form demonstrates the agency onboarding flow and does not create or store an account yet.</p></LivingCard><p className="mt-7 text-center text-sm text-white/50">Already have an agency workspace? <a href="/for-agencies" className="text-kelo-200 underline underline-offset-4">Sign in</a></p></motion.div></section></CareCanvas>;
}

function Field({ id, label, type = "text", value, placeholder, onChange }: { id: string; label: string; type?: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return <div><label htmlFor={id} className="block text-sm font-medium text-white/72">{label}</label><input id={id} type={type} value={value} placeholder={placeholder} autoComplete={type === "password" ? "new-password" : undefined} onChange={(event) => onChange(event.target.value)} className={cn("mt-2 block w-full rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 text-base text-white outline-none backdrop-blur-md transition-[border-color,box-shadow] placeholder:text-white/30 focus:border-kelo-400 focus:ring-4 focus:ring-kelo-500/15")} /></div>;
}

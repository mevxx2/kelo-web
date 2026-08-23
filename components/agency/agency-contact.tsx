"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { ArrowRight, CtaButton } from "@/components/ui/button";
import { LivingCard } from "@/components/ui/living-card";
import { cn } from "@/lib/utils";
import { EASE_OUT, useMotionSafe } from "@/lib/motion";

type FormValues = {
  agencyName: string;
  contactName: string;
  email: string;
  teamSize: string;
  message: string;
};

type Errors = Partial<Record<keyof FormValues, string>>;

const EMPTY_FORM: FormValues = { agencyName: "", contactName: "", email: "", teamSize: "", message: "" };
const TEAM_SIZES = ["1–10", "11–25", "26–50", "51–100", "101+"];

export function AgencyContact() {
  const safe = useMotionSafe();
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) confirmationRef.current?.focus();
  }, [submitted]);

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Errors = {};
    if (!values.agencyName.trim()) nextErrors.agencyName = "Enter your agency name.";
    if (!values.contactName.trim()) nextErrors.contactName = "Enter your name.";
    if (!values.email.trim()) nextErrors.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "Enter a valid email address.";
    if (!values.teamSize) nextErrors.teamSize = "Select an approximate team size.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setSubmitted(true);
  };

  return (
    <div className="theme-surface relative min-h-screen overflow-hidden bg-[#07152e] px-5 pb-24 pt-32 sm:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_48%_at_50%_0%,rgba(87,112,255,.22),transparent_70%),radial-gradient(48%_48%_at_12%_72%,rgba(73,67,210,.18),transparent_72%)]" />
      <div aria-hidden="true" className="care-grain pointer-events-none absolute inset-0 opacity-[0.045]" />
      <div aria-hidden="true" className="thread-pulse pointer-events-none absolute bottom-0 left-1/2 top-0 w-px bg-gradient-to-b from-kelo-300/0 via-kelo-300/55 to-kelo-500/0" />

      <div className="relative mx-auto max-w-3xl">
        {!submitted ? (
          <motion.div initial={safe ? { opacity: 0, y: 22 } : { opacity: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: safe ? 0.6 : 0.15, ease: EASE_OUT }}>
            <p className="text-center text-xs font-semibold uppercase tracking-[.28em] text-kelo-200">For agency leaders</p>
            <h1 className="mx-auto mt-5 max-w-2xl text-balance text-center text-4xl font-medium tracking-[-.045em] text-white sm:text-6xl">Bring Kelo to your team.</h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-center text-lg leading-relaxed text-white/55">Tell us a little about your agency and the team you want to connect.</p>

            <form onSubmit={handleSubmit} noValidate className="mt-10">
              <LivingCard className="p-6 sm:p-9">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="agencyName" label="Agency name" value={values.agencyName} error={errors.agencyName} autoComplete="organization" placeholder="North Star Home Care" onChange={(value) => update("agencyName", value)} />
                  <Field id="contactName" label="Contact name" value={values.contactName} error={errors.contactName} autoComplete="name" placeholder="Ada Mensah" onChange={(value) => update("contactName", value)} />
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field id="email" label="Work email" type="email" value={values.email} error={errors.email} autoComplete="email" placeholder="ada@example.com" onChange={(value) => update("email", value)} />
                  <SelectField id="teamSize" label="Approximate team size" value={values.teamSize} error={errors.teamSize} onChange={(value) => update("teamSize", value)} />
                </div>
                <div className="mt-5">
                  <label htmlFor="message" className="block text-sm font-medium text-white/70">Message <span className="text-white/35">(optional)</span></label>
                  <textarea id="message" name="message" rows={5} value={values.message} onChange={(event) => update("message", event.target.value)} placeholder="Anything you want us to know about your rollout?" className="mt-2 block w-full resize-y rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 text-base text-white outline-none backdrop-blur-md transition-[border-color,box-shadow] duration-200 placeholder:text-white/30 focus:border-kelo-400 focus:ring-4 focus:ring-kelo-500/15" />
                </div>
                <div className="mt-8"><CtaButton type="submit" size="lg" fullWidth>Send agency enquiry <ArrowRight /></CtaButton></div>
                <p className="mt-4 text-center text-xs leading-relaxed text-white/40">Preview form only; your details are not sent or stored yet.</p>
              </LivingCard>
            </form>
          </motion.div>
        ) : (
          <motion.div initial={safe ? { opacity: 0, y: 22, scale: 0.98 } : { opacity: 0 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: safe ? 0.55 : 0.15, ease: EASE_OUT }} className="pt-16 text-center">
            <LivingCard className="p-8 sm:p-12">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-kelo-500 text-2xl font-semibold text-white shadow-glow" aria-hidden="true">✓</span>
              <h1 ref={confirmationRef} tabIndex={-1} className="mt-7 text-balance text-4xl font-medium tracking-[-.04em] text-white focus:outline-none sm:text-5xl">Thanks, {values.contactName.split(" ")[0]}.</h1>
              <p role="status" className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/58">The confirmation flow is working. Because this is still a preview form, no enquiry was sent or stored.</p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><CtaButton href="/for-agencies" size="lg">Back to agency page</CtaButton><CtaButton variant="secondary" size="lg" onClick={() => { setSubmitted(false); setErrors({}); }}>Edit details</CtaButton></div>
            </LivingCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Field({ id, label, type = "text", value, error, autoComplete, placeholder, onChange }: { id: string; label: string; type?: string; value: string; error?: string; autoComplete?: string; placeholder?: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white/70">{label}</label>
      <input id={id} name={id} type={type} value={value} autoComplete={autoComplete} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => onChange(event.target.value)} className={cn("mt-2 block w-full rounded-2xl border bg-white/[0.08] px-4 py-3 text-base text-white outline-none backdrop-blur-md transition-[border-color,box-shadow] duration-200 placeholder:text-white/30", error ? "border-red-400/60 focus:border-red-400 focus:ring-4 focus:ring-red-500/10" : "border-white/15 focus:border-kelo-400 focus:ring-4 focus:ring-kelo-500/15")} />
      {error ? <p id={`${id}-error`} role="alert" className="pt-2 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

function SelectField({ id, label, value, error, onChange }: { id: string; label: string; value: string; error?: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white/70">{label}</label>
      <select id={id} name={id} value={value} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => onChange(event.target.value)} className={cn("mt-2 block w-full rounded-2xl border bg-[#191947] px-4 py-3 text-base text-white outline-none transition-[border-color,box-shadow] duration-200", error ? "border-red-400/60 focus:border-red-400 focus:ring-4 focus:ring-red-500/10" : "border-white/15 focus:border-kelo-400 focus:ring-4 focus:ring-kelo-500/15")}>
        <option value="">Select a range</option>
        {TEAM_SIZES.map((size) => <option key={size} value={size}>{size} caregivers</option>)}
      </select>
      {error ? <p id={`${id}-error`} role="alert" className="pt-2 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

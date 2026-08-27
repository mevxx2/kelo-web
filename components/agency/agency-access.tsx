"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { ArrowRight, CtaButton } from "@/components/ui/button";
import { CareCanvas } from "@/components/landing/care-thread";
import { LivingCard } from "@/components/ui/living-card";
import { cn } from "@/lib/utils";
import { EASE_OUT, useMotionSafe } from "@/lib/motion";
import { supabase } from "@/lib/supabase/client";

export function AgencyAccess() {
  const safe = useMotionSafe();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !password) {
      setError("Enter your work email and password to continue.");
      return;
    }
    setIsSubmitting(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError || !data.user) {
      setError("We couldn't sign you in with those details. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, agency_id")
      .eq("id", data.user.id)
      .single();
    const { data: agency } = profile?.agency_id
      ? await supabase
          .from("agencies")
          .select("id, leader_id")
          .eq("id", profile.agency_id)
          .maybeSingle()
      : { data: null };

    if (profileError || profile?.role !== "team_leader" || agency?.leader_id !== data.user.id) {
      await supabase.auth.signOut();
      setError("This portal is only available to the team leader for an active Kelo agency.");
      setIsSubmitting(false);
      return;
    }

    router.push("/for-agencies/dashboard");
  };

  return (
    <CareCanvas variant="agency">
      <section className="relative min-h-screen overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-32">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <motion.div
            initial={safe ? { opacity: 0, x: -20 } : { opacity: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: safe ? 0.6 : 0.15, ease: EASE_OUT }}
            className="max-w-xl"
          >
            <Image src="/images/logo.png" alt="Kelo Care" width={332} height={277} priority className="h-20 w-auto" />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[.28em] text-kelo-200">Agency portal</p>
            <h1 className="mt-4 text-balance text-4xl font-medium tracking-[-.05em] text-white sm:text-6xl">The care team, <span className="thread-text">in one clear view.</span></h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">Kelo&apos;s agency workspace brings your roster, client assignments, visits, and care notes together—built for the people coordinating the whole picture.</p>
            <div className="mt-10 space-y-4">
              {[
                ["Team visibility", "See schedules, live visit status, and care notes in one place."],
                ["Clear assignments", "Keep caregivers, clients, and tasks connected across every shift."],
                ["Caregiver-paid access", "$0 billed to your agency. Caregivers subscribe individually for $40/year."],
              ].map(([title, body], index) => (
                <motion.div key={title} initial={safe ? { opacity: 0, y: 12 } : { opacity: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: safe ? 0.18 + index * 0.08 : 0, duration: safe ? 0.4 : 0.12 }} className="flex gap-4">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kelo-500/20 text-xs font-bold text-kelo-200 ring-1 ring-inset ring-kelo-300/20">{index + 1}</span>
                  <p className="text-sm leading-relaxed text-white/60"><strong className="font-semibold text-white">{title}.</strong> {body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={safe ? { opacity: 0, y: 24, scale: 0.98 } : { opacity: 0 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: safe ? 0.18 : 0, duration: safe ? 0.6 : 0.15, ease: EASE_OUT }}>
            <LivingCard className="mx-auto max-w-md p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-kelo-200">Welcome back</p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-.04em] text-white">Sign in to your workspace</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/52">Use the work email connected to your agency account.</p>
              <form onSubmit={signIn} noValidate className="mt-8 space-y-5">
                <Field id="agency-email" label="Work email" type="email" value={email} placeholder="you@agency.com" onChange={(value) => { setEmail(value); setError(""); }} />
                <Field id="agency-password" label="Password" type="password" value={password} placeholder="Enter your password" onChange={(value) => { setPassword(value); setError(""); }} />
                {error ? <p role="alert" className="text-sm text-red-300">{error}</p> : null}
                <CtaButton type="submit" size="lg" fullWidth disabled={isSubmitting}>{isSubmitting ? "Signing in…" : <>Sign in <ArrowRight /></>}</CtaButton>
              </form>
              <p className="mt-5 text-center text-xs leading-relaxed text-white/38">Use the same Kelo account you use in the app. Only verified agency team leaders can open this workspace.</p>
            </LivingCard>
            <p className="mx-auto mt-5 max-w-md text-center text-sm text-white/45">Need agency access? Contact <a className="text-kelo-200 underline underline-offset-4" href="mailto:hello@kelo-care.com">hello@kelo-care.com</a>.</p>
          </motion.div>
        </div>
      </section>
    </CareCanvas>
  );
}

function Field({ id, label, type, value, placeholder, onChange }: { id: string; label: string; type: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return <div><label htmlFor={id} className="block text-sm font-medium text-white/72">{label}</label><input id={id} type={type} value={value} placeholder={placeholder} autoComplete={type === "password" ? "current-password" : "email"} onChange={(event) => onChange(event.target.value)} className={cn("mt-2 block w-full rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 text-base text-white outline-none backdrop-blur-md transition-[border-color,box-shadow] placeholder:text-white/30 focus:border-kelo-400 focus:ring-4 focus:ring-kelo-500/15")} /></div>;
}

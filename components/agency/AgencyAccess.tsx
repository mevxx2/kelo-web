"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";
import { ArrowRight, CareCanvas, CtaButton, LivingCard, cn } from "./ui";

const POINTS: [string, string][] = [
  ["Team visibility", "See schedules, live visit status, and care notes in one place."],
  ["Clear assignments", "Keep caregivers, clients, and tasks connected across every shift."],
  ["Caregiver-paid access", "$0 billed to your agency. Caregivers choose $59/year or $6.99/month, with 14 days free."],
];

export function AgencyAccess() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only the team leader of a Kelo agency may open the workspace, whichever way they signed in.
  const enterIfLeader = async (userId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const who = userData.user?.email || "This account";
    const { data: profile, error: profileError } = await supabase.from("profiles").select("id, role, agency_id").eq("id", userId).maybeSingle();
    let message = "";
    if (profileError) message = `We couldn't load the Kelo profile for ${who} (${profileError.message}).`;
    else if (!profile) message = `${who} has no Kelo profile yet. Sign in to the Kelo app with this account first and finish setting it up.`;
    else if (profile.role !== "team_leader") message = `${who} is signed up as a ${String(profile.role).replace("_", " ")}. Only the team leader of a Kelo agency can open this portal.`;
    else if (!profile.agency_id) message = `${who} is a team leader but hasn't created an agency yet. Create your agency in the Kelo app first.`;
    else {
      const { data: agency } = await supabase.from("agencies").select("id, leader_id").eq("id", profile.agency_id).maybeSingle();
      if (agency?.leader_id !== userId) message = `${who} isn't the leader of its agency. Only the agency's team leader can open this portal.`;
    }
    if (message) {
      await supabase.auth.signOut();
      setError(message);
      return false;
    }
    router.push("/for-agencies/dashboard");
    return true;
  };

  // Returning from Google (or an already signed-in leader): finish sign-in automatically.
  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const returnedError = params.get("error_description") || hash.get("error_description");
    if (returnedError) {
      setError(/redirect/i.test(returnedError) ? "Google sent you back to an address that isn't allowed yet. Add this page's address to the Redirect URLs in Supabase." : decodeURIComponent(returnedError.replace(/\+/g, " ")));
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }
    const returning = Boolean(params.get("code") || hash.get("access_token"));
    const finish = async (userId: string) => {
      if (!active) return;
      setIsSubmitting(true);
      const stalled = window.setTimeout(() => {
        if (active) { setIsSubmitting(false); setError("Sign-in is taking longer than expected. Check your connection and try again, or use your work email."); }
      }, 15000);
      try {
        const ok = await enterIfLeader(userId);
        if (active && !ok) setIsSubmitting(false);
      } catch {
        if (active) { setIsSubmitting(false); setError("We couldn't finish signing you in. Please try again."); }
      } finally {
        window.clearTimeout(stalled);
      }
    };
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) { setError("We couldn't finish signing you in. Please try again."); return; }
      if (data.session) void finish(data.session.user.id);
      else if (returning) setError("We couldn't complete Google sign-in. Please try again.");
    });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !password) {
      setError("Enter your work email and password to continue.");
      return;
    }
    setIsSubmitting(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError || !data.user) {
      setError("We couldn't sign you in with those details. Please try again.");
      setIsSubmitting(false);
      return;
    }
    if (!(await enterIfLeader(data.user.id))) setIsSubmitting(false);
  };

  const signInWithGoogle = async () => {
    setError("");
    setIsSubmitting(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/for-agencies` },
    });
    if (oauthError) {
      setError(/provider.*(disabled|not enabled)|unsupported provider/i.test(oauthError.message) ? "Google sign-in is not enabled yet." : "Google sign-in could not be started. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <CareCanvas variant="agency">
      <section className="relative min-h-screen px-5 pb-16 pt-32 sm:px-8 sm:pt-36">
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
          <div className="ag-rise max-w-xl">
            <span className="grid h-20 w-20 place-items-center rounded-[1.4rem] bg-white shadow-lift">
              <Image src="/images/app/kelo-wordmark.png" alt="Kelo Care" width={733} height={343} className="h-auto w-[72%]" priority />
            </span>
            <p className="mt-9 text-xs font-bold uppercase tracking-[.28em] text-kelo-600">Agency portal</p>
            <h1 className="mt-4 text-balance text-5xl font-bold tracking-[-.04em] text-ink-950 sm:text-7xl" style={{ lineHeight: 1.02 }}>
              The care team, <span className="bg-gradient-to-r from-kelo-400 to-kelo-700 bg-clip-text text-transparent" style={{ WebkitTextFillColor: "transparent" }}>in one clear view.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-700/70">
              Kelo&apos;s agency workspace brings your roster, client assignments, visits, and care notes together, built for the people coordinating the whole picture.
            </p>
            <div className="mt-10 space-y-4">
              {POINTS.map(([title, body], index) => (
                <div key={title} className="ag-rise-2 flex gap-4" style={{ animationDelay: `${0.15 + index * 0.09}s` }}>
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kelo-100 text-xs font-bold text-kelo-700 ring-1 ring-inset ring-kelo-300/50">{index + 1}</span>
                  <p className="text-sm leading-relaxed text-ink-700/70"><strong className="font-semibold text-ink-950">{title}.</strong> {body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ag-rise-3">
            <LivingCard className="mx-auto max-w-md p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[.22em] text-kelo-600">Welcome back</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-.03em] text-ink-950">Sign in to your workspace</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700/65">Use the work email connected to your agency account.</p>
              <form onSubmit={signIn} noValidate className="mt-8 space-y-5">
                <Field id="agency-email" label="Work email" type="email" value={email} placeholder="you@agency.com" onChange={(value) => { setEmail(value); setError(""); }} />
                <Field id="agency-password" label="Password" type="password" value={password} placeholder="Enter your password" onChange={(value) => { setPassword(value); setError(""); }} />
                {error ? <p role="alert" className="text-sm text-red-400">{error}</p> : null}
                <CtaButton type="submit" size="lg" fullWidth disabled={isSubmitting}>{isSubmitting ? "Signing in…" : <>Sign in <ArrowRight /></>}</CtaButton>
              </form>
              <div className="my-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-[.18em] text-ink-700/45">
                <span className="h-px flex-1 bg-kelo-600/15" />or continue with<span className="h-px flex-1 bg-kelo-600/15" />
              </div>
              <button type="button" onClick={signInWithGoogle} disabled={isSubmitting} className="group flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-kelo-600/20 bg-white px-5 py-3 text-sm font-semibold text-ink-950 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-kelo-500/50 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60">
                <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" /><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" /><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" /><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" /></svg>
                Continue with Google
              </button>
              <p className="mt-5 text-center text-xs leading-relaxed text-ink-700/55">Use the same Kelo account you use in the app. Only verified agency team leaders can open this workspace.</p>
            </LivingCard>
            <p className="mx-auto mt-5 max-w-md text-center text-sm text-ink-700/60">
              Need agency access? Contact <a className="font-semibold text-kelo-700 underline underline-offset-4" href="mailto:hello@kelo-care.com">hello@kelo-care.com</a>.
            </p>
          </div>
        </div>
      </section>
    </CareCanvas>
  );
}

function Field({ id, label, type, value, placeholder, onChange }: { id: string; label: string; type: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-800">{label}</label>
      <input
        id={id} type={type} value={value} placeholder={placeholder}
        autoComplete={type === "password" ? "current-password" : "email"}
        onChange={(event) => onChange(event.target.value)}
        className={cn("mt-2 block w-full rounded-2xl border px-4 py-3 text-base outline-none transition-[border-color,box-shadow] placeholder:text-ink-700/35 focus:border-kelo-500 focus:ring-4 focus:ring-kelo-500/15")}
      />
    </div>
  );
}

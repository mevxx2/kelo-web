"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { ArrowRight, CtaButton } from "@/components/ui/button";
import {
  EASE_OUT,
  SPRING_SNAPPY,
  cardIn,
  staggerContainer,
  useMotion,
} from "@/lib/motion";

type Mode = "signup" | "signin";

const HIGHLIGHTS = [
  {
    title: "Assign & schedule",
    body: "Invite caregivers, assign them to clients, and cover multiple visits a day without double-booking anyone.",
    icon: (
      <path
        d="M4.5 4.5h15v15h-15v-15Zm0 5.5h15M8 3v3M16 3v3M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "See it as it happens",
    body: "Live visit status and adherence tracking, with missed tasks flagged the moment they're missed \u2014 not Friday afternoon.",
    icon: (
      <path
        d="M2.5 12s3.2-6.5 9.5-6.5S21.5 12 21.5 12 18.3 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Notes that stay internal",
    body: "Caregiver handoffs and team chat are separate from what clients and family see \u2014 by default, not by discipline.",
    icon: (
      <path
        d="M4 5.5h16v10H8.5L5 19v-3.5H4v-10Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Reports, exported",
    body: "Completion rates, adherence, and client care reports, ready to download whenever you need them.",
    icon: (
      <path
        d="M4 20h16M7 20v-6M12 20V8M17 20v-9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
];

export default function ForAgenciesPage() {
  const { safe, dist, time } = useMotion();
  const [mode, setMode] = useState<Mode>("signup");

  const field = {
    hidden: safe ? { opacity: 0, y: dist(18) } : { opacity: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: time(0.55), ease: EASE_OUT },
    },
  };

  return (
    <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-12">
      {/* Left: what an agency gets, condensed from the full role spec into the
          headline items — the auth card is the actual destination, this just
          earns the click. */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer({ safe, stagger: 0.08 })}
      >
        <motion.span
          variants={field}
          className="inline-flex items-center rounded-full bg-kelo-50 px-3.5 py-1.5 text-xs font-semibold text-kelo-700 ring-1 ring-inset ring-kelo-100"
        >
          For agencies
        </motion.span>

        <motion.h1
          variants={field}
          className="mt-5 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
        >
          Run your care team from one place.
        </motion.h1>

        <motion.p
          variants={field}
          className="mt-4 max-w-md text-pretty text-base leading-relaxed text-slate-600"
        >
          Live visit tracking, scheduling, and reporting for every caregiver on
          your team — with your agency&apos;s records visible only to your
          agency.
        </motion.p>

        <motion.ul
          variants={staggerContainer({ safe, stagger: 0.08, delayChildren: 0.1 })}
          className="mt-10 space-y-4"
        >
          {HIGHLIGHTS.map((item, i) => (
            <motion.li
              key={item.title}
              variants={cardIn({ safe, rotate: 0, y: 22 })}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-card backdrop-blur-sm"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-kelo-50 text-kelo-600 ring-1 ring-inset ring-kelo-100">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  {item.icon}
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {item.title}
                </p>
                <p className="mt-1 text-pretty text-sm leading-relaxed text-slate-600">
                  {item.body}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          variants={field}
          className="mt-6 max-w-md text-pretty text-xs leading-relaxed text-slate-500"
        >
          Every agency&apos;s data is walled off from every other agency —
          enforced at the database level, not just hidden in the interface.
        </motion.p>
      </motion.div>

      {/* Right: the actual auth card. */}
      <motion.div
        initial={safe ? { opacity: 0, y: dist(24) } : { opacity: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: time(0.6), ease: EASE_OUT, delay: 0.1 }}
        className="lg:sticky lg:top-32"
      >
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-7 shadow-card backdrop-blur-xl sm:p-8">
          <ModeToggle mode={mode} onChange={setMode} safe={safe} />

          <AnimatePresence mode="wait" initial={false}>
            {mode === "signup" ? (
              <motion.div
                key="signup"
                initial={safe ? { opacity: 0, y: 8 } : { opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={safe ? { opacity: 0, y: -8 } : { opacity: 0 }}
                transition={{ duration: safe ? 0.22 : 0, ease: EASE_OUT }}
              >
                <SignupForm safe={safe} />
              </motion.div>
            ) : (
              <motion.div
                key="signin"
                initial={safe ? { opacity: 0, y: 8 } : { opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={safe ? { opacity: 0, y: -8 } : { opacity: 0 }}
                transition={{ duration: safe ? 0.22 : 0, ease: EASE_OUT }}
              >
                <SigninForm safe={safe} />
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-6 text-center text-sm text-slate-500">
            Not an agency?{" "}
            <Link
              href="/get-started"
              className="font-medium text-kelo-600 underline underline-offset-2 hover:text-kelo-800"
            >
              Join as a caregiver or family member
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* --------------------------------- Tabs ---------------------------------- */

function ModeToggle({
  mode,
  onChange,
  safe,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
  safe: boolean;
}) {
  const TABS: { id: Mode; label: string }[] = [
    { id: "signup", label: "Sign up" },
    { id: "signin", label: "Sign in" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Sign in or sign up"
      className="mb-7 grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1"
    >
      {TABS.map((tab) => {
        const active = mode === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative rounded-full py-2.5 text-sm font-semibold transition-colors duration-200",
              active ? "text-white" : "text-slate-600 hover:text-slate-900",
            )}
          >
            {active && (
              <motion.span
                layoutId="agency-auth-tab"
                transition={SPRING_SNAPPY}
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-kelo-500 to-kelo-700 shadow-glow"
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------- Sign up --------------------------------- */

interface SignupErrors {
  agency?: string;
  name?: string;
  email?: string;
  password?: string;
}

function SignupForm({ safe }: { safe: boolean }) {
  const router = useRouter();

  const [agency, setAgency] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignupErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  const validate = (
    nextAgency = agency,
    nextName = name,
    nextEmail = email,
    nextPassword = password,
  ): SignupErrors => {
    const found: SignupErrors = {};
    if (!nextAgency.trim()) found.agency = "Please enter your agency name.";
    if (!nextName.trim()) found.name = "Please enter your name.";
    if (!nextEmail.trim()) found.email = "Please enter your work email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(nextEmail.trim()))
      found.email = "That doesn't look like a valid email address.";
    if (!nextPassword) found.password = "Please choose a password.";
    else if (nextPassword.length < 8)
      found.password = "Use at least 8 characters.";
    return found;
  };

  const revalidate = (
    nextAgency: string,
    nextName: string,
    nextEmail: string,
    nextPassword: string,
  ) => {
    if (submitted)
      setErrors(validate(nextAgency, nextName, nextEmail, nextPassword));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setPending(true);

    // Placeholder — there's no backend yet (see README). Swap this for the
    // real Supabase Auth sign-up call once app.kelocare.com exists; nothing
    // else on this page needs to change.
    console.log("[kelo] agency signup", {
      agency: agency.trim(),
      name: name.trim(),
      email: email.trim(),
    });
    await new Promise((resolve) => setTimeout(resolve, 900));

    router.push("/get-started/confirmation?role=agency");
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field
        id="agency"
        label="Agency name"
        type="text"
        autoComplete="organization"
        placeholder="Riverside Home Care"
        value={agency}
        error={errors.agency}
        safe={safe}
        onChange={(v) => {
          setAgency(v);
          revalidate(v, name, email, password);
        }}
      />
      <div className="mt-5">
        <Field
          id="agency-name"
          label="Your name"
          type="text"
          autoComplete="name"
          placeholder="Ada Mensah"
          value={name}
          error={errors.name}
          safe={safe}
          onChange={(v) => {
            setName(v);
            revalidate(agency, v, email, password);
          }}
        />
      </div>
      <div className="mt-5">
        <Field
          id="agency-email"
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="ada@riversidehomecare.com"
          value={email}
          error={errors.email}
          safe={safe}
          onChange={(v) => {
            setEmail(v);
            revalidate(agency, name, v, password);
          }}
        />
      </div>
      <div className="mt-5">
        <Field
          id="agency-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          error={errors.password}
          safe={safe}
          onChange={(v) => {
            setPassword(v);
            revalidate(agency, name, email, v);
          }}
        />
      </div>

      <div className="mt-7">
        <CtaButton
          type="submit"
          size="lg"
          disabled={pending}
          magnetic={0}
          fullWidth
        >
          {pending ? (
            <>
              <Spinner />
              Setting up your workspace
            </>
          ) : (
            <>
              Create agency workspace
              <ArrowRight />
            </>
          )}
        </CtaButton>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
        By creating a workspace you agree to receive product and account
        updates.
      </p>
    </form>
  );
}

/* -------------------------------- Sign in --------------------------------- */

interface SigninErrors {
  email?: string;
  password?: string;
}

function SigninForm({ safe }: { safe: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SigninErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const validate = (nextEmail = email, nextPassword = password): SigninErrors => {
    const found: SigninErrors = {};
    if (!nextEmail.trim()) found.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(nextEmail.trim()))
      found.email = "That doesn't look like a valid email address.";
    if (!nextPassword) found.password = "Please enter your password.";
    return found;
  };

  const revalidate = (nextEmail: string, nextPassword: string) => {
    if (submitted) setErrors(validate(nextEmail, nextPassword));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setPending(true);

    // Placeholder — the agency portal (app.kelocare.com) isn't live yet, so
    // there's no account to actually sign in to. Swap this block for the real
    // Supabase Auth call + redirect once it exists.
    console.log("[kelo] agency signin attempt", { email: email.trim() });
    await new Promise((resolve) => setTimeout(resolve, 900));

    setPending(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-kelo-50 text-kelo-600 ring-1 ring-inset ring-kelo-100">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
            <path
              d="M12 8v4.5l3 2M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="mt-4 text-base font-semibold text-slate-900">
          The portal&apos;s almost ready.
        </p>
        <p className="mt-2 max-w-xs text-pretty text-sm leading-relaxed text-slate-600">
          Agency sign-in opens with app.kelocare.com. We&apos;ll email{" "}
          <span className="font-medium text-slate-900">{email.trim()}</span>{" "}
          the moment your workspace is ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field
        id="signin-email"
        label="Work email"
        type="email"
        autoComplete="email"
        placeholder="ada@riversidehomecare.com"
        value={email}
        error={errors.email}
        safe={safe}
        onChange={(v) => {
          setEmail(v);
          revalidate(v, password);
        }}
      />
      <div className="mt-5">
        <Field
          id="signin-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          error={errors.password}
          safe={safe}
          onChange={(v) => {
            setPassword(v);
            revalidate(email, v);
          }}
        />
      </div>

      <div className="mt-3 text-right">
        <Link
          href="/#contact"
          className="text-xs font-medium text-kelo-600 underline underline-offset-2 hover:text-kelo-800"
        >
          Forgot password?
        </Link>
      </div>

      <div className="mt-6">
        <CtaButton
          type="submit"
          size="lg"
          disabled={pending}
          magnetic={0}
          fullWidth
        >
          {pending ? (
            <>
              <Spinner />
              Signing in
            </>
          ) : (
            <>
              Sign in
              <ArrowRight />
            </>
          )}
        </CtaButton>
      </div>
    </form>
  );
}

/* ------------------------------ Shared bits -------------------------------- */

function Field({
  id,
  label,
  type,
  value,
  error,
  safe,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  error?: string;
  safe: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-2 block w-full rounded-2xl border bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition-[border-color,box-shadow] duration-200",
          "placeholder:text-slate-400",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            : "border-slate-200 focus:border-kelo-500 focus:ring-4 focus:ring-kelo-500/15",
        )}
      />

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: safe ? 0.26 : 0, ease: EASE_OUT }}
            className="overflow-hidden text-sm text-red-600"
          >
            <span className="block pt-2">{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 animate-spin"
      aria-hidden="true"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

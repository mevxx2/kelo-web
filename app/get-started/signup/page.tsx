"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { ArrowRight, CtaButton } from "@/components/ui/button";
import { EASE_OUT, staggerContainer, useMotion } from "@/lib/motion";

const ROLE_LABELS: Record<string, string> = {
  caregiver: "Caregiver",
  agency: "Agency",
  family: "Family member",
};

export default function SignupPage() {
  // useSearchParams opts the tree into client rendering; the Suspense boundary
  // is what keeps the rest of the route statically renderable.
  return (
    <Suspense fallback={<FormSkeleton />}>
      <SignupForm />
    </Suspense>
  );
}

interface Errors {
  name?: string;
  email?: string;
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { safe, dist, time } = useMotion();

  const roleParam = searchParams.get("role") ?? "";
  const roleLabel = ROLE_LABELS[roleParam];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  /*
   * Takes the values explicitly rather than closing over state. Called from
   * onChange, it would otherwise validate the *previous* render's values —
   * setName is asynchronous — so an error would clear one keystroke after the
   * field was actually fixed.
   */
  const validate = (nextName = name, nextEmail = email): Errors => {
    const found: Errors = {};
    if (!nextName.trim()) found.name = "Please enter your name.";
    if (!nextEmail.trim()) found.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(nextEmail.trim()))
      found.email = "That doesn't look like a valid email address.";
    return found;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setPending(true);

    // Placeholder for the real signup call. Swap the delay for the API request
    // when the backend exists; nothing else on this page needs to change.
    console.log("[kelo] signup", {
      name: name.trim(),
      email: email.trim(),
      role: roleParam || null,
    });
    await new Promise((resolve) => setTimeout(resolve, 900));

    const query = roleParam ? `?role=${roleParam}` : "";
    router.push(`/get-started/confirmation${query}`);
  };

  // Re-validate as the user fixes things, but only after a first submit — no
  // scolding someone mid-keystroke.
  const revalidate = (nextName: string, nextEmail: string) => {
    if (submitted) setErrors(validate(nextName, nextEmail));
  };

  const field = {
    hidden: safe ? { opacity: 0, y: dist(16) } : { opacity: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: time(0.5), ease: EASE_OUT },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer({ safe, stagger: 0.08 })}
      className="mx-auto max-w-md"
    >
      {roleLabel && (
        <motion.div variants={field} className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-kelo-500/10 px-3.5 py-1.5 text-xs font-semibold text-kelo-300 ring-1 ring-inset ring-kelo-400/20">
            {roleLabel}
            <Link
              href="/get-started"
              className="text-kelo-400 underline underline-offset-2 hover:text-kelo-300"
            >
              change
            </Link>
          </span>
        </motion.div>
      )}

      <motion.h1
        variants={field}
        className="mt-6 text-balance text-center text-3xl font-normal tracking-tight text-white sm:text-4xl"
      >
        Join the early access list.
      </motion.h1>

      <motion.p
        variants={field}
        className="mx-auto mt-4 max-w-sm text-pretty text-center text-base leading-relaxed text-white/50"
      >
        We&apos;ll email you when your spot opens up. No card, no commitment.
      </motion.p>

      <motion.form
        variants={field}
        onSubmit={handleSubmit}
        noValidate
        className="living-card mt-10 rounded-[2rem] border border-white/20 bg-white/[0.075] p-7 shadow-[0_22px_70px_-34px_rgba(4,7,28,.9),inset_0_1px_0_rgba(255,255,255,.18)] backdrop-blur-md sm:p-8"
      >
        <Field
          id="name"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Ada Mensah"
          value={name}
          error={errors.name}
          safe={safe}
          onChange={(v) => {
            setName(v);
            revalidate(v, email);
          }}
        />

        <div className="mt-5">
          <Field
            id="email"
            label="Work email"
            type="email"
            autoComplete="email"
            placeholder="ada@example.com"
            value={email}
            error={errors.email}
            safe={safe}
            onChange={(v) => {
              setEmail(v);
              revalidate(name, v);
            }}
          />
        </div>

        <div className="mt-8">
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
                Setting things up
              </>
            ) : (
              <>
                Join the list
                <ArrowRight />
              </>
            )}
          </CtaButton>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-white/40">
          By joining you agree to receive product updates. Unsubscribe any time.
        </p>
      </motion.form>
    </motion.div>
  );
}

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
      <label
        htmlFor={id}
        className="block text-sm font-medium text-white/70"
      >
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
          "mt-2 block w-full rounded-2xl border bg-white/[0.08] px-4 py-3 text-base text-white outline-none backdrop-blur-md transition-[border-color,box-shadow] duration-200",
          "placeholder:text-white/30",
          error
            ? "border-red-400/50 focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
            : "border-white/15 focus:border-kelo-400 focus:ring-4 focus:ring-kelo-500/15",
        )}
      />

      {/* Errors animate their own height so the button below never jumps. */}
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

function FormSkeleton() {
  return (
    <div className="mx-auto max-w-md animate-pulse">
      <div className="mx-auto h-6 w-28 rounded-full bg-white/5" />
      <div className="mx-auto mt-6 h-9 w-3/4 rounded-lg bg-white/5" />
      <div className="mx-auto mt-4 h-5 w-2/3 rounded-lg bg-white/5" />
      <div className="mt-10 h-72 rounded-3xl bg-white/5" />
    </div>
  );
}

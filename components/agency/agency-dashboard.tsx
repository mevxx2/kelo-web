"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

import { CareCanvas } from "@/components/landing/care-thread";
import { LivingCard } from "@/components/ui/living-card";
import { CtaButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EASE_OUT, useMotionSafe } from "@/lib/motion";

type View =
  "overview" | "team" | "clients" | "schedule" | "reports" | "messages";

const NAV: Array<{ id: View; label: string; icon: string }> = [
  { id: "overview", label: "Overview", icon: "⌂" },
  { id: "team", label: "Care team", icon: "◉" },
  { id: "clients", label: "Clients", icon: "♡" },
  { id: "schedule", label: "Schedule", icon: "◷" },
  { id: "reports", label: "Reports", icon: "▤" },
  { id: "messages", label: "Messages", icon: "✦" },
];

const VISITS = [
  ["Maya Thompson", "Thomas Reed", "In progress", "10:00–12:00"],
  ["Jordan Okafor", "Elaine Cooper", "Starts soon", "12:30–14:00"],
  ["Nora Patel", "Robert Hill", "Complete", "08:00–10:00"],
];
const CAREGIVERS = [
  ["Maya Thompson", "4 visits today", "Visiting Thomas Reed", "Active"],
  ["Jordan Okafor", "3 visits today", "Available until 12:30", "Available"],
  ["Nora Patel", "2 visits today", "Last visit complete", "Complete"],
  ["Luis Bennett", "4 visits today", "Needs schedule review", "Attention"],
];
const CLIENTS = [
  [
    "Thomas Reed",
    "Maya Thompson",
    "Visit in progress",
    "Care plan updated Aug 21",
  ],
  [
    "Elaine Cooper",
    "Jordan Okafor",
    "Next visit 12:30",
    "Medication reminder added",
  ],
  ["Robert Hill", "Nora Patel", "Visit complete", "Family update sent"],
  ["Joan Fields", "Unassigned", "Needs coverage", "Add a caregiver"],
];

export function AgencyDashboard() {
  const safe = useMotionSafe();
  const [view, setView] = useState<View>("overview");
  const [notice, setNotice] = useState("");
  const active = NAV.find((item) => item.id === view)!;
  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  };

  return (
    <CareCanvas variant="agency">
      <section className="relative min-h-screen px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
        <motion.div
          initial={safe ? { opacity: 0, y: 18 } : { opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: safe ? 0.55 : 0.15, ease: EASE_OUT }}
          className="mx-auto max-w-7xl"
        >
          <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-[#090d24]/65 shadow-[0_30px_90px_-45px_rgba(0,0,0,.95)] backdrop-blur-xl">
            <div className="flex min-h-[720px]">
              <aside className="hidden w-60 shrink-0 border-r border-white/10 bg-white/[.035] p-5 lg:block">
                <Link
                  href="/for-agencies"
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-kelo-500 text-sm font-bold">
                    K
                  </span>
                  <span className="font-semibold tracking-tight">
                    Kelo Care
                  </span>
                </Link>
                <p className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-white/30">
                  Agency workspace
                </p>
                <nav className="mt-3 space-y-1" aria-label="Agency workspace">
                  {NAV.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setView(item.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-colors",
                        view === item.id
                          ? "bg-kelo-500/16 text-white ring-1 ring-inset ring-kelo-300/18"
                          : "text-white/52 hover:bg-white/[.055] hover:text-white",
                      )}
                    >
                      <span className="w-5 text-center text-base text-kelo-200">
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  ))}
                </nav>
                <div className="mt-auto pt-12">
                  <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
                    <p className="text-sm font-semibold text-white">
                      North Star Home Care
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/42">
                      12 caregivers · 18 visits today
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        showNotice(
                          "Workspace settings are part of the full portal build.",
                        )
                      }
                      className="mt-4 text-xs font-medium text-kelo-200 underline underline-offset-4"
                    >
                      Workspace settings
                    </button>
                  </div>
                </div>
              </aside>
              <div className="min-w-0 flex-1 p-5 sm:p-7 lg:p-9">
                <header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[.24em] text-kelo-200">
                      {active.label}
                    </p>
                    <h1 className="mt-2 text-3xl font-medium tracking-[-.045em] text-white sm:text-4xl">
                      {view === "overview"
                        ? "Good morning, Ada."
                        : active.label}
                    </h1>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        showNotice("Notifications are all caught up.")
                      }
                      className="rounded-full border border-white/12 px-3 py-2 text-sm text-white/65 hover:bg-white/[.06]"
                    >
                      Notifications
                    </button>
                    <CtaButton href="/for-agencies/signup" size="md">
                      Invite caregiver
                    </CtaButton>
                  </div>
                </header>
                <div className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                  {NAV.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className={cn(
                        "whitespace-nowrap rounded-full px-3 py-2 text-sm",
                        view === item.id
                          ? "bg-kelo-500 text-white"
                          : "bg-white/[.06] text-white/55",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {notice ? (
                  <p
                    role="status"
                    className="mt-5 rounded-2xl border border-kelo-300/25 bg-kelo-500/12 px-4 py-3 text-sm text-kelo-100"
                  >
                    {notice}
                  </p>
                ) : null}
                <main className="mt-7">
                  <WorkspaceView view={view} onAction={showNotice} />
                </main>
              </div>
            </div>
          </div>
          <p className="mt-5 text-center text-xs text-white/35">
            Agency portal preview with sample care data. Actions are shown for
            demonstration and are not stored.
          </p>
        </motion.div>
      </section>
    </CareCanvas>
  );
}

function WorkspaceView({
  view,
  onAction,
}: {
  view: View;
  onAction: (message: string) => void;
}) {
  if (view === "team") return <TeamView onAction={onAction} />;
  if (view === "clients") return <ClientsView onAction={onAction} />;
  if (view === "schedule") return <ScheduleView onAction={onAction} />;
  if (view === "reports") return <ReportsView onAction={onAction} />;
  if (view === "messages") return <MessagesView onAction={onAction} />;
  return <Overview onAction={onAction} />;
}

function Overview({ onAction }: { onAction: (message: string) => void }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["12", "Active caregivers", "2 currently visiting"],
          ["18", "Visits today", "11 complete so far"],
          ["3", "Needs attention", "Review before end of day"],
        ].map(([number, label, detail]) => (
          <LivingCard key={label} className="p-5">
            <p className="text-4xl font-medium tracking-[-.05em] text-white">
              {number}
            </p>
            <h2 className="mt-3 font-semibold text-white">{label}</h2>
            <p className="mt-1 text-sm text-white/48">{detail}</p>
          </LivingCard>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.8fr]">
        <VisitsTable onAction={onAction} />
        <LivingCard className="p-5">
          <p className="font-semibold text-white">Team focus</p>
          <p className="mt-1 text-sm text-white/45">Your next few actions</p>
          <div className="mt-5 space-y-3">
            {[
              "Assign coverage for 2 open visits",
              "Review Maya’s visit note",
              "Send today’s schedule update",
            ].map((item, index) => (
              <button
                type="button"
                key={item}
                onClick={() => onAction(`${item} opened.`)}
                className="flex w-full gap-3 rounded-2xl bg-white/[.055] p-4 text-left hover:bg-white/[.09]"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kelo-500/20 text-xs font-semibold text-kelo-200">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed text-white/68">
                  {item}
                </span>
              </button>
            ))}
          </div>
        </LivingCard>
      </div>
    </>
  );
}

function TeamView({ onAction }: { onAction: (message: string) => void }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_.34fr]">
      <LivingCard className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h2 className="font-semibold text-white">Caregiver roster</h2>
            <p className="mt-1 text-sm text-white/45">
              Availability, assignments, and live status
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAction("Add caregiver flow opened.")}
            className="rounded-full bg-kelo-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Add caregiver
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="border-y border-white/10 bg-white/[.025] text-xs uppercase tracking-[.14em] text-white/35">
              <tr>
                <th className="px-5 py-3 font-medium">Caregiver</th>
                <th className="px-5 py-3 font-medium">Today</th>
                <th className="px-5 py-3 font-medium">Current status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {CAREGIVERS.map(([name, visits, detail, status]) => (
                <tr
                  key={name}
                  className="border-b border-white/[.07] last:border-0"
                >
                  <td className="px-5 py-4 font-medium text-white">{name}</td>
                  <td className="px-5 py-4 text-white/55">{visits}</td>
                  <td className="px-5 py-4">
                    <Status value={status} />{" "}
                    <span className="ml-2 text-white/45">{detail}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onAction(`${name}'s profile opened.`)}
                      className="text-kelo-200 underline underline-offset-4"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LivingCard>
      <LivingCard className="p-5">
        <h2 className="font-semibold text-white">Coverage alerts</h2>
        <div className="mt-5 space-y-4">
          <Alert
            title="2 open visits"
            body="Tomorrow needs caregiver coverage."
            action="Assign now"
            onAction={onAction}
          />
          <Alert
            title="Luis needs a review"
            body="A schedule conflict was flagged."
            action="Review"
            onAction={onAction}
          />
        </div>
      </LivingCard>
    </div>
  );
}

function ClientsView({ onAction }: { onAction: (message: string) => void }) {
  return (
    <LivingCard className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="font-semibold text-white">Clients</h2>
          <p className="mt-1 text-sm text-white/45">
            Care plans, assigned caregivers, and service status
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAction("Add client flow opened.")}
          className="rounded-full bg-kelo-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Add client
        </button>
      </div>
      <div className="divide-y divide-white/[.07]">
        {CLIENTS.map(([name, caregiver, status, detail]) => (
          <div
            key={name}
            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-white">{name}</p>
              <p className="mt-1 text-sm text-white/48">
                Caregiver:{" "}
                <span
                  className={
                    caregiver === "Unassigned"
                      ? "text-amber-200"
                      : "text-white/70"
                  }
                >
                  {caregiver}
                </span>
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-kelo-100">{status}</p>
              <p className="mt-1 text-xs text-white/42">{detail}</p>
            </div>
            <button
              type="button"
              onClick={() => onAction(`${name}'s care plan opened.`)}
              className="text-left text-sm text-kelo-200 underline underline-offset-4 sm:text-right"
            >
              Manage plan
            </button>
          </div>
        ))}
      </div>
    </LivingCard>
  );
}

function ScheduleView({ onAction }: { onAction: (message: string) => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <VisitsTable onAction={onAction} />
      <LivingCard className="p-5">
        <h2 className="font-semibold text-white">Unassigned visits</h2>
        <p className="mt-1 text-sm text-white/45">
          Give every client confirmed coverage.
        </p>
        <div className="mt-5 space-y-3">
          {[
            ["Joan Fields", "Tomorrow · 09:00–11:00"],
            ["Martin Lewis", "Thursday · 13:00–15:00"],
          ].map(([client, time]) => (
            <div key={client} className="rounded-2xl bg-white/[.055] p-4">
              <p className="font-medium text-white">{client}</p>
              <p className="mt-1 text-sm text-white/45">{time}</p>
              <button
                type="button"
                onClick={() =>
                  onAction(`Assignment picker opened for ${client}.`)
                }
                className="mt-3 text-sm font-medium text-kelo-200 underline underline-offset-4"
              >
                Assign caregiver
              </button>
            </div>
          ))}
        </div>
      </LivingCard>
    </div>
  );
}

function ReportsView({ onAction }: { onAction: (message: string) => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
      <LivingCard className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-kelo-200">
          This week
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-[-.04em] text-white">
          Care delivery report
        </h2>
        <p className="mt-3 leading-relaxed text-white/55">
          Review completed visits, late starts, care notes, and outstanding
          follow-ups before sharing an internal update.
        </p>
        <div className="mt-7 grid grid-cols-2 gap-3">
          {[
            ["92%", "Visits completed"],
            ["14", "Notes submitted"],
            ["3", "Late starts"],
            ["0", "Missed visits"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-white/[.055] p-4">
              <p className="text-2xl font-medium text-white">{value}</p>
              <p className="mt-1 text-xs text-white/45">{label}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onAction("Report export prepared (preview only).")}
          className="mt-7 w-full rounded-full bg-kelo-500 py-3 text-sm font-semibold text-white"
        >
          Export report
        </button>
      </LivingCard>
      <LivingCard className="p-6">
        <h2 className="font-semibold text-white">Report library</h2>
        <p className="mt-1 text-sm text-white/45">
          Create a report for the people who need visibility.
        </p>
        <div className="mt-5 divide-y divide-white/[.07]">
          {[
            ["Daily service delivery", "Visits, status, and exceptions"],
            ["Caregiver activity", "Hours, notes, and visit completion"],
            ["Client care summary", "Service history and care notes"],
            [
              "Payroll-ready visit export",
              "Completed time entries by caregiver",
            ],
          ].map(([title, body]) => (
            <button
              type="button"
              key={title}
              onClick={() => onAction(`${title} report opened.`)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span>
                <strong className="block text-sm text-white">{title}</strong>
                <span className="mt-1 block text-xs text-white/42">{body}</span>
              </span>
              <span className="text-kelo-200">→</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onAction("Share report controls opened.")}
          className="mt-5 text-sm font-medium text-kelo-200 underline underline-offset-4"
        >
          Share a report with your team
        </button>
      </LivingCard>
    </div>
  );
}

function MessagesView({ onAction }: { onAction: (message: string) => void }) {
  const [message, setMessage] = useState("");
  return (
    <div className="grid gap-5 lg:grid-cols-[.65fr_1.35fr]">
      <LivingCard className="p-3">
        <p className="px-3 pb-3 pt-2 text-sm font-semibold text-white">
          Conversations
        </p>
        {[
          ["Care coordinators", "Schedule update for tomorrow", "3 min"],
          ["Maya Thompson", "Thomas Reed visit note", "20 min"],
          ["All caregivers", "New client care plan", "1 h"],
        ].map(([name, preview, time], index) => (
          <button
            key={name}
            type="button"
            onClick={() => onAction(`${name} conversation opened.`)}
            className={cn(
              "w-full rounded-2xl p-4 text-left",
              index === 0 ? "bg-kelo-500/14" : "hover:bg-white/[.05]",
            )}
          >
            <div className="flex justify-between gap-3">
              <strong className="text-sm text-white">{name}</strong>
              <span className="text-xs text-white/35">{time}</span>
            </div>
            <p className="mt-1 truncate text-sm text-white/45">{preview}</p>
          </button>
        ))}
      </LivingCard>
      <LivingCard className="flex min-h-[420px] flex-col p-5">
        <div className="border-b border-white/10 pb-4">
          <p className="font-semibold text-white">Care coordinators</p>
          <p className="mt-1 text-xs text-white/42">6 members</p>
        </div>
        <div className="flex-1 space-y-4 py-5">
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white/[.07] px-4 py-3 text-sm leading-relaxed text-white/70">
            Can someone confirm coverage for Joan Fields tomorrow morning?
          </div>
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-kelo-500/80 px-4 py-3 text-sm leading-relaxed text-white">
            I&apos;ve opened the assignment slot and will update the team
            shortly.
          </div>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (message.trim()) {
              onAction("Message sent in preview.");
              setMessage("");
            }
          }}
          className="flex gap-2 border-t border-white/10 pt-4"
        >
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write an update…"
            className="min-w-0 flex-1 rounded-2xl border border-white/12 bg-white/[.06] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-kelo-400"
          />
          <button
            type="submit"
            className="rounded-2xl bg-kelo-500 px-4 text-sm font-semibold text-white"
          >
            Send
          </button>
        </form>
      </LivingCard>
    </div>
  );
}

function VisitsTable({ onAction }: { onAction: (message: string) => void }) {
  return (
    <LivingCard className="overflow-hidden p-0">
      <div className="flex items-center justify-between p-5">
        <div>
          <p className="font-semibold text-white">Today&apos;s visits</p>
          <p className="mt-1 text-sm text-white/45">
            Live view from your care team
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAction("Full schedule opened.")}
          className="text-sm font-medium text-kelo-200 underline underline-offset-4"
        >
          View schedule
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-y border-white/10 bg-white/[.025] text-xs uppercase tracking-[.14em] text-white/35">
            <tr>
              <th className="px-5 py-3 font-medium">Caregiver</th>
              <th className="px-5 py-3 font-medium">Client</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {VISITS.map(([caregiver, client, status, time]) => (
              <tr
                key={caregiver}
                className="border-b border-white/[.07] last:border-0"
              >
                <td className="px-5 py-4 font-medium text-white">
                  {caregiver}
                </td>
                <td className="px-5 py-4 text-white/58">{client}</td>
                <td className="px-5 py-4">
                  <Status value={status} />
                </td>
                <td className="px-5 py-4 text-right text-white/52">{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LivingCard>
  );
}

function Status({ value }: { value: string }) {
  const styles: Record<string, string> = {
    "In progress": "bg-emerald-400/15 text-emerald-200",
    Complete: "bg-white/10 text-white/60",
    "Starts soon": "bg-amber-300/15 text-amber-100",
    Active: "bg-emerald-400/15 text-emerald-200",
    Available: "bg-kelo-400/15 text-kelo-100",
    Attention: "bg-amber-300/15 text-amber-100",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs",
        styles[value] ?? "bg-white/10 text-white/60",
      )}
    >
      {value}
    </span>
  );
}
function Alert({
  title,
  body,
  action,
  onAction,
}: {
  title: string;
  body: string;
  action: string;
  onAction: (message: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-white/[.055] p-4">
      <p className="font-medium text-white">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-white/45">{body}</p>
      <button
        type="button"
        onClick={() => onAction(`${title} opened.`)}
        className="mt-3 text-sm font-medium text-kelo-200 underline underline-offset-4"
      >
        {action}
      </button>
    </div>
  );
}

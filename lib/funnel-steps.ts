/**
 * Single source of truth for the /get-started funnel's step order — shared by
 * the stepper UI (app/get-started/layout.tsx) and the directional page
 * transition (components/page-transition.tsx) so they can't drift apart.
 */
export const FUNNEL_STEPS = [
  { label: "Your role", match: (p: string) => p === "/get-started" },
  { label: "Your details", match: (p: string) => p.startsWith("/get-started/signup") },
  { label: "Done", match: (p: string) => p.startsWith("/get-started/confirmation") },
];

export function getFunnelStepIndex(pathname: string): number {
  return Math.max(0, FUNNEL_STEPS.findIndex((step) => step.match(pathname)));
}

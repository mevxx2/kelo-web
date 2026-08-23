/*
 * Standalone shell for the agency auth screen — deliberately its own layout
 * rather than living under app/get-started/. That funnel's layout renders the
 * three-step progress stepper (lib/funnel-steps.ts), which doesn't apply here:
 * this is a single destination, not a step in the general signup flow.
 *
 * The mesh background is the same two radial gradients as
 * app/get-started/layout.tsx so this still reads as the same place, just a
 * wider canvas (max-w-6xl vs max-w-3xl) to hold the two-column layout.
 */
export default function ForAgenciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white pb-24 pt-28 sm:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgb(var(--kelo-100)/0.6),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(35%_30%_at_85%_10%,rgb(var(--sun-100)/0.5),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">{children}</div>
    </div>
  );
}

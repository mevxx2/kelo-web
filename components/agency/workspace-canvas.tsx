import type { ReactNode } from "react";

// The dashboard keeps the agency palette without running the landing page's
// full-height SVG thread and scroll-linked animations during daily work.
export function CareCanvas({ children }: { children: ReactNode; variant?: "agency" }) {
  return (
    <div className="agency-workspace-canvas care-canvas relative isolate overflow-hidden" data-care-variant="agency">
      {children}
    </div>
  );
}

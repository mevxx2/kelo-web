import type { Metadata } from "next";

import { AgencyDashboard } from "@/components/agency/agency-dashboard";

const description = "Kelo Care agency workspace dashboard.";

export const metadata: Metadata = {
  title: "Agency Workspace",
  description,
  robots: { index: false, follow: false },
};

export default function AgencyDashboardPage() {
  return <AgencyDashboard />;
}

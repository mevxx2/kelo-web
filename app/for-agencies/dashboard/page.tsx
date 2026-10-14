import type { Metadata } from "next";

import { AgencyDashboard } from "../../../components/agency/AgencyDashboard";

export const metadata: Metadata = {
  title: "Agency Workspace | Kelo Care",
  description: "Kelo Care agency workspace dashboard.",
  robots: { index: false, follow: false },
};

export default function AgencyDashboardPage() {
  return <AgencyDashboard />;
}

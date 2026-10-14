import type { Metadata } from "next";

import { AgencyAccess } from "../../components/agency/AgencyAccess";

const description = "Sign in to your Kelo Care agency workspace to manage your care team, clients, schedule and reports.";

export const metadata: Metadata = {
  title: "Agency Portal | Kelo Care",
  description,
  openGraph: { title: "Kelo Care Agency Portal", description, images: ["/og-kelo-care.png"] },
};

export default function ForAgenciesPage() {
  return <AgencyAccess />;
}

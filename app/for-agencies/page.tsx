import type { Metadata } from "next";

import { AgencyPage } from "@/components/agency/agency-page";

const description = "Give your home care team one clear view of visits, notes, schedules, and assignments, with no direct cost to your agency.";

export const metadata: Metadata = {
  title: "For Agencies",
  description,
  openGraph: { title: "Kelo Care for Agencies", description, images: ["/og.png"] },
  twitter: { title: "Kelo Care for Agencies", description, images: ["/og.png"] },
};

export default function ForAgenciesPage() {
  return <AgencyPage />;
}

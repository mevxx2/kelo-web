import type { Metadata } from "next";

import { AgencyAccess } from "@/components/agency/agency-access";

const description = "Sign in or create a Kelo Care agency workspace for your home care team.";

export const metadata: Metadata = {
  title: "Agency Portal",
  description,
  openGraph: { title: "Kelo Care Agency Portal", description, images: ["/og.png"] },
  twitter: { title: "Kelo Care Agency Portal", description, images: ["/og.png"] },
};

export default function ForAgenciesPage() {
  return <AgencyAccess />;
}

import type { Metadata } from "next";

import { AgencySignup } from "@/components/agency/agency-signup";

const description = "Create a Kelo Care agency workspace for your home care team.";

export const metadata: Metadata = {
  title: "Create Agency Workspace",
  description,
  openGraph: { title: "Create Agency Workspace · Kelo Care", description, images: ["/og.png"] },
  twitter: { title: "Create Agency Workspace · Kelo Care", description, images: ["/og.png"] },
};

export default function AgencySignupPage() {
  return <AgencySignup />;
}

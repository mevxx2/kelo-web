import type { Metadata } from "next";

import { AgencyContact } from "@/components/agency/agency-contact";

const description = "Tell Kelo Care about your home care agency and the team you want to connect.";

export const metadata: Metadata = {
  title: "Bring Kelo to Your Team",
  description,
  openGraph: { title: "Bring Kelo to Your Team · Kelo Care", description, images: ["/og.png"] },
  twitter: { title: "Bring Kelo to Your Team · Kelo Care", description, images: ["/og.png"] },
};

export default function AgencyContactPage() {
  return <AgencyContact />;
}

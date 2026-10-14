import type { Metadata } from "next";

import { TemplateLanding } from "../../components/TemplateLanding";

// The original landing page, kept as a backup of the first design.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function ClassicPage() {
  return <TemplateLanding />;
}

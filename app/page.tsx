import { ThreadOfCare } from "@/components/landing/thread-of-care";

// Server component: every section below is its own client island, so the page
// shell itself never ships to the browser.
export default function HomePage() {
  return <ThreadOfCare />;
}

import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

// Server component: every section below is its own client island, so the page
// shell itself never ships to the browser.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </>
  );
}

import { Hero } from "@/components/home/hero";
import { PlatformStats } from "@/components/home/platform-stats";
import { HowItWorks } from "@/components/home/how-it-works";
import { Features } from "@/components/home/features";
import { CTA } from "@/components/home/stats-section";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PlatformStats />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}

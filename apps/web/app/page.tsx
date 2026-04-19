import type { Metadata } from "next";

import {
  FooterSection,
  HeroSection,
  PricingSection,
  SetupSection,
  WhyChooseSection,
  Navbar,
} from "@/components/landing";
import LenisProvider from "@/components/lenis-provider";

export const metadata: Metadata = {
  title: "Cenra | AI-Powered Customer Support & Chat Widget",
  description: "Elevate your customer experience with Cenra. Integrate intelligent chat widgets, manage shared inboxes, and provide instant, accurate support with our AI-driven platform.",
};


const Page = () => {
  return (
    <main className="text-neutral-900">
      <LenisProvider />
      <Navbar />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col pt-6 sm:border-x border-dashed border-neutral-300 bg-white/30">
        <HeroSection />
        <SetupSection />
        <WhyChooseSection />
        <PricingSection />
        <FooterSection />
      </div>
    </main>
  );
};

export default Page;

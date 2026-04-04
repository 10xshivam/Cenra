import {
  FooterSection,
  HeroSection,
  PricingSection,
  SetupSection,
  WhyChooseSection,
  Navbar,
} from "@/components/landing";

const Page = () => {
  return (
    <main className="h-screen overflow-y-auto bg-amber-50 text-neutral-900 no-scrollbar">
      <Navbar />
      <div className="relative mx-auto flex w-full h-full max-w-7xl flex-col pt-6 sm:border-x border-dashed border-neutral-300 overflow-y-auto no-scrollbar bg-white/30">
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

import {
  FeaturesSection,
  FooterSection,
  HeroSection,
  KnowledgeSection,
  OperationsSection,
  PricingSection,
  BuiltWithStrip,
  WorkflowSection,
  Navbar,
} from "@/components/landing";

const Page = () => {
  return (
    <main className="h-screen overflow-y-auto bg-amber-50/50 text-neutral-900 no-scrollbar">
      <Navbar />
      <div className="relative mx-auto flex w-full h-full max-w-7xl flex-col pb-20 pt-6 border-x overflow-y-auto no-scrollbar">
        <HeroSection />
        <BuiltWithStrip />
        <WorkflowSection />
        {/* <FeaturesSection />
        <KnowledgeSection />
        <OperationsSection />
        <PricingSection />
        <FooterSection /> */}
      </div>
    </main>
  );
}

export default Page;


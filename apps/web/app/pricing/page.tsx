import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans",
  description: "Compare affordable subscription plans for Cenra's AI customer support tools and find the best fit for your team.",
};

import { PricingView } from '@/views/pricing-view'

const PricingPage = () => {
  return (
    <main className="h-screen overflow-y-auto no-scrollbar">
      <PricingView />
    </main>
  )
}

export default PricingPage

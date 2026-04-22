import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  description: "Your Cenra subscription payment was cancelled or unsuccessful. Please review your billing information.",
};

import { CancelPageView } from "@/views/billing/cancelPageView";

const BillingCancelPage = () => {
  return (
    <CancelPageView />
  );
}

export default BillingCancelPage;

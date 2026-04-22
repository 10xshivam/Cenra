import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Thank you for subscribing to Cenra. Your account is active, and you're ready to transform your customer support.",
};

import { SuccessPageView } from "@/views/billing/successPageView";


const BillingSuccessPage = () => {
  return (
    <SuccessPageView />
  );
}

export default BillingSuccessPage;

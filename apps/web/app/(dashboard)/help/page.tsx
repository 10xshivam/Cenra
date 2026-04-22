import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Find helpful resources, guides, and contact information for the Cenra AI customer service platform.",
};

import { HelpAndSupportView } from '@/views/dashboard/help-view'


const HelpAndSupport = () => {
  return (
    <HelpAndSupportView />
  )
}



export default HelpAndSupport

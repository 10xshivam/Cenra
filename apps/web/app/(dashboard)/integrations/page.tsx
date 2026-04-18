import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrations | Cenra",
  description: "Connect Cenra with Next.js, React, and your favorite tools using our easy-to-install embed scripts.",
};

import { IntegrationsView } from '@/views/dashboard/integrations-view'

const IntegrationsPage = () => {
  return (
    <IntegrationsView />
  )
}

export default IntegrationsPage

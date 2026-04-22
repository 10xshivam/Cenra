import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customize Widget",
  description: "Personalize your Cenra chat widget with branded colors, greetings, and behaviors specific to your workspace.",
};

import WidgetCustomizationView from '@/views/dashboard/widget-customization-view'


const WidgetCustomizationPage = () => {
  return (
    <WidgetCustomizationView />
  )
}

export default WidgetCustomizationPage

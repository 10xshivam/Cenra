import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started",
  description: "Begin your journey with Cenra. Learn how to configure your AI agent, connect resources, and embed the widget.",
};

import { GetStartedView } from "@/views/dashboard/get-started-view";


const GetStarted = () => {
  return <GetStartedView />;
};



export default GetStarted;

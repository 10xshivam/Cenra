import { OnboardingSidebar } from "@/components/auth/onboarding-sidebar";
import React from "react";


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen p-10 gap-10 overflow-hidden">
      <OnboardingSidebar />
      <div className="w-2/4 flex flex-col justify-center p-7">{children}</div>
    </div>
  );
};

export default Layout;



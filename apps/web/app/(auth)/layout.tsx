import { OnboardingSidebar } from "@/components/auth/onboarding-sidebar";
import { PaymentView } from "@/views/auth/payment";
import CreateWorkspace from "./create-workspace/page";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative mx-auto flex w-full min-h-screen max-w-4xl justify-center items-center sm:border-x border-dashed border-neutral-300 overflow-y-auto no-scrollbar bg-white/30">
      {children}
    </div>
  );
};

export default Layout;

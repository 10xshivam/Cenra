import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { MainHeader } from "@/components/dashboard/main-header";
import {
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";

export const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultValue={defaultOpen ? "true" : "false"}>
      <DashboardSidebar />
      <main className="flex flex-1 flex-col w-full min-h-screen bg-neutral-100">
        <MainHeader />
        {children}
      </main>
    </SidebarProvider>
  );
};

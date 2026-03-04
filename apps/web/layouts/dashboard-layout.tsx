import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { MainHeader } from "@/components/dashboard/main-header";
import { RouteVisitTracker } from "@/components/dashboard/route-visit-tracker";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";

export const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultValue={defaultOpen ? "true" : "false"}>
      <DashboardSidebar />
      <SidebarInset className="h-svh overflow-hidden flex flex-col">
        <main className="flex-1 p-2 pl-0 min-h-0">
          <div className="bg-neutral-50 rounded-lg w-full h-full overflow-hidden border flex flex-col">
            <MainHeader />
            <RouteVisitTracker />
            <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { MainHeader } from "@/components/dashboard/main-header";
import { RouteVisitTracker } from "@/components/dashboard/route-visit-tracker";
import { WorkspaceSessionSync } from "@/components/dashboard/workspace-session-sync";
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
    <>
      <div className="lg:hidden min-h-svh w-full flex items-center justify-center p-6">
        <div className="w-full max-w-md border border-neutral-300 border-dashed p-7 text-center bg-white/40">
          <p className="text-neutral-700 font-medium tracking-tight">
            Please open in desktop for better experience.
          </p>
        </div>
      </div>

      <div className="hidden lg:block">
        <SidebarProvider defaultValue={defaultOpen ? "true" : "false"}>
          <WorkspaceSessionSync />
          <DashboardSidebar />
          <SidebarInset className="h-svh overflow-hidden flex flex-col bg-white">
            <main className="flex-1 p-2 pl-0.5 min-h-0">
              <div className="rounded-lg w-full h-full overflow-hidden border border-t-0 flex flex-col bg-amber-100/20">
                <MainHeader />
                <RouteVisitTracker />
                <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
};

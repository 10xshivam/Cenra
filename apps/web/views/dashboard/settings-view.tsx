"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs";
import { ProfileTab } from "@/components/dashboard/settings/profile-tab";
import { WorkspaceTab } from "@/components/dashboard/settings/workspace-tab";
import { BillingTab } from "@/components/dashboard/settings/billing-tab";

export const SettingsView = () => {
  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 md:p-8 lg:p-12 pb-24 max-w-6xl mx-auto overflow-y-auto no-scrollbar">
      {/* Page header */}
      <div className="rounded-2xl w-full p-2 max-w-6xl h-fit bg-neutral-500/10 pb-6">
        <div className="flex flex-col gap-2 w-full h-full border border-neutral-300 rounded-xl p-5 bg-white/60">
          <span className="text-2xl font-semibold tracking-tight text-emerald-800">
            Settings
          </span>
          <span className="text-sm text-neutral-500 tracking-tight leading-relaxed">
            Manage your account information, workspace configuration, and
            subscription preferences. Update profile details, customize
            workspace settings, and review your billing and subscription plan.
          </span>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="h-11! w-full bg-white/60 border border-dashed border-neutral-300 rounded-xl p-1 gap-1 mb-2">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium tracking-tight data-[state=active]:bg-emerald-800 data-[state=active]:text-white data-[state=inactive]:text-neutral-500"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="workspace"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium tracking-tight data-[state=active]:bg-emerald-800 data-[state=active]:text-white data-[state=inactive]:text-neutral-500"
          >
            Workspace
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium tracking-tight data-[state=active]:bg-emerald-800 data-[state=active]:text-white data-[state=inactive]:text-neutral-500"
          >
            Plans & Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="workspace">
          <WorkspaceTab />
        </TabsContent>
        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

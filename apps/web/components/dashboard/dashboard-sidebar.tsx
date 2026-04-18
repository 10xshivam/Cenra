"use client";

import { SIDEBAR_ITEMS } from "@/constants/sidebar.constants";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { OfficeIcon2 } from "@workspace/ui/components/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

export const DashboardSidebar = () => {
  const { workspace } = useWorkspaceStore();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="floating" className="bg-white">
      <SidebarHeader className="group h-12 flex justify-center p-0 rounded-lg bg-neutral-500/10 hover:bg-neutral-500/10 border-b-4 border-neutral-500/15 hover:border-neutral-600/15 transition-colors duration-300 text-neutral-500 hover:text-emerald-700">
        <SidebarMenu className="m-0 p-0 flex h-full justify-center">
          <SidebarMenuItem className="h-full hover:bg-transparent cursor-default flex items-center justify-center gap-1.5 overflow-hidden px-4">
            <OfficeIcon2 className="shrink-0" />
            <span className="truncate font-bold tracking-tight group-data-[collapsible=icon]:hidden!">
              {workspace?.name || "Loading..."}
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pt-5">
          <SidebarMenu>
            {SIDEBAR_ITEMS.primary.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="-ml-1.5">Sources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_ITEMS.sources.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="-ml-1.5">Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_ITEMS.configuration.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="-ml-1.5">Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_ITEMS.insights.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t py-5">
        <SidebarMenu>
          {SIDEBAR_ITEMS.footer.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

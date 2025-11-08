"use client";

import { useWorkspace } from "@/hooks/useWorkspace";
import {
  BarsIcon,
  BookOpenIcon,
  InboxIcon,
  IntegrationIcon,
  OfficeIcon2,
  PluginsIcon,
  RocketIcon,
  SettingsIcon,
  Sparkles2Icon,
  SparklesIcon,
  SupportIcon,
  UsersIcon,
} from "@workspace/ui/components/icons";
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

// Primary navigation items (no label)
const primaryItems = [
  {
    title: "Get Started",
    url: "#",
    icon: RocketIcon,
  },
  {
    title: "Inbox",
    url: "#",
    icon: InboxIcon,
  },
];

// Insights section
const insightsItems = [
  {
    title: "Visitors",
    url: "#",
    icon: UsersIcon,
  },
  {
    title: "Analytics",
    url: "#",
    icon: BarsIcon,
  },
];

// Automation section
const automationItems = [
  {
    title: "AI Automations",
    url: "#",
    icon: SparklesIcon,
  },
  {
    title: "Knowledge Base",
    url: "#",
    icon: BookOpenIcon,
  },
];

// Configuration section
const configurationItems = [
  {
    title: "Widget Customization",
    url: "#",
    icon: Sparkles2Icon,
  },
  {
    title: "Integrations",
    url: "#",
    icon: IntegrationIcon,
  },
  {
    title: "Plugins",
    url: "#",
    icon: PluginsIcon,
  },
];

const footerItems = [
  {
    title: "Settings",
    url: "#",
    icon: SettingsIcon,
  },
  {
    title: "Help & Support",
    url: "#",
    icon: SupportIcon,
  },
];

export const DashboardSidebar = () => {
  const { data: workspace, isLoading: isWorkspaceLoading } = useWorkspace();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="h-12 rounded-lg bg-emerald-900/10 border border-b-4 border-emerald-900/15">
        <SidebarMenu>
          <SidebarMenuItem className="hover:bg-transparent cursor-default flex items-center justify-center pt-1 gap-1.5">
            <OfficeIcon2 />
            {isWorkspaceLoading ? (
              "Loading..."
            ) : (
              <span className="font-bold text-emerald-900/70 tracking-tight group-data-[collapsible=icon]:hidden!">
                {workspace?.name}
              </span>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pt-5">
          <SidebarMenu>
            {primaryItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Automation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {automationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configurationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {insightsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t py-5">
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

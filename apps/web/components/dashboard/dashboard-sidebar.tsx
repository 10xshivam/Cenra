"use client";

import { useSession } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";
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
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import {
  Inbox,
  Rocket,
  Users,
  BarChart3,
  Sparkles,
  BookOpen,
  Palette,
  Grid,
  Puzzle,
  Building,
  User,
} from "lucide-react";

// Primary navigation items (no label)
const primaryItems = [
  {
    title: "Get Started",
    url: "#",
    icon: Rocket,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
];

// Insights section
const insightsItems = [
  {
    title: "Visitors",
    url: "#",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "#",
    icon: BarChart3,
  },
];

// Automation section
const automationItems = [
  {
    title: "AI Automations",
    url: "#",
    icon: Sparkles,
  },
  {
    title: "Knowledge Base",
    url: "#",
    icon: BookOpen,
  },
];

// Configuration section
const configurationItems = [
  {
    title: "Widget Customization",
    url: "#",
    icon: Palette,
  },
  {
    title: "Integrations",
    url: "#",
    icon: Grid,
  },
  {
    title: "Plugins",
    url: "#",
    icon: Puzzle,
  },
];

export const DashboardSidebar = () => {
  const { data: workspace, isLoading: isWorkspaceLoading } = useWorkspace();
  const { data: user, isLoading: isUserLoading } = useSession(); 

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuButton>
            <Building />
            {isWorkspaceLoading ? (
              "Loading..."
            ) : (
              <span>{workspace?.name}</span>
            )}
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User />
              {isUserLoading ? ("Loading..." ) : (
                <span>{user?.lastName}</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

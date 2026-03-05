import {
  BarsIcon,
  FolderIcon,
  InboxIcon,
  IntegrationIcon,
  // PluginsIcon,
  RocketIcon,
  SettingsIcon,
  Sparkles2Icon,
  SupportIcon,
  // UsersIcon,
  WebIcon,
} from "@workspace/ui/components/icons";

export const SIDEBAR_ITEMS = {
  primary: [
    {
      title: "Get Started",
      url: "/get-started",
      icon: RocketIcon,
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: InboxIcon,
    },
  ],
  insights: [
    // {
    //   title: "Visitors",
    //   url: "#",
    //   icon: UsersIcon,
    // },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarsIcon,
    },
  ],
  sources: [
    {
      title: "Web Content",
      url: "/web-content",
      icon: WebIcon,
    },
    {
      title: "Data Importer",
      url: "/data-importer",
      icon: FolderIcon,
    },
  ],
  configuration: [
    {
      title: "Widget Customization",
      url: "/widget-customization",
      icon: Sparkles2Icon,
    },
    {
      title: "Integrations",
      url: "/integrations",
      icon: IntegrationIcon,
    },
    // {
    //   title: "Plugins",
    //   url: "#",
    //   icon: PluginsIcon,
    // },
  ],
  footer: [
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
    {
      title: "Help & Support",
      url: "/help",
      icon: SupportIcon,
    },
  ],
};

import {
  BarsIcon,
  BookOpenIcon,
  InboxIcon,
  IntegrationIcon,
  PluginsIcon,
  RocketIcon,
  SettingsIcon,
  Sparkles2Icon,
  SparklesIcon,
  SupportIcon,
  UsersIcon,
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
  ],
  automation: [
    {
      title: "AI Automations",
      url: "/automations",
      icon: SparklesIcon,
    },
    {
      title: "Knowledge Base",
      url: "/knowledge-sources",
      icon: BookOpenIcon,
    },
  ],
  configuration: [
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
  ],
  footer: [
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
  ],
};

export const getAllItems = () => Object.values(SIDEBAR_ITEMS).flat();
import {
  BarChart3,
  Bot,
  Globe,
  Inbox,
  MessageSquareText,
  Plug,
  ScanSearch,
  Sparkles,
  UserRoundSearch,
} from "lucide-react";

import {
  IconDatabase,
  IconMessageCircle,
  IconUser,
  IconArrowUpRight,
  IconChartPie,
  IconPlugConnected,
  IconMessageCircleFilled,
  IconUserFilled,
  IconCircleArrowUpRightFilled,
  IconChartPieFilled,
  IconBookFilled,
  IconStack2Filled,
} from "@tabler/icons-react";

export const landingFeatures = [
  {
    title: "Product-trained knowledge",
    description:
      "Train Cenra on your website, docs, and FAQs to deliver accurate, business-aligned responses.",
    icon: IconBookFilled,
  },
  {
    title: "Context-aware support",
    description:
      "Maintains conversation context across messages so users don’t have to repeat themselves.",
    icon: IconMessageCircleFilled,
  },
  {
    title: "Customer context",
    description:
      "Access customer details like email, device, location, and session data directly within conversations.",
    icon: IconUserFilled,
  },
  {
    title: "AI + human workflow",
    description:
      "Automatically resolve or escalate queries, with full control from a unified inbox.",
    icon: IconCircleArrowUpRightFilled,
  },
  {
    title: "Support analytics",
    description:
      "Track requests, resolutions, and escalations with real-time performance insights.",
    icon: IconChartPieFilled,
  },
  {
    title: "Flexible integrations",
    description:
      "Deploy across websites and apps with support for HTML, React, Next.js, and more.",
    icon: IconStack2Filled,
  },
] as const;

export const landingSteps = [
  {
    title: "Connect your knowledge",
    description:
      "Add website content, docs, FAQs, and files so Cenra can answer with business context instead of guesswork.",
    icon: Globe,
  },
  {
    title: "Customize the widget",
    description:
      "Set greetings, brand colors, suggestions, and behavior so the chat experience feels native to your product.",
    icon: Sparkles,
  },
  {
    title: "Install and go live",
    description:
      "Embed Cenra on your website, help center, or app and start assisting customers with memory-aware replies.",
    icon: Plug,
  },
] as const;


export const landingOperations = [
  {
    title: "Shared inbox",
    description:
      "Review conversations, manage escalations, and stay close to what customers are asking.",
    icon: Inbox,
  },
  {
    title: "Analytics and insights",
    description:
      "Track request volume, resolution progress, support demand, and queue health in one place.",
    icon: BarChart3,
  },
  {
    title: "Knowledge coverage",
    description:
      "See how much of your support content is active so you can improve answer quality over time.",
    icon: Bot,
  },
] as const;

export const landingIntegrations = [
  "React",
  "Next.js",
  "HTML",
  "Docs",
  "Help Center",
] as const;

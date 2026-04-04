import { BarChart3, Bot, Globe, Inbox, Plug, Sparkles } from "lucide-react";

import {
  IconAdjustmentsFilled,
  IconBookFilled,
  IconChartPieFilled,
  IconCircleArrowUpRightFilled,
  IconCodeCircleFilled,
  IconFileUploadFilled,
  IconMessageCircleFilled,
  IconMessageFilled,
  IconStack2Filled,
  IconUserFilled,
} from "@tabler/icons-react";

export const landingFeatures = [
  {
    title: "Product-trained knowledge",
    description:
      "Train Cenra on your website, docs, and FAQs to deliver accurate, context-aware, and business-aligned responses.",
    icon: IconBookFilled,
  },
  {
    title: "Context-aware support",
    description:
      "Maintains conversation context across messages and follow-ups so users don't have to repeat themselves.",
    icon: IconMessageCircleFilled,
  },
  {
    title: "Customer context",
    description:
      "Access customer details like email, device, location, and session data directly within conversations for better responses.",
    icon: IconUserFilled,
  },
  {
    title: "AI + human workflow",
    description:
      "Automatically resolve or escalate queries while giving your team full control from a unified inbox.",
    icon: IconCircleArrowUpRightFilled,
  },
  {
    title: "Support analytics",
    description:
      "Track requests, resolutions, escalations, and trends with real-time insights to improve support performance.",
    icon: IconChartPieFilled,
  },
  {
    title: "Flexible integrations",
    description:
      "Deploy across websites and apps with support for HTML, React, Next.js, and other modern platforms.",
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

export const landingSetupItems = [
  {
    title: "Add your website and documents",
    description:
      "Enter your website URL or upload docs, FAQs, and internal content so Cenra can learn your product and answer accurately.",
    icon: IconFileUploadFilled,
  },
  {
    title: "Customize your chat widget",
    description:
      "Personalize the chat experience with your brand colors, greeting message, and behavior to match your product.",
    icon: IconAdjustmentsFilled,
  },
  {
    title: "Install on your website",
    description:
      "Copy and paste a simple script into your website or app and start assisting customers instantly.",
    icon: IconCodeCircleFilled,
  },
  {
    title: "Start assisting customers",
    description:
      "Handle customer queries instantly with AI, resolve conversations, and step in when human support is needed.",
    icon: IconMessageFilled,
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

export const landingIntegrations = ["React", "Next.js", "HTML", "Docs", "Help Center"] as const;

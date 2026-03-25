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

export const landingFeatures = [
  {
    title: "Workspace-driven knowledge",
    description:
      "Each workspace keeps its own content, settings, and retrieval context so answers stay accurate and brand-specific.",
    icon: ScanSearch,
  },
  {
    title: "Conversation memory",
    description:
      "Cenra remembers prior threads and follow-ups, helping customers continue conversations without repeating themselves.",
    icon: MessageSquareText,
  },
  {
    title: "Smart identity capture",
    description:
      "Collect customer details only when needed so the experience stays smooth and support teams still get the right context.",
    icon: UserRoundSearch,
  },
  {
    title: "Human handoff when needed",
    description:
      "Move important conversations into the inbox so your team can step in with full context and keep momentum.",
    icon: Inbox,
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

import { Step } from "@/types/getSarted.types";

export const VISITED_ROUTES_STORAGE_KEY = "cenra:dashboard:visited-routes";

export const steps: Step[] = [
  {
    id: "knowledge-sources",
    title: "Add Your Knowledge Sources",
    description: "Import the content your AI agent should learn from.",
    points: [
      "Add your website URL to crawl important pages",
      "Upload FAQs, help guides, PDFs, and internal docs",
      "Keep your knowledge base updated anytime",
    ],
    requiredRoutes: ["/web-content", "/data-importer"],
    actions: [
      { label: "Add Website URL", href: "/web-content" },
      { label: "Upload Documents", href: "/data-importer" },
    ],
  },
  {
    id: "widget-customization",
    title: "Customize Your Chat Widget",
    description: "Make Cenra feel like your brand.",
    points: [
      "Set your greeting message",
      "Add default question suggestions",
      "Match colors and tone to your product",
      "Configure identity collection preferences",
    ],
    requiredRoutes: ["/widget-customization"],
    actions: [{ label: "Customize Widget", href: "/widget-customization" }],
  },
  {
    id: "install-cenra",
    title: "Install Cenra on Your Website",
    description: "Add the widget to your product or website in seconds.",
    points: [
      "Copy the installation script",
      "Paste it into your website's <head>",
      "Deploy",
    ],
    requiredRoutes: ["/integrations"],
    actions: [{ label: "View Install Steps", href: "/integrations" }],
  },
  {
    id: "conversations",
    title: "Start Receiving Customer Conversations",
    description:
      "Customers get instant AI-powered replies with escalation to human support when needed.",
    points: [
      "Answer questions through your widget",
      "Escalate to human support if needed",
      "Store and organize all conversations in your inbox",
    ],
    requiredRoutes: ["/inbox"],
    actions: [{ label: "Open Inbox", href: "/inbox" }],
  },
  {
    id: "insights",
    title: "Track Visitors & Analytics",
    description: "Understand how customers interact with your support.",
    points: [
      "View visitor details and session metadata",
      "Monitor unresolved, escalated, and resolved statuses",
      "Track engagement and optimize your knowledge base over time",
    ],
    requiredRoutes: ["/visitors", "/analytics"],
    actions: [
      { label: "Open Visitors", href: "/visitors" },
      { label: "Open Analytics", href: "/analytics" },
    ],
  },
];
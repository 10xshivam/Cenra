export const PLAN_META = {
    STARTER: {
        label: "Starter",
        price: "$9 / mo",
        color: "text-emerald-700",
        bg: "bg-white/80",
        border: "border-neutral-300",
    },
    PRO: {
        label: "Pro",
        price: "$29 / mo",
        color: "text-violet-700",
        bg: "bg-violet-50",
        border: "border-violet-200",
    },
} as const;

export const PLAN_FEATURES = {
    STARTER: [
        "1 Workspace",
        "Single Chat Widget",
        "1 Web Resource + 5 Documents",
        "Standard Analytics",
        "Up to 200 Monthly Customers",
    ],
    PRO: [
        "Up to 5 Workspaces",
        "Multiple Chat Widgets",
        "10 Web Resources + 15 Documents",
        "Advanced Analytics",
        "Up to 500 Monthly Customers",
        "Voice Assistant Support",
        "Multilingual Support",
    ],
} as const;

export type PlanKey = keyof typeof PLAN_META;

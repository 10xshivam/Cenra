import { AnalyticsView } from "@/views/dashboard/analytics-view";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Analytics - Cenra",
    description: "View your workspace analytics and insights.",
};

export default function AnalyticsPage() {
    return <AnalyticsView />;
}
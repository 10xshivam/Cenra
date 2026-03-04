"use client";

import { getAnalytics } from "@/lib/api/analytics";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AnalyticsData } from "@/types/analytics.types";

export const useAnalytics = (workspaceId: string, days: string): UseQueryResult<AnalyticsData> => {
    return useQuery({
        queryKey: ["analytics", workspaceId, days],
        queryFn: () => getAnalytics(workspaceId, days),
        enabled: !!workspaceId,
        retry: false,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

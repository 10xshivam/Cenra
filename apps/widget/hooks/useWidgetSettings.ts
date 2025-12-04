"use client"; 

import { getWidgetInitialization, getWorkspaceDetails } from "@/lib/api/widget";
import { useQuery } from "@tanstack/react-query";

export const useWidgetSettings = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceDetails(workspaceId), 
    retry: false,
    gcTime: 5 * 60 * 1000,
  });
};

export const useWidgetInitialization = (workspaceId: string, customerId: string,options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["widgetInitialization", workspaceId, customerId],
    queryFn: () => getWidgetInitialization(workspaceId, customerId),
    retry: false,
    gcTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}
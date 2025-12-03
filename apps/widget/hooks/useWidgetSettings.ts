"use client"; 

import { getWorkspaceDetails } from "@/lib/api/widget";
import { useQuery } from "@tanstack/react-query";

export const useWidgetSettings = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceDetails(workspaceId), 
    retry: false,
    gcTime: 5 * 60 * 1000,
  });
};
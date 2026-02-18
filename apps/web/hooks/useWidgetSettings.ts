"use client";

import {
  getWidgetSettings,
  WidgetSettings,
  updateWidgetSettings,
  WidgetSettingsPayload,
} from "@/lib/api/widget-settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWidgetSettings = (workspaceId?: string) =>
  useQuery<WidgetSettings>({
    queryKey: ["widget-settings", workspaceId],
    queryFn: () => getWidgetSettings(workspaceId!),
    enabled: Boolean(workspaceId),
  });

export const useUpdateWidgetSettings = (workspaceId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WidgetSettingsPayload) =>
      updateWidgetSettings(workspaceId!, payload),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<WidgetSettings | undefined>(
        ["widget-settings", workspaceId],
        (prev) =>
          prev
            ? {
                ...prev,
                ...variables,
                defaultSuggestions: prev.defaultSuggestions,
              }
            : undefined
      );
    },
  });
};

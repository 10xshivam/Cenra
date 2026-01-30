"use client";

import {
  getConversationMessages,
  getLastMessage,
  getWidgetInitialization,
  identifyWidgetCustomer,
  sendMessage,
  startWidgetConversation,
} from "@/lib/api/widget";
import { WidgetInitResponse } from "@/types/widget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWidgetInitialization = (
  workspaceId: string,
  customerId?: string
) =>
  useQuery<WidgetInitResponse>({
    queryKey: ["widget-init", workspaceId, customerId ?? null],
    queryFn: () => getWidgetInitialization(workspaceId, customerId ?? ""),
    enabled: !!workspaceId,
    retry: 0,
  });

export const useStartConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      firstMessage,
    }: {
      workspaceId: string;
      firstMessage: string;
    }) => startWidgetConversation(workspaceId, firstMessage),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["last-message"] });
    },
  });
};

export const useIdentifyCustomer = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      customerInfo,
    }: {
      workspaceId: string;
      customerInfo: {
        customerId: string;
        name?: string;
        email?: string;
        conversationId: string;
        metadata?: Record<string, any>;
      };
    }) => identifyWidgetCustomer(workspaceId, customerInfo),
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      conversationId,
      message,
    }: {
      workspaceId: string;
      conversationId: string;
      message: string;
    }) => sendMessage(workspaceId, conversationId, message),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["last-message"] });
    },
  });
};

export const useConversationMessages = (
  workspaceId: string,
  conversationId: string
) =>
  useQuery({
    queryKey: ["conversationMessages", conversationId],
    queryFn: () => getConversationMessages(workspaceId, conversationId),
    enabled: !!workspaceId && !!conversationId,
    // staleTime:Infinity,
    // gcTime:Infinity,
    refetchInterval: (query) => {
      return query.state.data?.status === "escalated" ? 10000 : false;
    },
  });

export const useLastMessage = (workspaceId: string, conversationId: string) =>
  useQuery({
    queryKey: ["last-message", workspaceId, conversationId],
    queryFn: () => getLastMessage(workspaceId, conversationId),
    enabled: !!workspaceId && !!conversationId,
  });

"use client";

import {
  getConversationMessages,
  getLastMessage,
  getWidgetInitialization,
  identifyWidgetCustomer,
  sendMessage,
  startWidgetConversation,
} from "@/lib/api/widget";
import { QueryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWidgetInitialization = (
  workspaceId: string,
  customerId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["widgetInitialization", workspaceId, customerId],
    queryFn: () => getWidgetInitialization(workspaceId, customerId),
    retry: false,
    gcTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};

// export const useWidgetInitialization = (
//   workspaceId: string,
//   customerId?: string,
//   options?: QueryOptions
// ) =>
//   useQuery({
//     queryKey: ["widget-init", workspaceId, customerId ?? null],
//     queryFn: () => getWidgetInitialization(workspaceId, customerId),
//     enabled: !!workspaceId,
//     retry: 0,
//     ...options,
//   });

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
      queryClient.invalidateQueries({ queryKey: ["conversation-messages"] });
      queryClient.invalidateQueries({ queryKey: ["last-message"] });
    },
  });
};

export const useConversationMessages = (
  workspaceId: string,
  conversationId: string
) =>
  useQuery({
    queryKey: ["conversation-messages", workspaceId, conversationId],
    queryFn: () => getConversationMessages(workspaceId, conversationId),
    enabled: !!workspaceId && !!conversationId,
    refetchInterval: 2000,
  });

export const useLastMessage = (workspaceId: string, conversationId: string) =>
  useQuery({
    queryKey: ["last-message", workspaceId, conversationId],
    queryFn: () => getLastMessage(workspaceId, conversationId),
    enabled: !!workspaceId && !!conversationId,
    refetchInterval: 2000,
  });

import { WidgetInitResponse } from "@/types/widget";
import { axiosInstance } from "../axios";

export const getWidgetInitialization = async (
  workspaceId: string,
  customerId?: string
): Promise<WidgetInitResponse> => {
  const url = customerId
    ? `/widget/init/${workspaceId}?customerId=${customerId}`
    : `/widget/init/${workspaceId}`;
  const { data } = await axiosInstance.get(url);
  return data;
};

export const startWidgetConversation = async (workspaceId: string, firstMessage: string) => {
  const url = `workspace/${workspaceId}/conversations/start`;
  const { data } = await axiosInstance.post(url, { firstMessage });
  return data;
};

export const identifyWidgetCustomer = async (
  workspaceId: string,
  customerInfo: { customerId: string; name?: string; email?: string,conversationId: string }
) => {
  const url = `widget/${workspaceId}/identify`;
  const { data } = await axiosInstance.post(url, customerInfo);
  return data;
};

export const sendMessage = async (
  workspaceId: string,
  conversationId: string,
  message: string
) => {
  const url = `workspace/${workspaceId}/conversations/${conversationId}/messages/create`;
  const { data } = await axiosInstance.post(url, { message });
  return data;
};

export const getConversationMessages = async (
  workspaceId: string,
  conversationId: string
) => {
  const url = `workspace/${workspaceId}/conversations/${conversationId}/messages`;
  const { data } = await axiosInstance.get(url);
  return data;
};

export const getLastMessage = async (
  workspaceId: string,
  conversationId: string
) => {
  const url = `workspace/${workspaceId}/conversations/${conversationId}/messages/last`;
  const { data } = await axiosInstance.get(url);
  return data;
};
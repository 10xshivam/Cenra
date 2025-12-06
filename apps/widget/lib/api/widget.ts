import { axiosInstance } from "../axios";

export const getWidgetInitialization = async (
  workspaceId: string,
  customerId: string
) => {
  const url = customerId
    ? `/widget/init/${workspaceId}?customerId=${customerId}`
    : `/widget/init/${workspaceId}`;
  const { data } = await axiosInstance.get(url);
  console.log("Widget Initialization Data:", data);
  return data;
};

export const startWidgetConversation = async (workspaceId: string, firstMessage: string) => {
  const url = `workspace/${workspaceId}/conversations/start`;
  const { data } = await axiosInstance.post(url, { firstMessage });
  console.log("Start Widget Conversation Data:", data);
  return data;
};

export const identifyWidgetCustomer = async (
  workspaceId: string,
  customerInfo: { customerId: string; name?: string; email?: string,conversationId: string }
) => {
  const url = `widget/${workspaceId}/identify`;
  const { data } = await axiosInstance.post(url, customerInfo);
  console.log("Identify Widget Customer Data:", data);
  return data;
};

export const sendMessage = async (
  workspaceId: string,
  conversationId: string,
  message: string
) => {
  const url = `workspace/${workspaceId}/conversations/${conversationId}/messages/create`;
  const { data } = await axiosInstance.post(url, { message });
  console.log("Send Message Data:", data);
  return data;
};

export const getConversationMessages = async (
  workspaceId: string,
  conversationId: string
) => {
  const url = `workspace/${workspaceId}/conversations/${conversationId}/messages`;
  const { data } = await axiosInstance.get(url);
  console.log("Get Conversation Messages Data:", data);
  return data;
};
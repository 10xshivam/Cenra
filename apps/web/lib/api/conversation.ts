import { axiosInstance } from "../axios";

export const getAllConversations = async (
  workspaceId: string,
  status: string
) => {
  const statusQuery = status === "all" ? "" : `?status=${status}`;
  const { data } = await axiosInstance.get(
    `workspace/${workspaceId}/conversations${statusQuery}`
  );
  console.log("Fetched Conversations:", data);
  return data;
};

export const getConversationStatus = async (conversationId: string) => {
  const { data } = await axiosInstance.get(
    `workspace/conversations/${conversationId}/status`
  );
  console.log("Fetched Conversation Status:", data);
  return data;
};

export const updateConversationStatus = async (
  conversationId: string,
  status: string
) => {
  const { data } = await axiosInstance.put(
    `workspace/conversations/${conversationId}/status`,
    { status }
  );
  return data;
};

export const deleteConversation = async (conversationId: string) => {
  const { data } = await axiosInstance.delete(
    `workspace/conversations/${conversationId}`
  );
  return data;
};

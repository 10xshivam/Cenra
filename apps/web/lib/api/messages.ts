import { axiosInstance } from "../axios";

export const getConversationMessages = async (
  workspaceid: string,
  conversationId: string
) => {
  const { data } = await axiosInstance.get(
    `/workspace/${workspaceid}/conversations/${conversationId}/messages/all`
  );
  return data;
};

export const createMessage = async (
  workspaceid: string,
  conversationId: string,
  message: string
) => {
  const { data } = await axiosInstance.post(
    `/workspace/${workspaceid}/conversations/${conversationId}/messages/create-human`,
    {
      message,
    }
  );
  return data;
};

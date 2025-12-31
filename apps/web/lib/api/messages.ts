import { axiosInstance } from "../axios"

export const getConversationMessages = async (workspaceid: string, conversationId: string) => {
    const { data } = await axiosInstance.get(`/workspace/${workspaceid}/conversations/${conversationId}/messages/all`);
    return data;
}
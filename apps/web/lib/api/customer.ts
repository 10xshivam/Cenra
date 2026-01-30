import { axiosInstance } from "../axios";

export const getCustomerInfo = async (
  workspaceId: string,
  conversationId: string
) => {
  const { data } = await axiosInstance.get(
    `workspace/${workspaceId}/customers/${conversationId}`
  );
  console.log("API Customer Info Data:", data);
  return data;
};

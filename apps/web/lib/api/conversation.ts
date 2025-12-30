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

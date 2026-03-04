import { axiosInstance } from "../axios";

export const getAnalytics = async (workspaceId: string, days: string) => {
  const { data } = await axiosInstance.get(
    `workspace/${workspaceId}/analytics?days=${days}`,
  );
  return data;
};

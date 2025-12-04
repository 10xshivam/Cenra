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

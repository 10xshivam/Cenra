import { axiosInstance } from "../axios";

export const getWorkspaceDetails = async (workspaceId: string) => {
  const { data } = await axiosInstance.get(`/${workspaceId}/widget-setting`);
  console.log("Workspace Details:", data);
  return data.widgetSettings;
};

export const getWidgetInitialization = async (
  workspaceId: string,
  customerId: string
) => {
     console.log(">>> getWidgetInitialization called with:", { workspaceId, customerId });
  const url = customerId
    ? `/widget/init/${workspaceId}?customerId=${customerId}`
    : `/widget/init/${workspaceId}`;
  const { data } = await axiosInstance.get(url);
  console.log("Widget Initialization Data:", data);
  return data;
};

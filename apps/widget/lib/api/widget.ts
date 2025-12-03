import { axiosInstance } from "../axios";

export const getWorkspaceDetails = async (workspaceId: string) => {
    const {data} = await axiosInstance.get(`/${workspaceId}/widget-setting`);
    console.log("Workspace Details:", data);
    return data.widgetSettings;
}
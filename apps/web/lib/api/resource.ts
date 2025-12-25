import { axiosInstance } from "../axios";

export type Resource = {
  file: File;
  workspaceId: string;
};

export const getAllResources = async (workspaceId: string) => {
  const { data } = await axiosInstance.get(
    `workspace/${workspaceId}/resources`
  );
  return data.resources;
}

export const createResource = async ({ file, workspaceId }: Resource) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post(
    `workspace/${workspaceId}/resources/file`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log("Created resource:", data);
  return data.resource;
};

export const toggleResource = async (
  workspaceId: string,
  resourceId: string,
  active: boolean
) => {
  const { data } = await axiosInstance.patch(
    `workspace/${workspaceId}/resources/${resourceId}/toggle`,
    { active }
  );
  return data;
};

export const deleteResource = async (
  workspaceId: string,
  resourceId: string
) => {
  const { data } = await axiosInstance.delete(
    `workspace/${workspaceId}/resources/${resourceId}`
  );
  return data;
};
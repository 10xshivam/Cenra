import { axiosInstance } from "../axios";

export type Resource = {
  file: File;
  workspaceId: string;
};

export const getAllResources = async (workspaceId: string, sourceType: string) => {
  const { data } = await axiosInstance.get(
    `workspace/${workspaceId}/resources?sourceType=${sourceType}`
  );
  return data.resources;
}

export const createFileResource = async ({ file, workspaceId }: Resource) => {
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
  return data.resource;
};

export const createWebResource = async ({ url, paths, workspaceId }: { url: string; paths?: string[]; workspaceId: string }) => {
  const { data } = await axiosInstance.post(
    `workspace/${workspaceId}/resources/web`,
    { url, paths }
  );
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

export const recrawlWebResource = async (
  workspaceId: string,
  resourceId: string
) => {
  const { data } = await axiosInstance.post(
    `workspace/${workspaceId}/resources/${resourceId}/recrawl`
  );
  return data;
}
import { axiosInstance } from "../axios";

export type Resource = {
  file: File;
  workspaceId: string;
};

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

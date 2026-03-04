import { createWorkspaceSchema } from "@/schemas/createWorkspaceSchema";
import { axiosInstance } from "../axios";
import z from "zod";

export const createWorkspace = async (payload: z.infer<typeof createWorkspaceSchema>) => {
  const { data } = await axiosInstance.post('/workspace/create', payload);
  return data.workspace;
};

export const fetchWorkspace = async () => {
  const { data } = await axiosInstance.get('/workspace/get');
  return data.workspace;
};

export const updateWorkspace = async (payload: { name: string; website?: string }) => {
  const { data } = await axiosInstance.patch('/workspace/update', payload);
  return data.workspace;
};

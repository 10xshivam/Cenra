"use client";

import { createWorkspace, fetchWorkspace, updateWorkspace } from "@/lib/api/workspace";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useWorkspace = () => {
  return useQuery({
    queryKey: ["workspace"],
    queryFn: fetchWorkspace,
    retry: false,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace);

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: (workspace) => {
      setWorkspace({
        id: workspace.id,
        name: workspace.name,
        website: workspace.website,
      });
      queryClient.setQueryData(["workspace"], workspace);
      router.push("/get-started");
    },
    onError: (error) => {
      toast.error(
        `Workspace creation error: ${error instanceof Error ? error.message : String(error)
        }`,
      );
    },
  });
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace);

  return useMutation({
    mutationFn: updateWorkspace,
    onSuccess: (workspace) => {
      if (workspace) {
        setWorkspace({ id: workspace.id, name: workspace.name, website: workspace.website });
        queryClient.setQueryData(["workspace"], workspace);
      }
    },
    onError: (error) => {
      toast.error(`Failed to update workspace: ${error instanceof Error ? error.message : String(error)}`);
    },
  });
};

import { createResource, deleteResource, getAllResources, Resource, toggleResource } from "@/lib/api/resource";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ToggleResourceVariables {
  active: boolean;
  workspaceId: string;
  resourceId: string;
}

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: Resource) => createResource(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: (error) => {
      toast.error(
        `Resource creation error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    },
  });
};

export const useToggleResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ active, workspaceId, resourceId }: ToggleResourceVariables) => toggleResource(workspaceId, resourceId, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: (error) => {
      toast.error(
        `Resource toggle error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, resourceId }: { workspaceId: string; resourceId: string }) => deleteResource(workspaceId, resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: (error) => {
      toast.error(
        `Resource delete error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    },
  });
};

export const useGetAllResources = (workspaceId: string) => {
  return useQuery({
    queryKey: ["resources"],
    queryFn: () => getAllResources(workspaceId),
    retry: false,
    gcTime: 5 * 60 * 1000,
    enabled: !!workspaceId 
  });
};
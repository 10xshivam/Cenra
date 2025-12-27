import { createFileResource, createWebResource, deleteResource, getAllResources, recrawlWebResource, Resource, toggleResource } from "@/lib/api/resource";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ToggleResourceVariables {
  active: boolean;
  workspaceId: string;
  resourceId: string;
}

interface CreateWebResourceVariables {
  url: string;
  paths?: string[];
  workspaceId: string;
}

interface CommonResourceVariables {
  resourceId: string;
  workspaceId: string;
}

export const useCreateFileResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: Resource) => createFileResource(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: (error) => {
      toast.error(
        `File resource creation error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    },
  });
};

export const useCreateWebResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ url, paths, workspaceId }: CreateWebResourceVariables) =>
      createWebResource({ url, paths, workspaceId }),
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    }
  ,    onError: (error) => {
      toast.error(
        `Web resource creation error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
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
    mutationFn: ({ workspaceId, resourceId }: CommonResourceVariables) => deleteResource(workspaceId, resourceId),
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

export const useRecrawlWebResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, resourceId }: CommonResourceVariables) => recrawlWebResource(workspaceId, resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: (error) => {
      toast.error(
        `Web resource recrawl error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    },
  });
}

export const useGetAllResources = (workspaceId: string, sourceType: string) => {
  return useQuery({
    queryKey: ["resources", workspaceId, sourceType],
    queryFn: () => getAllResources(workspaceId, sourceType),
    retry: false,
    gcTime: 5 * 60 * 1000,
    enabled: !!workspaceId 
  });
};
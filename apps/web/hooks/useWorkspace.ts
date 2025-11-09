import { createWorkspace, fetchWorkspace } from "@/lib/api/workspace";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTransitionRouter } from "next-view-transitions";
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
  const router = useTransitionRouter();
  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: (workspace) => {
      queryClient.setQueryData(["workspace"], workspace);
      router.push("/get-started");
    },
    onError: (error) => {
        toast.error(`Workspace creation error: ${error instanceof Error ? error.message : String(error)}`);
    },
  });
};

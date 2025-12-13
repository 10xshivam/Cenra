import { createResource, Resource } from "@/lib/api/resource";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

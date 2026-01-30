import { createMessage, getConversationMessages } from "@/lib/api/messages";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetAllMessages = (
  workspaceId: string,
  conversationId: string
) => {
  return useQuery({
    queryKey: ["messages", workspaceId, conversationId],
    queryFn: () => getConversationMessages(workspaceId, conversationId),
    enabled: !!workspaceId && !!conversationId,
    retry: false,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      conversationId,
      message,
    }: {
      workspaceId: string;
      conversationId: string;
      message: string;
    }) => createMessage(workspaceId, conversationId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error) => {
      toast.error(
        `Error sending message: ${error instanceof Error ? error.message : String(error)}`
      );
    },
  });
};

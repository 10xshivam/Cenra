import { getAllConversations } from "@/lib/api/conversation";
import { useQuery } from "@tanstack/react-query";

export const useGetConversations = (workspaceId: string, status: string) => {
  return useQuery({
    queryKey: ["conversations", workspaceId, status],
    queryFn: () => getAllConversations(workspaceId, status),
    enabled: !!workspaceId,
    retry: false,
    gcTime: 5 * 60 * 1000,
  });
}
import { getConversationMessages } from "@/lib/api/messages"
import { useQuery } from "@tanstack/react-query"

export const useGetAllMessages = (workspaceId: string, conversationId: string) => {
    return useQuery({
        queryKey: ["messages", workspaceId, conversationId],
        queryFn: () => getConversationMessages(workspaceId, conversationId),
        enabled: !!workspaceId && !!conversationId,
        retry: false,
        gcTime: 5 * 60 * 1000,
    })
}

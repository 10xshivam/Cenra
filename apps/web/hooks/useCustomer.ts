import { getCustomerInfo } from "@/lib/api/customer";
import { useQuery } from "@tanstack/react-query";

export const useCustomerInfo = (
  workspaceId: string,
  conversationId: string
) => {
  return useQuery({
    queryKey: ["customerInfo", workspaceId, conversationId],
    queryFn: () => getCustomerInfo(workspaceId, conversationId),
    enabled: !!workspaceId && !!conversationId,
    retry: false,
    gcTime: 5 * 60 * 1000,
  });
};

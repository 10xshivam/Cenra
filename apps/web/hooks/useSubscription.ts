import { getSubscriptionDetails } from "@/lib/api/subscription"
import { useQuery } from "@tanstack/react-query"

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: getSubscriptionDetails,
    retry: false,
    gcTime: 5 * 60 * 1000,
  })
}


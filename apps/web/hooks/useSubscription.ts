import { createCheckoutSession, getSubscriptionDetails } from "@/lib/api/subscription";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: getSubscriptionDetails,
    retry: false,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: createCheckoutSession,
    onError: (error) => {
      toast.error(
        `Failed to start checkout: ${error instanceof Error ? error.message : String(error)}`
      );
    },
  });
};


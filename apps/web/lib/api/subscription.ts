import { axiosInstance } from "../axios";

export const getSubscriptionDetails = async () => {
    const response = await axiosInstance.get("/subscription/details");
    return response.data;
};

export const createCheckoutSession = async ({
  plan,
  userId,
}: {
  plan: "STARTER" | "PRO";
  userId: string;
}) => {
  const response = await axiosInstance.post("/subscription/billing/create-checkout", {
    plan,
    userId,
  });
  return response.data as { checkoutUrl?: string };
};

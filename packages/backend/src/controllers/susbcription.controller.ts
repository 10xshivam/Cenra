import { Request, Response } from "express";
import { setSubscriptionCookie } from "../utils/auth/setSubscriptionCookie";
import { prisma } from "@workspace/db";

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { plan, userId } = req.body;

    const productId =
      plan === "STARTER"
        ? process.env.DODO_STARTER_PRODUCT_ID
        : process.env.DODO_PRO_PRODUCT_ID;
    const base =
      process.env.DODO_ENVIRONMENT === "live_mode"
        ? "https://live.dodopayments.com"
        : "https://test.dodopayments.com";

    const response = await fetch(`${base}/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DODO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_cart: [
          {
            product_id: productId,
            quantity: 1,
          },
        ],
        return_url: `${process.env.APP_URL}/billing/success`,
        cancel_url: `${process.env.APP_URL}/billing/cancel`,
        feature_flags: {
          redirect_immediately: true,
        },
        metadata: {
          userId,
          plan,
        },
      }),
    });

    const session = await response.json();

    return res.json({
      checkoutUrl: session.checkout_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
};

export const syncSubscription = async (req: Request, res: Response) => {
  const userId = req.userId!;
  await setSubscriptionCookie(userId, res);
  return res.status(200).json({ success: true });
};

export const getSuscriptionDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const subscription =  await prisma.subscription.findFirst({
      where: {
        userId,
      },
    });
  
    return res.status(200).json(subscription);
  } catch (error) {
    console.error("Failed to get subscription details", error);
    return res.status(500).json({ error: "Failed to get subscription details" });
  }
}

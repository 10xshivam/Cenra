import { prisma } from "@workspace/db";
import { Response } from "express";
import { getAuthCookieOptions } from "./cookieOptions";

export const setSubscriptionCookie = async (
  userId: string,
  res: Response
) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        endsAt: {
          gt: new Date(),
        },
      },
    });

    const hasSubscription = !!subscription;

    res.cookie("hasSubscription", String(hasSubscription), {
      ...getAuthCookieOptions(),
    });

    return hasSubscription;
  } catch (error) {
    console.error("Error setting subscription cookie:", error);
    return false;
  }
};

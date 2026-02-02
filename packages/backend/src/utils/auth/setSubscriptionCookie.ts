import { prisma } from "@workspace/db";
import { Response } from "express";

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
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return hasSubscription;
  } catch (error) {
    console.error("Error setting subscription cookie:", error);
    return false;
  }
};

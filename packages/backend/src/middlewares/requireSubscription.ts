import { prisma } from "@workspace/db";
import { NextFunction, Request, Response } from "express";

interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: string;
  startedAt: Date;
  endsAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      subscription?: Subscription;
    }
  }
}

export const requireActiveSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        endsAt: { gt: new Date() },
      },
    });

    if (!subscription) {
      return res.status(403).json({
        message: "Active subscription required",
        code: "NO_SUBSCRIPTION",
      });
    }

    req.subscription = subscription;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Subscription check failed" });
  }
};

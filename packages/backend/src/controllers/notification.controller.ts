import { Request, Response } from "express";
import { prisma } from "@workspace/db";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const workspace = req.workspace!;
    const parsedLimit = Number(req.query.limit);
    const limit =
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const notifications = await prisma.notification.findMany({
      where: {
        workspaceId: workspace.id,
      },
      include: {
        conversation: {
          include: {
            customer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return res.status(200).json({
      notifications: notifications.map((notification: (typeof notifications)[number]) => ({
        id: notification.id,
        conversationId: notification.conversationId,
        type: notification.type,
        title: notification.title,
        description: notification.description,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        customer: {
          name: notification.conversation.customer?.name ?? null,
          email: notification.conversation.customer?.email ?? null,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUnreadNotificationsCount = async (
  req: Request,
  res: Response,
) => {
  try {
    const workspace = req.workspace!;

    const count = await prisma.notification.count({
      where: {
        workspaceId: workspace.id,
        isRead: false,
      },
    });

    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching unread notifications count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const workspace = req.workspace!;
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({ message: "Notification ID is required" });
    }

    const updatedNotification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        workspaceId: workspace.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    if (updatedNotification.count === 0) {
      const existingNotification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          workspaceId: workspace.id,
        },
      });

      if (!existingNotification) {
        return res.status(404).json({ message: "Notification not found" });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

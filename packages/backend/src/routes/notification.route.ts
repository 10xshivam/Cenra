import { Router } from "express";
import {
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationRead,
} from "../controllers/notification.controller";
import { requireWorkspaceAccess } from "../middlewares/requireWorkspace";
import { verifyAuth } from "../middlewares/auth.middleware";

const route: Router = Router();

route.get(
  "/:workspaceId/notifications",
  verifyAuth,
  requireWorkspaceAccess,
  getNotifications,
);
route.get(
  "/:workspaceId/notifications/unread-count",
  verifyAuth,
  requireWorkspaceAccess,
  getUnreadNotificationsCount,
);
route.patch(
  "/:workspaceId/notifications/:notificationId/read",
  verifyAuth,
  requireWorkspaceAccess,
  markNotificationRead,
);

export default route;

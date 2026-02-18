import { Router } from "express";
import {
  createConversation,
  deleteConversation,
  getConversations,
  getConversationStatus,
  startConversation,
  updateConversationStatus,
} from "../controllers/conversation.controller";
import {
  requireWorkspaceAccess,
  requireWorkspacePublic,
} from "../middlewares/requireWorkspace";
import { verifyAuth } from "../middlewares/auth.middleware";

const route: Router = Router();

// Widget-facing endpoint
route.post(
  "/:workspaceId/conversations/start",
  requireWorkspacePublic,
  startConversation
);

// Dashboard/admin endpoints
route.post(
  "/:workspaceId/conversations/create",
  verifyAuth,
  requireWorkspaceAccess,
  createConversation
);
route.get(
  "/:workspaceId/conversations",
  verifyAuth,
  requireWorkspaceAccess,
  getConversations
);
route.get("/conversations/:conversationId/status", verifyAuth, getConversationStatus);
route.put("/conversations/:conversationId/status", verifyAuth, updateConversationStatus);
route.delete("/conversations/:conversationId", verifyAuth, deleteConversation);

export default route;

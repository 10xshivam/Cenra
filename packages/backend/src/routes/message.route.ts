import { Router } from "express";
import {
  createMessage,
  getAllMessages,
  getConversationMessagesWithIdentityCheck,
  getLastMessage,
  sendHumanReply,
} from "../controllers/message.controller";
import {
  requireWorkspaceAccess,
  requireWorkspacePublic,
} from "../middlewares/requireWorkspace";
import { verifyAuth } from "../middlewares/auth.middleware";

const route: Router = Router();

// Widget-facing endpoints
route.post(
  "/:workspaceId/conversations/:conversationId/messages/create",
  requireWorkspacePublic,
  createMessage
);
route.get(
  "/:workspaceId/conversations/:conversationId/messages",
  requireWorkspacePublic,
  getConversationMessagesWithIdentityCheck
);
route.get(
  "/:workspaceId/conversations/:conversationId/messages/last",
  requireWorkspacePublic,
  getLastMessage
);

// Dashboard/admin endpoints
route.get(
  "/:workspaceId/conversations/:conversationId/messages/all",
  verifyAuth,
  requireWorkspaceAccess,
  getAllMessages
);
route.post(
  "/:workspaceId/conversations/:conversationId/messages/create-human",
  verifyAuth,
  requireWorkspaceAccess,
  sendHumanReply
);

export default route;

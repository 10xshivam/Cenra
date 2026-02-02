import { Router } from "express";
import { createConversation, deleteConversation, getConversations, getConversationStatus, startConversation, updateConversationStatus } from "../controllers/conversation.controller";
import { requireWorkspaceAccess } from "../middlewares/requireWorkspace";

const route: Router = Router();

route.post("/:workspaceId/conversations/create", requireWorkspaceAccess, createConversation);
route.post("/:workspaceId/conversations/start", requireWorkspaceAccess, startConversation);
route.get("/:workspaceId/conversations", requireWorkspaceAccess, getConversations);
route.get("/conversations/:conversationId/status", getConversationStatus);
route.put("/conversations/:conversationId/status", updateConversationStatus); 
route.delete("/conversations/:conversationId", deleteConversation);

export default route;

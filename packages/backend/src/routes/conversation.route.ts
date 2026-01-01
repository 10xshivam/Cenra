import { Router } from "express";
import { createConversation, deleteConversation, getConversations, getConversationStatus, startConversation, updateConversationStatus } from "../controllers/conversation.controller";

const route: Router = Router();

route.post("/:workspaceId/conversations/create", createConversation);
route.post("/:workspaceId/conversations/start", startConversation);
route.get("/:workspaceId/conversations", getConversations);
route.get("/conversations/:conversationId/status", getConversationStatus);
route.put("/conversations/:conversationId/status", updateConversationStatus); 
route.delete("/conversations/:conversationId", deleteConversation);

export default route;

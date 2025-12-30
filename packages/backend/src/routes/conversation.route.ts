import { Router } from "express";
import { createConversation, getConversations, startConversation } from "../controllers/conversation.controller";

const route: Router = Router();

route.post("/:workspaceId/conversations/create", createConversation);
route.post("/:workspaceId/conversations/start", startConversation);
route.get("/:workspaceId/conversations", getConversations);

export default route;
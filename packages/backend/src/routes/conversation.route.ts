import { Router } from "express";
import { createConversation, startConversation } from "../controllers/conversation.controller";

const route: Router = Router();

route.post("/:workspaceId/conversations/create", createConversation);
route.post("/:workspaceId/conversations/start", startConversation);

export default route;
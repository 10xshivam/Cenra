import { Router } from "express";
import { createConversation } from "../controllers/conversation.controller";

const route: Router = Router();

route.post("/:workspaceId/conversations/create", createConversation);

export default route;
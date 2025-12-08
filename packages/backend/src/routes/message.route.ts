import { Router } from "express";
import { createMessage, getConversationMessages, getLastMessage } from "../controllers/message.controller";

const route: Router = Router();

route.post('/:workspaceId/conversations/:conversationId/messages/create', createMessage);
route.get('/:workspaceId/conversations/:conversationId/messages', getConversationMessages);
route.get('/:workspaceId/conversations/:conversationId/messages/last', getLastMessage);

export default route;
import { Router } from "express";
import { createMessage, getAllMessages, getConversationMessagesWithIdentityCheck, getLastMessage } from "../controllers/message.controller";

const route: Router = Router();

route.post('/:workspaceId/conversations/:conversationId/messages/create', createMessage);
route.get('/:workspaceId/conversations/:conversationId/messages', getConversationMessagesWithIdentityCheck);
route.get('/:workspaceId/conversations/:conversationId/messages/last', getLastMessage);
route.get('/:workspaceId/conversations/:conversationId/messages/all', getAllMessages);

export default route;
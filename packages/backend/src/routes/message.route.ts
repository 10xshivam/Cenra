import { Router } from "express";
import { createMessage, getAllMessages, getConversationMessagesWithIdentityCheck, getLastMessage, sendHumanReply } from "../controllers/message.controller";
import { requireWorkspaceAccess } from "../middlewares/requireWorkspace";
import { verifyAuth } from "../middlewares/auth.middleware";
import { requireActiveSubscription } from "../middlewares/requireSubscription";

const route: Router = Router();

route.use('/:workspaceId/conversations', requireWorkspaceAccess);

route.post('/:workspaceId/conversations/:conversationId/messages/create', createMessage);
route.get('/:workspaceId/conversations/:conversationId/messages', getConversationMessagesWithIdentityCheck);
route.get('/:workspaceId/conversations/:conversationId/messages/last', getLastMessage);
route.get('/:workspaceId/conversations/:conversationId/messages/all', getAllMessages);
route.post('/:workspaceId/conversations/:conversationId/messages/create-human',sendHumanReply);

export default route;
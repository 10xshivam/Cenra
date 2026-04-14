"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversation_controller_1 = require("../controllers/conversation.controller");
const requireWorkspace_1 = require("../middlewares/requireWorkspace");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const route = (0, express_1.Router)();
// Widget-facing endpoint
route.post("/:workspaceId/conversations/start", requireWorkspace_1.requireWorkspacePublic, conversation_controller_1.startConversation);
// Dashboard/admin endpoints
route.post("/:workspaceId/conversations/create", auth_middleware_1.verifyAuth, requireWorkspace_1.requireWorkspaceAccess, conversation_controller_1.createConversation);
route.get("/:workspaceId/conversations", auth_middleware_1.verifyAuth, requireWorkspace_1.requireWorkspaceAccess, conversation_controller_1.getConversations);
route.get("/conversations/:conversationId/status", auth_middleware_1.verifyAuth, conversation_controller_1.getConversationStatus);
route.put("/conversations/:conversationId/status", auth_middleware_1.verifyAuth, conversation_controller_1.updateConversationStatus);
route.delete("/conversations/:conversationId", auth_middleware_1.verifyAuth, conversation_controller_1.deleteConversation);
exports.default = route;

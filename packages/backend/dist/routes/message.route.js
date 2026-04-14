"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("../controllers/message.controller");
const requireWorkspace_1 = require("../middlewares/requireWorkspace");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const route = (0, express_1.Router)();
// Widget-facing endpoints
route.post("/:workspaceId/conversations/:conversationId/messages/create", requireWorkspace_1.requireWorkspacePublic, message_controller_1.createMessage);
route.get("/:workspaceId/conversations/:conversationId/messages", requireWorkspace_1.requireWorkspacePublic, message_controller_1.getConversationMessagesWithIdentityCheck);
route.get("/:workspaceId/conversations/:conversationId/messages/last", requireWorkspace_1.requireWorkspacePublic, message_controller_1.getLastMessage);
// Dashboard/admin endpoints
route.get("/:workspaceId/conversations/:conversationId/messages/all", auth_middleware_1.verifyAuth, requireWorkspace_1.requireWorkspaceAccess, message_controller_1.getAllMessages);
route.post("/:workspaceId/conversations/:conversationId/messages/create-human", auth_middleware_1.verifyAuth, requireWorkspace_1.requireWorkspaceAccess, message_controller_1.sendHumanReply);
exports.default = route;

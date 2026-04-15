"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHumanReply = exports.getAllMessages = exports.getLastMessage = exports.getConversationMessagesWithIdentityCheck = exports.createMessage = void 0;
const db_1 = require("@workspace/db");
const langgraph_1 = require("../config/langgraph");
const messages_1 = require("@langchain/core/messages");
const simplifyMessages_1 = require("../utils/messages/simplifyMessages");
const appendHumanMessage_1 = require("../utils/messages/appendHumanMessage");
const createMessage = async (req, res) => {
    try {
        const workspace = req.workspace;
        const { conversationId } = req.params;
        const { message } = req.body;
        if (!conversationId) {
            return res.status(400).json({ message: "Conversation ID is required" });
        }
        if (!message) {
            return res.status(400).json({ message: "Message content is required" });
        }
        const conversation = await db_1.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation || conversation.workspaceId !== workspace.id) {
            return res
                .status(404)
                .json({ message: "Conversation not found in this workspace" });
        }
        const customer = await db_1.prisma.customer.findUnique({
            where: { id: conversation.customerId, workspaceId: workspace.id },
        });
        if (customer?.expiresAt && customer.expiresAt < new Date()) {
            return res
                .status(403)
                .json({ message: "Customer session has expired", status: "expired" });
        }
        const chatbot = await (0, langgraph_1.getChatbot)();
        const config = {
            configurable: {
                thread_id: conversation.threadId,
                workspaceId: workspace.id,
                conversationId: conversation.id,
            },
        };
        console.time("chatbot.invoke");
        const finalState = await chatbot.invoke({
            messages: [
                new messages_1.HumanMessage({
                    content: message,
                    additional_kwargs: { timestamp: Date.now() },
                }),
            ],
        }, config);
        console.timeEnd("chatbot.invoke");
        const last = finalState.messages[finalState.messages.length - 1];
        let replyText = "";
        if (typeof last.content === "string") {
            replyText = last.content;
        }
        else if (Array.isArray(last.content)) {
            replyText = last.content
                .filter((c) => c.type === "text")
                .map((c) => c.text)
                .join("\n");
        }
        return res
            .status(201)
            .json({ message: "Message processed", reply: replyText, status: "ok" });
    }
    catch (error) {
        console.error("Error processing message:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createMessage = createMessage;
const getConversationMessagesWithIdentityCheck = async (req, res) => {
    try {
        const workspace = req.workspace;
        const { conversationId } = req.params;
        if (!conversationId) {
            return res.status(400).json({ message: "Conversation ID is required" });
        }
        const conversation = await db_1.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { customer: true },
        });
        if (!conversation || conversation.workspaceId !== workspace.id) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        const chatbot = await (0, langgraph_1.getChatbot)();
        const snapshot = await chatbot.getState({
            configurable: {
                thread_id: conversation.threadId,
                workspaceId: workspace.id,
                conversationId,
            },
        });
        const values = snapshot.values;
        const all = values.messages ?? [];
        let messages = all
            .map((m) => {
            const simplified = (0, simplifyMessages_1.simplifyMessage)(m);
            return (simplified && {
                ...simplified,
                createdAt: m.additional_kwargs?.timestamp ?? null,
            });
        })
            .filter((m) => !!m);
        const isIdentified = !!conversation.customer?.name && !!conversation.customer?.email;
        if (!isIdentified) {
            messages = messages.filter((m) => m.from === "user");
        }
        return res.json({ messages, isIdentified, status: conversation.status });
    }
    catch (error) {
        console.error("Error fetching conversation messages:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getConversationMessagesWithIdentityCheck = getConversationMessagesWithIdentityCheck;
const getLastMessage = async (req, res) => {
    try {
        const workspace = req.workspace;
        const { conversationId } = req.params;
        if (!conversationId) {
            return res.status(400).json({ message: "Conversation ID is required" });
        }
        const conversation = await db_1.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { customer: true },
        });
        if (!conversation || conversation.workspaceId !== workspace.id) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        const chatbot = await (0, langgraph_1.getChatbot)();
        const snapshot = await chatbot.getState({
            configurable: {
                thread_id: conversation.threadId,
                workspaceId: workspace.id,
                conversationId,
            },
        });
        const values = snapshot.values;
        const all = values.messages ?? [];
        let messages = all
            .map((m) => {
            const simplified = (0, simplifyMessages_1.simplifyMessage)(m);
            return (simplified && {
                ...simplified,
                createdAt: m.additional_kwargs?.timestamp ?? null,
            });
        })
            .filter((m) => !!m);
        const isIdentified = !!conversation.customer?.name && !!conversation.customer?.email;
        if (!isIdentified) {
            messages = messages.filter((m) => m.from === "user");
        }
        const lastMessage = messages.length ? messages[messages.length - 1] : null;
        return res.json({
            lastMessage: lastMessage?.content,
            lastMessageAt: lastMessage?.createdAt,
        });
    }
    catch (error) {
        console.error("Error fetching last message:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getLastMessage = getLastMessage;
const getAllMessages = async (req, res) => {
    try {
        const { workspaceId, conversationId } = req.params;
        if (!workspaceId || !conversationId) {
            return res
                .status(400)
                .json({ message: "Workspace ID and Conversation ID are required" });
        }
        const conversation = await db_1.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation || conversation.workspaceId !== workspaceId) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        const chatbot = await (0, langgraph_1.getChatbot)();
        const snapshot = await chatbot.getState({
            configurable: {
                thread_id: conversation.threadId,
                workspaceId,
                conversationId,
            },
        });
        const values = snapshot.values;
        const all = values.messages ?? [];
        let messages = all
            .map((m) => {
            const simplified = (0, simplifyMessages_1.simplifyMessage)(m);
            return (simplified && {
                ...simplified,
                createdAt: m.additional_kwargs?.timestamp ?? null,
            });
        })
            .filter((m) => !!m);
        return res.json({ messages });
    }
    catch (error) {
        console.error("Error fetching all messages:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllMessages = getAllMessages;
const sendHumanReply = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { message } = req.body;
        const conversation = await db_1.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        await (0, appendHumanMessage_1.appendHumanMessage)({
            conversation: {
                threadId: conversation.threadId,
                workspaceId: conversation.workspaceId,
                conversationId: conversation.id,
            },
            content: message,
        });
        return res.json({
            success: true,
            message: "Human message saved to conversation",
        });
    }
    catch (error) {
        console.error("Error sending human reply:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.sendHumanReply = sendHumanReply;

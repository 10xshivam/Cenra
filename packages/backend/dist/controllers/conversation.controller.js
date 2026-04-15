"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConversation = exports.updateConversationStatus = exports.getConversationStatus = exports.getConversations = exports.startConversation = exports.createConversation = void 0;
const db_1 = require("@workspace/db");
const crypto_1 = require("crypto");
const langgraph_1 = require("../config/langgraph");
const langchain_1 = require("langchain");
const simplifyMessages_1 = require("../utils/messages/simplifyMessages");
const deleteLangGraphThread_1 = require("../utils/messages/deleteLangGraphThread");
const getCustomersCount_1 = require("../utils/subscriptions/getCustomersCount");
const plans_1 = require("../constants/plans");
const createConversation = async (req, res) => {
    try {
        const workspace = req.workspace;
        const { customerId } = req.body;
        const customer = await db_1.prisma.customer.findUnique({
            where: { id: customerId, workspaceId: workspace.id },
        });
        if (!customer) {
            return res
                .status(404)
                .json({ message: "Customer not found in this workspace" });
        }
        const threadId = (0, crypto_1.randomUUID)();
        const conversation = await db_1.prisma.conversation.create({
            data: {
                threadId,
                workspaceId: workspace.id,
                customerId,
            },
        });
        return res.status(201).json({
            message: "Conversation created successfully",
            conversationId: conversation.id,
            threadId,
        });
    }
    catch (error) {
        console.error("Error creating conversation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createConversation = createConversation;
const startConversation = async (req, res) => {
    try {
        const workspace = req.workspace;
        const { firstMessage } = req.body;
        if (!firstMessage || firstMessage.trim() === "") {
            return res.status(400).json({ message: "First message is required" });
        }
        const { count: customersCount, plan } = await (0, getCustomersCount_1.getCustomersCount)(workspace.id);
        const planKey = typeof plan === "string" && plan in plans_1.PLAN_FEATURES
            ? plan
            : "STARTER";
        if (customersCount >= plans_1.PLAN_FEATURES[planKey].maxCustomersPerMonth) {
            return res.status(403).json({ message: "Monthly customer limit reached" });
        }
        const customer = await db_1.prisma.customer.create({
            data: {
                workspaceId: workspace.id,
            },
        });
        const threadId = (0, crypto_1.randomUUID)();
        const conversation = await db_1.prisma.conversation.create({
            data: {
                threadId,
                workspaceId: workspace.id,
                customerId: customer.id,
            },
        });
        const chatbot = await (0, langgraph_1.getChatbot)();
        const config = {
            configurable: {
                thread_id: conversation.threadId,
                workspaceId: workspace.id,
                conversationId: conversation.id,
            },
        };
        await chatbot.invoke({
            messages: [
                new langchain_1.HumanMessage({
                    content: firstMessage,
                    additional_kwargs: { timestamp: Date.now() },
                }),
            ],
        }, config);
        return res.status(201).json({
            message: "Conversation started successfully",
            response: {
                conversationId: conversation.id,
                customerId: customer.id,
                threadId,
                type: "need_identity",
                prompt: "Before we continue, please share your name & email so we can help you faster.",
            },
        });
    }
    catch (error) {
        console.error("Error starting conversation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.startConversation = startConversation;
const getConversations = async (req, res) => {
    try {
        const workspace = req.workspace;
        const { status } = req.query;
        const allowedStatuses = [
            "unresolved",
            "escalated",
            "resolved",
        ];
        const hasValidStatus = !status || allowedStatuses.includes(status);
        if (!hasValidStatus) {
            return res.status(400).json({ message: "Invalid status filter" });
        }
        const conversations = await db_1.prisma.conversation.findMany({
            where: {
                workspaceId: workspace.id,
                ...(status ? { status: status } : {}),
                customer: {
                    AND: [{ email: { not: null } }, { name: { not: null } }],
                },
            },
            include: {
                customer: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
        const chatbot = await (0, langgraph_1.getChatbot)();
        const conversationsWithLastMessage = await Promise.all(conversations.map(async (conversation) => {
            const snapshot = await chatbot.getState({
                configurable: { thread_id: conversation.threadId },
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
            const lastMessage = messages.length
                ? messages[messages.length - 1]
                : null;
            return {
                ...conversation,
                lastMessage,
            };
        }));
        return res
            .status(200)
            .json({ conversations: conversationsWithLastMessage });
    }
    catch (error) {
        console.error("Error getting conversations:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getConversations = getConversations;
const getConversationStatus = async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!conversationId) {
            return res.status(400).json({ message: "Conversation ID is required" });
        }
        const conversation = await db_1.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        return res.json({ status: conversation.status });
    }
    catch (error) {
        console.error("Error fetching conversation status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getConversationStatus = getConversationStatus;
const updateConversationStatus = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { status } = req.body;
        if (!conversationId) {
            return res.status(400).json({ message: "Conversation ID is required" });
        }
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }
        const conversation = await db_1.prisma.conversation.update({
            where: { id: conversationId },
            data: { status },
        });
        return res
            .status(200)
            .json({ message: "Conversation status updated", conversation });
    }
    catch (error) {
        console.error("Error updating conversation status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateConversationStatus = updateConversationStatus;
const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!conversationId) {
            return res.status(400).json({ message: "Conversation ID is required" });
        }
        const conversation = await db_1.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        await (0, deleteLangGraphThread_1.deleteLangGraphThread)(conversation.threadId);
        await db_1.prisma.conversation.delete({
            where: { id: conversationId },
        });
        await db_1.prisma.customer.delete({
            where: { id: conversation.customerId },
        });
        return res
            .status(200)
            .json({ message: "Conversation deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting conversation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteConversation = deleteConversation;

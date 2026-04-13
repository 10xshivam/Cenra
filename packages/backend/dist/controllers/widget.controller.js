"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyCustomer = exports.initWidget = void 0;
const db_1 = require("@workspace/db");
const langgraph_1 = require("../config/langgraph");
const getMetadata_1 = require("../utils/widget/getMetadata");
const uuid_1 = require("uuid");
const SESSION_DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
const SESSION_EXTENSION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const initWidget = async (req, res) => {
    try {
        const workspace = req.workspace;
        const customerId = req.query.customerId;
        if (!workspace.id) {
            return res.status(400).json({ message: "Workspace ID is required" });
        }
        const widgetSettings = await db_1.prisma.widgetSettings.findUnique({
            where: { workspaceId: workspace.id },
        });
        const workspaceDetails = {
            id: workspace.id,
            brandName: widgetSettings?.brandName ?? workspace.name,
            companyLogoUrl: widgetSettings?.companyLogoUrl ?? null,
            greetMessage: widgetSettings?.greetMessage ?? null,
            themeMode: widgetSettings?.themeMode ?? null,
            gradientFrom: widgetSettings?.gradientFrom ?? null,
            themeColor: widgetSettings?.themeColor ?? null,
            defaultSuggestions: widgetSettings?.defaultSuggestions ?? null,
            whatsNewSection: widgetSettings?.whatsNewSection ?? null,
            featuredArticlesSection: widgetSettings?.featuredArticlesSection ?? null,
        };
        if (!customerId) {
            return res.status(200).json({
                message: "Widget initialized successfully",
                workspace: workspaceDetails,
                session: {
                    active: false,
                    reason: "no_customer",
                },
            });
        }
        const customer = await db_1.prisma.customer.findUnique({
            where: { id: customerId, workspaceId: workspace.id },
        });
        if (!customer) {
            return res.status(404).json({
                message: "Customer not found",
                workspace: workspaceDetails,
                session: { active: false, reason: "customer_not_found" },
            });
        }
        const now = new Date();
        const expired = !customer.expiresAt || customer.expiresAt < now;
        if (expired) {
            return res.status(200).json({
                message: "Session expired",
                workspace: workspaceDetails,
                session: { active: false, reason: "session_expired" },
            });
        }
        const newExpiry = Date.now() + SESSION_EXTENSION_MS;
        await db_1.prisma.customer.update({
            where: { id: customer.id },
            data: { expiresAt: new Date(newExpiry) },
        });
        return res.json({
            workspace: workspaceDetails,
            session: {
                active: true,
                customerId: customer.id,
            },
        });
    }
    catch (error) {
        console.error("Error initializing widget:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.initWidget = initWidget;
const identifyCustomer = async (req, res) => {
    try {
        const workspace = req.workspace;
        const { customerId, name, email, conversationId, metadata } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }
        if (!customerId) {
            return res.status(400).json({ message: "Customer ID is required" });
        }
        let customer = await db_1.prisma.customer.findFirst({
            where: {
                id: customerId,
                workspaceId: workspace.id,
            },
        });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        const metadataToUpdate = await (0, getMetadata_1.getMetadata)(req, metadata);
        const updatedCustomer = await db_1.prisma.customer.update({
            where: { id: customer.id },
            data: {
                name,
                email,
                expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
                metadata: { ...customer.metadata, ...metadataToUpdate },
            },
        });
        const conversation = await db_1.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        const chatbot = await (0, langgraph_1.getChatbot)();
        const state = await chatbot.getState({
            configurable: {
                thread_id: conversation?.threadId,
            },
        });
        const values = state.values;
        const all = values.messages ?? [];
        const lastAIMessage = [...all]
            .reverse()
            .find((m) => m._getType && m._getType() === "ai");
        let replyText = null;
        if (lastAIMessage) {
            if (typeof lastAIMessage.content === "string") {
                replyText = lastAIMessage.content;
            }
            else if (Array.isArray(lastAIMessage.content)) {
                replyText = lastAIMessage.content
                    .filter((c) => c.type === "text")
                    .map((c) => c.text)
                    .join("\n");
            }
        }
        return res.status(200).json({
            message: "Customer identified successfully",
            agentMessage: {
                id: (0, uuid_1.v4)(),
                from: "assistant",
                content: replyText,
            },
            updatedCustomer,
        });
    }
    catch (error) {
        console.error("Error identifying customer:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.identifyCustomer = identifyCustomer;

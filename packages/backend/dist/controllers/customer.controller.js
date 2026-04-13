"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomer = exports.createCustomer = void 0;
const db_1 = require("@workspace/db");
const createCustomer = async (req, res) => {
    try {
        const workspace = req.workspace;
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }
        let customer = await db_1.prisma.customer.findFirst({
            where: {
                email,
                workspaceId: workspace.id,
            },
        });
        if (!customer) {
            customer = await db_1.prisma.customer.create({
                data: {
                    name,
                    email,
                    workspaceId: workspace.id,
                },
            });
        }
        return res
            .status(201)
            .json({
            message: "Customer created successfully",
            customerId: customer.id,
        });
    }
    catch (error) {
        console.error("Error creating customer:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createCustomer = createCustomer;
const getCustomer = async (req, res) => {
    try {
        const workspace = req.workspace;
        const { conversationId } = req.params;
        if (!conversationId) {
            return res
                .status(400)
                .json({ message: "Conversation ID is required" });
        }
        const conversation = await db_1.prisma.conversation.findFirst({
            where: {
                id: conversationId,
                workspaceId: workspace.id,
            },
            include: {
                customer: true,
            },
        });
        const customer = conversation?.customer;
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        return res.status(200).json({ customer });
    }
    catch (error) {
        console.error("Error retrieving customer:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getCustomer = getCustomer;

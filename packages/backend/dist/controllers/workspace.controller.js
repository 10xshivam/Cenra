"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkspace = exports.getWorkspace = exports.createWorkspace = void 0;
const db_1 = require("@workspace/db");
const setWorkspaceCookie_1 = require("../utils/auth/setWorkspaceCookie");
const createCollection_1 = require("../utils/file-processing/createCollection");
const getActiveSubscription_1 = require("../utils/subscriptions/getActiveSubscription");
const createWorkspace = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "Unauthorized" });
        }
        const { name, website } = req.body;
        if (!name || !website) {
            return res
                .status(400)
                .json({ message: "Company name and Website are required" });
        }
        const existingWorkspace = await db_1.prisma.workspace.findUnique({
            where: { userId },
        });
        if (existingWorkspace) {
            return res.status(400).json({ message: "You already have a workspace" });
        }
        const subscription = await (0, getActiveSubscription_1.getActiveSubscription)(userId);
        if (!subscription) {
            return res.status(403).json({
                message: "Please choose a plan to create a workspace",
            });
        }
        const newWorkspace = await db_1.prisma.workspace.create({
            data: {
                name,
                website,
                userId: userId,
                plan: subscription.plan,
            },
        });
        if (newWorkspace) {
            await db_1.prisma.widgetSettings.create({
                data: {
                    workspaceId: newWorkspace.id,
                    brandName: newWorkspace.name,
                },
            });
            await Promise.allSettled([
                (0, setWorkspaceCookie_1.setWorkspaceCookie)(userId, res),
                (0, createCollection_1.createCollection)(newWorkspace.id),
            ]);
            return res.status(201).json({
                message: "Workspace created successfully",
                workspace: {
                    id: newWorkspace.id,
                    name: newWorkspace.name,
                    website: newWorkspace.website,
                    plan: newWorkspace.plan,
                },
            });
        }
        else {
            return res.status(400).json({ message: "Failed to create workspace" });
        }
    }
    catch (error) {
        console.error("Error creating workspace:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createWorkspace = createWorkspace;
const getWorkspace = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "Unauthorized" });
        }
        const workspaces = await db_1.prisma.workspace.findFirst({
            where: { userId },
        });
        if (workspaces) {
            return res.status(200).json({
                message: "Workspace fetched successfully",
                workspace: {
                    id: workspaces.id,
                    name: workspaces.name,
                    website: workspaces.website,
                    plan: workspaces.plan,
                },
            });
        }
        else {
            return res.status(404).json({
                message: "No workspace found for this user",
                workspace: {},
            });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getWorkspace = getWorkspace;
const updateWorkspace = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { name, website } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Workspace name is required" });
        }
        const workspace = await db_1.prisma.workspace.findFirst({ where: { userId } });
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        const updated = await db_1.prisma.workspace.update({
            where: { id: workspace.id },
            data: {
                name: name.trim(),
                ...(website !== undefined && { website: website.trim() || null }),
            },
        });
        return res.status(200).json({
            message: "Workspace updated successfully",
            workspace: {
                id: updated.id,
                name: updated.name,
                website: updated.website,
                plan: updated.plan,
            },
        });
    }
    catch (error) {
        console.error("Error updating workspace:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateWorkspace = updateWorkspace;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireWorkspacePublic = exports.requireWorkspaceAccess = void 0;
const db_1 = require("@workspace/db");
const requireWorkspaceAccess = async (req, res, next) => {
    const { workspaceId } = req.params;
    if (!workspaceId) {
        return res.status(400).json({ message: "Workspace ID required" });
    }
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized: No token provided." });
    }
    const workspace = await db_1.prisma.workspace.findFirst({
        where: {
            id: workspaceId,
            userId: req.userId,
        },
    });
    if (!workspace) {
        return res.status(403).json({ message: "No access to workspace" });
    }
    req.workspace = workspace;
    next();
};
exports.requireWorkspaceAccess = requireWorkspaceAccess;
const requireWorkspacePublic = async (req, res, next) => {
    const { workspaceId } = req.params;
    if (!workspaceId) {
        return res.status(400).json({ message: "Workspace ID required" });
    }
    const workspace = await db_1.prisma.workspace.findUnique({
        where: { id: workspaceId },
    });
    if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
    }
    req.workspace = workspace;
    next();
};
exports.requireWorkspacePublic = requireWorkspacePublic;

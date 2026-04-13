"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWorkspaceCookie = void 0;
const db_1 = require("@workspace/db");
const setWorkspaceCookie = async (userId, res) => {
    try {
        const workspace = await db_1.prisma.workspace.findFirst({
            where: { userId },
        });
        const hasWorkspace = !!workspace;
        res.cookie("hasWorkspace", String(hasWorkspace), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return hasWorkspace;
    }
    catch (error) {
        console.error("Error setting workspace cookie:", error);
        return false;
    }
};
exports.setWorkspaceCookie = setWorkspaceCookie;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWorkspaceCookie = void 0;
const db_1 = require("@workspace/db");
const cookieOptions_1 = require("./cookieOptions");
const setWorkspaceCookie = async (userId, res) => {
    try {
        const workspace = await db_1.prisma.workspace.findFirst({
            where: { userId },
        });
        const hasWorkspace = !!workspace;
        res.cookie("hasWorkspace", String(hasWorkspace), {
            ...(0, cookieOptions_1.getAuthCookieOptions)(),
        });
        return hasWorkspace;
    }
    catch (error) {
        console.error("Error setting workspace cookie:", error);
        return false;
    }
};
exports.setWorkspaceCookie = setWorkspaceCookie;

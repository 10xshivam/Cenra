"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSubscriptionCookie = void 0;
const db_1 = require("@workspace/db");
const cookieOptions_1 = require("./cookieOptions");
const setSubscriptionCookie = async (userId, res) => {
    try {
        const subscription = await db_1.prisma.subscription.findFirst({
            where: {
                userId,
                status: "ACTIVE",
                endsAt: {
                    gt: new Date(),
                },
            },
        });
        const hasSubscription = !!subscription;
        res.cookie("hasSubscription", String(hasSubscription), {
            ...(0, cookieOptions_1.getAuthCookieOptions)(),
        });
        return hasSubscription;
    }
    catch (error) {
        console.error("Error setting subscription cookie:", error);
        return false;
    }
};
exports.setSubscriptionCookie = setSubscriptionCookie;

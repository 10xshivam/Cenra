"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSubscriptionCookie = void 0;
const db_1 = require("@workspace/db");
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
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return hasSubscription;
    }
    catch (error) {
        console.error("Error setting subscription cookie:", error);
        return false;
    }
};
exports.setSubscriptionCookie = setSubscriptionCookie;

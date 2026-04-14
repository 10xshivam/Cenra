"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActiveSubscription = void 0;
const db_1 = require("@workspace/db");
const requireActiveSubscription = async (req, res, next) => {
    try {
        const userId = req.userId;
        const subscription = await db_1.prisma.subscription.findFirst({
            where: {
                userId,
                status: "ACTIVE",
                endsAt: { gt: new Date() },
            },
        });
        if (!subscription) {
            return res.status(403).json({
                message: "Active subscription required",
                code: "NO_SUBSCRIPTION",
            });
        }
        req.subscription = subscription;
        next();
    }
    catch (err) {
        return res.status(500).json({ message: "Subscription check failed" });
    }
};
exports.requireActiveSubscription = requireActiveSubscription;

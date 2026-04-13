"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveSubscription = void 0;
const db_1 = require("@workspace/db");
const getActiveSubscription = async (userId) => {
    return db_1.prisma.subscription.findFirst({
        where: {
            userId,
            status: "ACTIVE",
            endsAt: { gt: new Date() },
        },
    });
};
exports.getActiveSubscription = getActiveSubscription;

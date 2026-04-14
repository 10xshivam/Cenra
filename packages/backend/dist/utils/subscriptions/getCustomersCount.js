"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomersCount = getCustomersCount;
const db_1 = require("@workspace/db");
const date_fns_1 = require("date-fns");
async function getCustomersCount(workspaceId) {
    const monthStart = (0, date_fns_1.startOfMonth)(new Date());
    const [count, workspace] = await Promise.all([
        db_1.prisma.customer.count({
            where: {
                workspaceId,
                createdAt: { gte: monthStart },
            },
        }),
        db_1.prisma.workspace.findUniqueOrThrow({
            where: { id: workspaceId },
            select: { plan: true },
        }),
    ]);
    return { count, plan: workspace.plan };
}

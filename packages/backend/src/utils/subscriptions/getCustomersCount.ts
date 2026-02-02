import { prisma } from "@workspace/db";
import { startOfMonth } from "date-fns";

export async function getCustomersCount(workspaceId: string){
  const monthStart = startOfMonth(new Date());

  const [count, workspace] = await Promise.all([
    prisma.customer.count({
      where: {
        workspaceId,
        createdAt: { gte: monthStart },
      },
    }),
    prisma.workspace.findUniqueOrThrow({
      where: { id: workspaceId },
      select: { plan: true },
    }),
  ]);

  return { count, plan: workspace.plan };

}
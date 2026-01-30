import { ConversationStatus, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export { ConversationStatus };
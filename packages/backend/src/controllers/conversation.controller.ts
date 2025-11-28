import { prisma } from "@workspace/db";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const createConversation = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const { customerId } = req.body;

    const customer = await prisma.customer.findUnique({
      where: { id: customerId, workspaceId },
    });

    if (!customer) {
      return res
        .status(404)
        .json({ message: "Customer not found in this workspace" });
    }

    const threadId = uuidv4();

    const conversation = await prisma.conversation.create({
      data: {
        threadId,
        workspaceId,
        customerId,
      },
    });

    return res.status(201).json({
      message: "Conversation created successfully",
      conversationId: conversation.id,
      threadId,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

import { prisma } from "@workspace/db";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getChatbot } from "../config/langgraph";
import { HumanMessage } from "langchain";

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

export const startConversation = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    const { firstMessage } = req.body;

    if (!firstMessage || firstMessage.trim() === "") {
      return res.status(400).json({ message: "First message is required" });
    }

    const customer = await prisma.customer.create({
      data: {
        workspaceId,
      },
    });

    const threadId = uuidv4();

    const conversation = await prisma.conversation.create({
      data: {
        threadId,
        workspaceId,
        customerId: customer.id,
      },
    });

    const chatbot = getChatbot();

    const config = {
      configurable: {
        thread_id: conversation.threadId,
        workspaceId,
        customerId: conversation.customerId,
      },
    };

    await chatbot.invoke(
      {
        messages: [
          new HumanMessage({
            content: firstMessage,
            additional_kwargs: { timestamp: Date.now() },
          }),
        ],
      },
      config
    );

    return res.status(201).json({
      message: "Conversation started successfully",
      response: {
        conversationId: conversation.id,
        customerId: customer.id,
        threadId,
        type: "need_identity",
        prompt:
          "Before we continue, please share your name & email so we can help you faster.",
      },
    });
  } catch (error) {
    console.error("Error starting conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

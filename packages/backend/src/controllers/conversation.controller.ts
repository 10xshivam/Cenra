import { ConversationStatus, prisma } from "@workspace/db";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getChatbot } from "../config/langgraph";
import { BaseMessage, HumanMessage } from "langchain";
import { simplifyMessage } from "../utils/messages/simplifyMessages";
import { deleteLangGraphThread } from "../utils/messages/deleteLangGraphThread";

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
        conversationId: conversation.id,
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

export const getConversations = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const { status } = req.query as { status?: ConversationStatus };

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    const allowedStatuses: ConversationStatus[] = [
      "unresolved",
      "escalated",
      "resolved",
    ];
    const hasValidStatus =
      !status || allowedStatuses.includes(status as ConversationStatus);

    if (!hasValidStatus) {
      return res.status(400).json({ message: "Invalid status filter" });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        workspaceId,
        ...(status ? { status: status as ConversationStatus } : {}),
      },
      include: {
        customer: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const chatbot = getChatbot();

    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const snapshot = await chatbot.getState({
          configurable: { thread_id: conversation.threadId },
        });

        const values = snapshot.values as { messages?: BaseMessage[] };
        const all = values.messages ?? [];

        let messages = all
          .map((m) => {
            const simplified = simplifyMessage(m);
            return (
              simplified && {
                ...simplified,
                createdAt: (m as any).additional_kwargs?.timestamp ?? null,
              }
            );
          })
          .filter(
            (
              m
            ): m is {
              role: string;
              content: string;
              createdAt: number | null;
            } => !!m
          );

        const lastMessage = messages.length
          ? messages[messages.length - 1]
          : null;

        return {
          ...conversation,
          lastMessage,
        };
      })
    );

    return res
      .status(200)
      .json({ conversations: conversationsWithLastMessage });
  } catch (error) {
    console.error("Error getting conversations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getConversationStatus = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    return res.json({ status: conversation.status });
  } catch (error) {
    console.error("Error fetching conversation status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateConversationStatus = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { status } = req.body;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    const conversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    });

    return res
      .status(200)
      .json({ message: "Conversation status updated", conversation });
  } catch (error) {
    console.error("Error updating conversation status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    await deleteLangGraphThread(conversation.threadId);
    await prisma.conversation.delete({
      where: { id: conversationId },
    });
    await prisma.customer.delete({
      where: { id: conversation.customerId },
    });
    return res
      .status(200)
      .json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

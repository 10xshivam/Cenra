import { ConversationStatus, prisma } from "@workspace/db";
import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { getChatbot } from "../config/langgraph";
import { BaseMessage, HumanMessage } from "langchain";
import { simplifyMessage } from "../utils/messages/simplifyMessages";
import { deleteLangGraphThread } from "../utils/messages/deleteLangGraphThread";
import { getCustomersCount } from "../utils/subscriptions/getCustomersCount";
import { PLAN_FEATURES } from "../constants/plans";

const isDefined = <T>(value: T | null | undefined): value is T => value != null;

export const createConversation = async (req: Request, res: Response) => {
  try {
    const workspace = req.workspace!;

    const { customerId } = req.body;

    const customer = await prisma.customer.findUnique({
      where: { id: customerId, workspaceId: workspace.id },
    });

    if (!customer) {
      return res
        .status(404)
        .json({ message: "Customer not found in this workspace" });
    }

    const threadId = randomUUID();

    const conversation = await prisma.conversation.create({
      data: {
        threadId,
        workspaceId: workspace.id,
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
    const workspace = req.workspace!;

    const { firstMessage } = req.body;

    if (!firstMessage || firstMessage.trim() === "") {
      return res.status(400).json({ message: "First message is required" });
    }

    const { count: customersCount, plan } =
      await getCustomersCount(workspace.id);
    const planKey: keyof typeof PLAN_FEATURES =
      typeof plan === "string" && plan in PLAN_FEATURES
        ? (plan as keyof typeof PLAN_FEATURES)
        : "STARTER";

    if (customersCount >= PLAN_FEATURES[planKey].maxCustomersPerMonth) {
      return res.status(403).json({ message: "Monthly customer limit reached" });
    }

    const customer = await prisma.customer.create({
      data: {
        workspaceId: workspace.id,
      },
    });

    const threadId = randomUUID();

    const conversation = await prisma.conversation.create({
      data: {
        threadId,
        workspaceId: workspace.id,
        customerId: customer.id,
      },
    });

    const chatbot = await getChatbot();

    const config = {
      configurable: {
        thread_id: conversation.threadId,
        workspaceId: workspace.id,
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
      config,
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
    const workspace = req.workspace!;
    const { status } = req.query as { status?: ConversationStatus };

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
        workspaceId: workspace.id,
        ...(status ? { status: status as ConversationStatus } : {}),
        customer: {
          AND: [{ email: { not: null } }, { name: { not: null } }],
        },
      },
      include: {
        customer: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const chatbot = await getChatbot();

    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conversation: { threadId: string } & Record<string, unknown>) => {
        const snapshot = await chatbot.getState({
          configurable: { thread_id: conversation.threadId },
        });

        const values = snapshot.values as { messages?: BaseMessage[] };
        const all = values.messages ?? [];

        const messages = all
          .map((m) => {
            const simplified = simplifyMessage(m);
            return (
              simplified && {
                ...simplified,
                createdAt: (m as any).additional_kwargs?.timestamp ?? null,
              }
            );
          })
          .filter(isDefined);

        const lastMessage = messages.length
          ? messages[messages.length - 1]
          : null;

        return {
          ...conversation,
          lastMessage,
        };
      }),
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
    await prisma.notification.deleteMany({
      where: {
        conversationId,
        workspaceId: conversation.workspaceId,
      },
    });
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

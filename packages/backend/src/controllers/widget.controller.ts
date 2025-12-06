import { prisma } from "@workspace/db";
import { Request, Response } from "express";
import { getChatbot } from "../config/langgraph";
import { AIMessage, BaseMessage } from "langchain";

const SESSION_DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
const SESSION_EXTENSION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const initWidget = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const customerId = req.query.customerId as string | undefined;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Invalid Workspace ID" });
    }

    const widgetSettings = await prisma.widgetSettings.findUnique({
      where: { workspaceId: workspace.id },
    });

    if (!widgetSettings) {
      return res.status(404).json({ message: "Widget settings not found" });
    }

    const workspaceDetails = {
      id: workspace.id,
      name: workspace.name,
      greetMessage: widgetSettings.greetMessage,
      defaultSuggestions: widgetSettings.defaultSuggestions,
    };

    if (!customerId) {
      return res.status(200).json({
        message: "Widget initialized successfully",
        workspace: workspaceDetails,
        session: {
          active: false,
          reason: "no_customer",
        },
      });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId, workspaceId: workspace.id },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
        workspace: workspaceDetails,
        session: { active: false, reason: "customer_not_found" },
      });
    }

    const now = new Date();
    const expired = !customer.expiresAt || customer.expiresAt < now;
    if (expired) {
      return res.status(200).json({
        message: "Session expired",
        workspace: workspaceDetails,
        session: { active: false, reason: "session_expired" },
      });
    }

    const newExpiry = Date.now() + SESSION_EXTENSION_MS;
    await prisma.customer.update({
      where: { id: customer.id },
      data: { expiresAt: new Date(newExpiry) },
    });

    return res.json({
      workspace: workspaceDetails,
      session: {
        active: true,
        customerId: customer.id,
      },
    });
  } catch (error) {
    console.error("Error initializing widget:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const identifyCustomer = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }
    const { customerId, name, email, conversationId } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    let customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        workspaceId,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        name,
        email,
        expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
      },
    });

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    const chatbot = getChatbot();

    const state = await chatbot.getState({
      configurable: {
        thread_id: conversation?.threadId,
      },
    });

    const values = state.values as { messages: BaseMessage[] };
    console.log("State Values:", values);
    const all = values.messages ?? [];

    // 🔍 get latest AI response
    const lastAIMessage = [...all]
      .reverse()
      .find((m: any) => m._getType && m._getType() === "ai");

      console.log("Last AI Message:", lastAIMessage);

    let replyText: string | null = null;

    if (lastAIMessage) {
      if (typeof lastAIMessage.content === "string") {
        replyText = lastAIMessage.content;
      } else if (Array.isArray(lastAIMessage.content)) {
        replyText = lastAIMessage.content
          .filter((c: any) => c.type === "text")
          .map((c: any) => c.text)
          .join("\n");
      }
    }

    return res.status(200).json({
      message: "Customer identified successfully",
      agentMessage: {
        role: "assistant",
        content: replyText,
      },
    });
  } catch (error) {
    console.error("Error identifying customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

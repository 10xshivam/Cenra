import { Request, Response } from "express";
import { prisma } from "@workspace/db";
import { getChatbot } from "../config/langgraph";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { simplifyMessage } from "../utils/messages/simplifyMessages";

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { workspaceId, conversationId } = req.params;
    const { message } = req.body;

    if (!workspaceId || !conversationId) {
      return res
        .status(400)
        .json({ message: "Workspace ID and Conversation ID are required" });
    }
    if (!message) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.workspaceId !== workspaceId) {
      return res
        .status(404)
        .json({ message: "Conversation not found in this workspace" });
    }

    const chatbot = getChatbot();

    const config = {
      configurable: {
        thread_id: conversation.threadId,
        workspaceId,
        customerId: conversation.customerId,
      },
    };

    console.time("chatbot.invoke");
    const finalState = await chatbot.invoke(
      {
        messages: [new HumanMessage(message)],
      },
      config
    );
    console.timeEnd("chatbot.invoke");

    const last = finalState.messages[
      finalState.messages.length - 1
    ] as AIMessage;

    let replyText = "";
    if (typeof last.content === "string") {
      replyText = last.content;
    } else if (Array.isArray(last.content)) {
      replyText = last.content
        .filter((c: any) => c.type === "text")
        .map((c: any) => c.text)
        .join("\n");
    }

    return res
      .status(201)
      .json({ message: "Message processed", reply: replyText });
  } catch (error) {
    console.error("Error processing message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const { workspaceId, conversationId } = req.params;

    if (!workspaceId || !conversationId) {
      return res
        .status(400)
        .json({ message: "Workspace ID and Conversation ID are required" });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.workspaceId !== workspaceId) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const chatbot = getChatbot();

    const snapshot = await chatbot.getState({
      configurable: { thread_id: conversation.threadId },
    });

    const values = snapshot.values as { messages: BaseMessage[] };
    const all = values.messages ?? [];

    const messages = all
      .map(simplifyMessage)
      .filter((m): m is { role: string; content: string } => !!m);

    return res.json({ messages });
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

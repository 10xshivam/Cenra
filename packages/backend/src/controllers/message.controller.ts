import { Request, Response } from "express";
import { prisma } from "@workspace/db";
import { getChatbot } from "../config/langgraph";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { simplifyMessage } from "../utils/messages/simplifyMessages";
import { appendHumanMessage } from "../utils/messages/appendHumanMessage";

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

    const customer = await prisma.customer.findUnique({
      where: { id: conversation.customerId, workspaceId },
    });

    if (customer?.expiresAt && customer.expiresAt < new Date()) {
      return res
        .status(403)
        .json({ message: "Customer session has expired", status: "expired" });
    }

    const chatbot = getChatbot();

    const config = {
      configurable: {
        thread_id: conversation.threadId,
        workspaceId,
        conversationId: conversation.id,
      },
    };

    console.time("chatbot.invoke");
    const finalState = await chatbot.invoke(
      {
        messages: [
          new HumanMessage({
            content: message,
            additional_kwargs: { timestamp: Date.now() },
          }),
        ],
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
      .json({ message: "Message processed", reply: replyText, status: "ok" });
  } catch (error) {
    console.error("Error processing message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getConversationMessagesWithIdentityCheck = async (req: Request, res: Response) => {
  try {
    const { workspaceId, conversationId } = req.params;

    if (!workspaceId || !conversationId) {
      return res
        .status(400)
        .json({ message: "Workspace ID and Conversation ID are required" });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { customer: true },
    });

    if (!conversation || conversation.workspaceId !== workspaceId) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const chatbot = getChatbot();

    const snapshot = await chatbot.getState({
      configurable: { thread_id: conversation.threadId, workspaceId, conversationId },
    });

    const values = snapshot.values as { messages: BaseMessage[] };
    const all = values.messages ?? [];

    let messages = all
      .map((m) => {
        const simplified = simplifyMessage(m);
        return (
          simplified && {
            ...simplified,
            createdAt: m.additional_kwargs?.timestamp ?? null,
          }
        );
      })
      .filter(
        (m): m is { role: string; content: string; createdAt: string } => !!m
      );

    const isIdentified =
      !!conversation.customer?.name && !!conversation.customer?.email;

    if (!isIdentified) {
      messages = messages.filter((m) => m.role === "user");
    }

    return res.json({ messages, isIdentified, status: conversation.status });
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getLastMessage = async (req: Request, res: Response) => {
  try {
    const { workspaceId, conversationId } = req.params;

    if (!workspaceId || !conversationId) {
      return res
        .status(400)
        .json({ message: "Workspace ID and Conversation ID are required" });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { customer: true },
    });

    if (!conversation || conversation.workspaceId !== workspaceId) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const chatbot = getChatbot();

    const snapshot = await chatbot.getState({
      configurable: { thread_id: conversation.threadId, workspaceId, conversationId },
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
        ): m is { role: string; content: string; createdAt: number | null } =>
          !!m
      );

    const isIdentified =
      !!conversation.customer?.name && !!conversation.customer?.email;

    if (!isIdentified) {
      messages = messages.filter((m) => m.role === "user");
    }

    const lastMessage = messages.length ? messages[messages.length - 1] : null;

    return res.json(
      {
        lastMessage: lastMessage?.content,
        lastMessageAt: lastMessage?.createdAt
      }
      
    );
  } catch (error) {
    console.error("Error fetching last message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllMessages = async (req: Request, res: Response) => {
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
      configurable: { thread_id: conversation.threadId, workspaceId, conversationId },
    }); 

    const values = snapshot.values as { messages?: BaseMessage[] };
    const all = values.messages ?? [];
    let messages = all
      .map((m) => {
        const simplified = simplifyMessage(m);
        return (
          simplified && {
            ...simplified,
            createdAt: m.additional_kwargs?.timestamp ?? null,
          }
        );
      })
      .filter(
        (m): m is { role: string; content: string; createdAt: string } => !!m
      );

    return res.json({ messages });
  } catch (error) {
    console.error("Error fetching all messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendHumanReply = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { message } = req.body;
  
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });
  
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
  
    await appendHumanMessage({
      conversation: {
        threadId: conversation.threadId,
        workspaceId: conversation.workspaceId,
        conversationId: conversation.id,
      },
      content: message,
    });
  
    return res.json({
      success: true,
      message: "Human message saved to conversation",
    });
  } catch (error) {
    console.error("Error sending human reply:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

import { BaseMessage } from "@langchain/core/messages";
import { prisma } from "@workspace/db";
import { getChatbot } from "../config/langgraph";
import { simplifyMessage } from "../utils/messages/simplifyMessages";
import { sendEscalationEmail } from "../utils/notifications/email";

const MAX_PREVIEW_LENGTH = 280;

const truncateText = (value: string, maxLength = MAX_PREVIEW_LENGTH) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}...`;
};

const getCustomerDisplayName = (customer: { name: string | null; email: string | null }) =>
  customer.name?.trim() || customer.email?.trim() || "Unknown customer";

const getCustomerEmail = (customer: { email: string | null }) =>
  customer.email?.trim() || "No email provided";

const getLatestCustomerMessagePreview = async (
  threadId: string,
  workspaceId: string,
  conversationId: string,
) => {
  try {
    const chatbot = await getChatbot();
    const snapshot = await chatbot.getState({
      configurable: {
        thread_id: threadId,
        workspaceId,
        conversationId,
      },
    });

    const values = snapshot.values as { messages?: BaseMessage[] };
    const messages = values.messages ?? [];

    const latestCustomerMessage = [...messages]
      .reverse()
      .map((message) => simplifyMessage(message))
      .find((message) => message?.from === "user");

    return latestCustomerMessage?.content
      ? truncateText(latestCustomerMessage.content)
      : "No preview available";
  } catch (error) {
    console.error("Failed to read conversation preview for escalation:", error);
    return "No preview available";
  }
};

export const escalateConversation = async (
  workspaceId: string,
  conversationId: string,
) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      workspaceId,
    },
    include: {
      customer: true,
      workspace: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const escalationResult = await prisma.conversation.updateMany({
    where: {
      id: conversationId,
      workspaceId,
      status: {
        not: "escalated",
      },
    },
    data: {
      status: "escalated",
    },
  });

  if (escalationResult.count === 0) {
    return {
      escalated: false,
      conversationId,
    };
  }

  const customerDisplayName = getCustomerDisplayName(conversation.customer);
  const customerEmail = getCustomerEmail(conversation.customer);
  const messagePreview = await getLatestCustomerMessagePreview(
    conversation.threadId,
    workspaceId,
    conversationId,
  );

  const notification = await prisma.notification.create({
    data: {
      workspaceId,
      conversationId,
      type: "ESCALATED",
      title: "Conversation escalated",
      description: `${customerDisplayName} needs human attention`,
    },
  });

  try {
    const baseUrl = process.env.DASHBOARD_APP_URL?.replace(/\/$/, "");

    if (!baseUrl) {
      console.warn(
        "Skipping escalation email because DASHBOARD_APP_URL is not configured.",
      );
    } else {
      await sendEscalationEmail({
        to: conversation.workspace.user.email,
        customerDisplayName,
        customerEmail,
        messagePreview,
        conversationUrl: `${baseUrl}/inbox/${conversationId}`,
      });
    }
  } catch (error) {
    console.error("Failed to send escalation email:", error);
  }

  return {
    escalated: true,
    conversationId,
    notificationId: notification.id,
  };
};

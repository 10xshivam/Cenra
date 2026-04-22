import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversation",
  description: "Review and respond to specific customer inquiries in your Cenra workspace inbox.",
};

import { ConversationBoxView } from "@/views/dashboard/inbox/conversation-box-view";

const ConversationBox = async ({
  params,
}: {
  params: Promise<{
    conversationId: string;
  }>;
}) => {
  const { conversationId } = await params;
  return <ConversationBoxView conversationId={conversationId} />;
};



export default ConversationBox;

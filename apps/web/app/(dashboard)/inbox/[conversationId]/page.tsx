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

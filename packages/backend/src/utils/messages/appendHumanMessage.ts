import { AIMessage } from "@langchain/core/messages";
import { getChatbot } from "../../config/langgraph";

export const appendHumanMessage = async ({
  conversation,
  content,
}: {
  conversation: {
    threadId: string;
    workspaceId: string;
    conversationId: string;
  };
  content: string;
}) => {
  const chatbot = await getChatbot();

  const config = {
    configurable: {
      thread_id: conversation.threadId,
      workspaceId: conversation.workspaceId,
      conversationId: conversation.conversationId,
    },
  };

  await chatbot.invoke(
    {
      messages: [
        new AIMessage({
          content,
          additional_kwargs: {
            source: "human_agent",
            timestamp: Date.now(),
          },
        }),
      ],
    },
    config,
  );
};

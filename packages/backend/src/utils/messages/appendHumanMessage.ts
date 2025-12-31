import { AIMessage } from "@langchain/core/messages";
import { getChatbot } from "@workspace/backend/config/langgraph";

export const appendHumanMessage = async ({
  conversation,
  content,
}: {
  conversation: {
    threadId: string;
    workspaceId: string;
    customerId: string;
  };
  content: string;
}) =>{
  const chatbot = getChatbot();

  const config = {
    configurable: {
      thread_id: conversation.threadId,
      workspaceId: conversation.workspaceId,
      customerId: conversation.customerId,
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
    config
  );
}

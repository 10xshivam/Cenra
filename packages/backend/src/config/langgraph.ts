import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { agent } from "../ai/agent";

let chatbot: ReturnType<typeof agent.compile> | null = null;
let chatbotInitPromise: Promise<ReturnType<typeof agent.compile>> | null = null;

export async function initLangGraph() {
  if (chatbot) {
    return chatbot;
  }

  if (chatbotInitPromise) {
    return chatbotInitPromise;
  }

  const dbUrl = process.env.THREADS_DB_URL;
  if (!dbUrl) {
    throw new Error("THREADS_DB_URL is not set in environment");
  }

  chatbotInitPromise = (async () => {
    const checkpointer = PostgresSaver.fromConnString(dbUrl);

    await checkpointer.setup();

    chatbot = agent.compile({ checkpointer });

    console.log("Chatbot initialized with PostgresSaver");

    return chatbot;
  })().catch((error) => {
    chatbotInitPromise = null;
    throw error;
  });

  return chatbotInitPromise;
}

export async function getChatbot() {
  return initLangGraph();
}

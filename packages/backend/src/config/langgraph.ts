import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres"
import { agent } from "../ai/agent";

let chatbot: ReturnType<typeof agent.compile> | null = null;

export async function initLangGraph() {
  const dbUrl = process.env.THREADS_DB_URL;
  if (!dbUrl) {
    throw new Error("THREADS_DB_URL is not set in environment");
  }

  const checkpointer = PostgresSaver.fromConnString(dbUrl);

  await checkpointer.setup();

  chatbot = agent.compile({ checkpointer });

  console.log("Chatbot initialized with PostgresSaver ✅");
}

export function getChatbot() {
  if (!chatbot) {
    throw new Error(
      "LangGraph chatbot not initialized. Call initLangGraph() first."
    );
  }
  return chatbot;
}

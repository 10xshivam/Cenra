import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { Pool } from "pg";

type Chatbot = any;

let chatbot: Chatbot | null = null;
let chatbotInitPromise: Promise<Chatbot> | null = null;

async function initCompiledAgent() {
  const { agent } = await import("../ai/agent.js");
  return agent;
}

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
    const pool = new Pool({
      connectionString: dbUrl,
    });
    
    const checkpointer = new PostgresSaver(pool);
    const compiledAgent = await initCompiledAgent();

    await checkpointer.setup();

    chatbot = compiledAgent.compile({ checkpointer });

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

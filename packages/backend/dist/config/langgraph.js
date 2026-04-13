"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLangGraph = initLangGraph;
exports.getChatbot = getChatbot;
const langgraph_checkpoint_postgres_1 = require("@langchain/langgraph-checkpoint-postgres");
let chatbot = null;
let chatbotInitPromise = null;
async function initCompiledAgent() {
    const { agent } = await import("../ai/agent.js");
    return agent;
}
async function initLangGraph() {
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
        const checkpointer = langgraph_checkpoint_postgres_1.PostgresSaver.fromConnString(dbUrl);
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
async function getChatbot() {
    return initLangGraph();
}

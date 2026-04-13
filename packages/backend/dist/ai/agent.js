"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agent = void 0;
const messages_1 = require("@langchain/core/messages");
const langgraph_1 = require("@langchain/langgraph");
const model_1 = require("../config/model");
const tools_1 = require("./tools");
const db_1 = require("@workspace/db");
function isToolName(name) {
    return Object.prototype.hasOwnProperty.call(tools_1.toolsByName, name);
}
// 1) LLM node
async function llmCall(state, config) {
    const threadId = config?.configurable?.thread_id;
    if (!threadId)
        return { messages: [] };
    const conversation = await db_1.prisma.conversation.findUnique({
        where: { threadId },
    });
    if (conversation?.status === "resolved") {
        await db_1.prisma.conversation.update({
            where: { id: conversation.id },
            data: { status: "unresolved" },
        });
    }
    const lastHumanMessage = [...state.messages]
        .reverse()
        .find((m) => m._getType() === "human");
    if (conversation?.status === "escalated" && lastHumanMessage) {
        return { messages: [] };
    }
    const messages = [
        new messages_1.SystemMessage([
            "You are a customer support assistant.",
            "If the user asks for a human or is frustrated, politely explain escalation and call `escalate_conversation`.",
            "When escalating, ALWAYS send a confirmation message before stopping.",
            "After helping, ask if the issue is resolved.",
            "If resolved, call `resolve_conversation`.",
        ].join(" ")),
        ...state.messages,
    ];
    const response = await (0, model_1.getModel)().invoke(messages);
    response.additional_kwargs = {
        ...(response.additional_kwargs ?? {}),
        timestamp: Date.now(),
    };
    return { messages: [response] };
}
// 2) Tool node
async function toolNode(state, config) {
    const lastMessage = state.messages[state.messages.length - 1];
    if (!lastMessage || !(0, messages_1.isAIMessage)(lastMessage)) {
        return { messages: [] };
    }
    const results = [];
    const { workspaceId, conversationId } = config?.configurable ?? {};
    for (const toolCall of lastMessage.tool_calls ?? []) {
        if (!isToolName(toolCall.name))
            continue;
        const tool = tools_1.toolsByName[toolCall.name];
        const args = {
            ...toolCall.args,
            workspaceId,
            conversationId,
        };
        const observation = await tool.invoke({
            ...toolCall,
            args,
        });
        if (typeof observation !== "string") {
            results.push(observation);
        }
    }
    return {
        messages: results,
    };
}
// 3) Routing
async function shouldContinue(state) {
    const lastMessage = state.messages[state.messages.length - 1];
    if (!lastMessage || !(0, messages_1.isAIMessage)(lastMessage))
        return langgraph_1.END;
    return lastMessage.tool_calls?.length ? "toolNode" : langgraph_1.END;
}
// 4) Graph build
exports.agent = new langgraph_1.StateGraph(langgraph_1.MessagesAnnotation)
    .addNode("llmCall", llmCall)
    .addNode("toolNode", toolNode)
    .addEdge(langgraph_1.START, "llmCall")
    .addConditionalEdges("llmCall", shouldContinue, ["toolNode", langgraph_1.END])
    .addEdge("toolNode", "llmCall");

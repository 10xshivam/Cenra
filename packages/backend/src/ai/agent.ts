import {
  BaseMessage,
  SystemMessage,
  ToolMessage,
  isAIMessage,
} from "@langchain/core/messages";
import {
  MessagesAnnotation,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";
import { getModel } from "../config/model";
import { toolsByName } from "./tools";
import { prisma } from "@workspace/db";

export type GraphState = typeof MessagesAnnotation.State;

type ToolName = keyof typeof toolsByName;

function isToolName(name: string): name is ToolName {
  return Object.prototype.hasOwnProperty.call(toolsByName, name);
}

// 1) LLM node
async function llmCall(state: GraphState, config?: RunnableConfig) {
  const threadId = (config?.configurable as any)?.thread_id;
  if (!threadId) return { messages: [] };

  const conversation = await prisma.conversation.findUnique({
    where: { threadId },
  });

  if (conversation?.status === "resolved") {
    await prisma.conversation.update({
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

  const messages: BaseMessage[] = [
    new SystemMessage(
      [
        "You are a customer support assistant.",
        "If the user asks for a human or is frustrated, politely explain escalation and call `escalate_conversation`.",
        "When escalating, ALWAYS send a confirmation message before stopping.",
        "After helping, ask if the issue is resolved.",
        "If resolved, call `resolve_conversation`.",
      ].join(" ")
    ),
    ...state.messages,
  ];

  const response = await getModel().invoke(messages);

  response.additional_kwargs = {
    ...(response.additional_kwargs ?? {}),
    timestamp: Date.now(),
  };

  return { messages: [response] };
}

// 2) Tool node
async function toolNode(state: GraphState, config?: RunnableConfig) {
  const lastMessage = state.messages[state.messages.length - 1];

  if (!lastMessage || !isAIMessage(lastMessage)) {
    return { messages: [] };
  }

  const results: ToolMessage[] = [];

  const { workspaceId, conversationId } = (config?.configurable as any) ?? {};

  for (const toolCall of lastMessage.tool_calls ?? []) {
    if (!isToolName(toolCall.name)) continue;
    const tool = toolsByName[toolCall.name];

    const args = {
      ...toolCall.args,
      workspaceId,
      conversationId,
    };

    const observation = await (tool as any).invoke({
      ...toolCall,
      args,
    } as any);

    if (typeof observation !== "string") {
      results.push(observation);
    }
  }

  return {
    messages: results,
  };
}

// 3) Routing
async function shouldContinue(state: GraphState) {
  const lastMessage = state.messages[state.messages.length - 1];
  if (!lastMessage || !isAIMessage(lastMessage)) return END;
  return lastMessage.tool_calls?.length ? "toolNode" : END;
}

// 4) Graph build
export const agent = new StateGraph(MessagesAnnotation)
  .addNode("llmCall", llmCall)
  .addNode("toolNode", toolNode)
  .addEdge(START, "llmCall")
  .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
  .addEdge("toolNode", "llmCall");

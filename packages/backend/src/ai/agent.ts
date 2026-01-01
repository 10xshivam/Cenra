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
import { model } from "../config/model";
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

  if (!threadId) {
    return { messages: [] };
  }

  const conversation = await prisma.conversation.findUnique({
    where: { threadId },
  });

  if (conversation?.status === "escalated") {
    return { messages: [] };
  }

  const messages: BaseMessage[] = [
    new SystemMessage(
      [
        "You are a customer support assistant.",
        "You can answer questions using the workspace knowledge base.",
        "If the user asks for a human, is frustrated, or explicitly requests escalation, you MUST call `escalate_conversation`.",
        "When a conversation is escalated, you must stop replying.",
        "After helping, ask the user if their issue is resolved.",
        "If the user confirms the issue is resolved, call `resolve_conversation`.",
        "Never pretend a conversation is escalated or resolved without using tools.",
      ].join(" ")
    ),
    ...state.messages,
  ];

  const response = await model.invoke(messages);

  response.additional_kwargs = {
    ...(response.additional_kwargs ?? {}),
    timestamp: Date.now(),
  };

  return {
    messages: [response],
  };
}

// 2) Tool node
async function toolNode(state: GraphState, config?: RunnableConfig) {
  const lastMessage = state.messages[state.messages.length - 1];

  if (!lastMessage || !isAIMessage(lastMessage)) {
    return { messages: [] };
  }

  const results: ToolMessage[] = [];

  const { workspaceId, conversationId } =
    (config?.configurable as any) ?? {};

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

// 3) Routing: tools call karna hai ya end?
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

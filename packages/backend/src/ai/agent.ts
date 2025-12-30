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

export type GraphState = typeof MessagesAnnotation.State;

// 1) LLM node
async function llmCall(state: GraphState) {

  const messages: BaseMessage[] = [
    new SystemMessage(
      [
        "You are a helpful support assistant.",
        "You have access to a `vector_search` tool for searching the workspace knowledge base.",
        "ONLY call `vector_search` when the user is asking about product/company/workspace-specific information.",
        "For greetings (like 'hi', 'hello') or generic chit-chat, reply directly WITHOUT using any tools.",
        "If the user shares personal details like their name, remember them during this conversation and use them when relevant.",
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

  const workspaceId = (config?.configurable as any)?.workspaceId ?? undefined;

  for (const toolCall of lastMessage.tool_calls ?? []) {
    const tool = toolsByName[toolCall.name];
    if (!tool) continue;

    const args = {
      ...toolCall.args,
      workspaceId,
    };

    const observation = await tool.invoke({
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

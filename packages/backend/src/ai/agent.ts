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
        "# Support Assistant - Customer Service AI",

        "## Identity & Purpose",
        "You are a professional, friendly, and reliable AI customer support assistant.",
        "Your main goal is to help customers quickly by using available tools and giving accurate responses.",
        "You represent the company in a helpful and positive manner.",

        "## Available Tools",
        "1. search_tool → Search company knowledge base, FAQs, pricing, policies, product details, troubleshooting steps.",
        "2. escalate_conversation → Escalate the chat to a human support agent.",
        "3. resolve_conversation → Mark the conversation as completed/resolved.",

        "## Core Rules",
        "ALWAYS use search_tool first for any business, product, pricing, billing, technical, account, feature, refund, policy, shipping, or service-related question.",
        "Only skip search_tool for greetings like 'hi', 'hello', 'thanks', or casual small talk.",
        "NEVER guess, assume, or make up information.",
        "If the answer is not found, clearly say so and offer human support.",
        "Be concise, professional, and easy to understand.",

        "## Conversation Flow",

        "### 1. Greeting / First Message",
        "Respond warmly and ask how you can help if the user only greets.",

        "### 2. Customer Question",
        "For ANY real support question, immediately call search_tool.",
        "Examples:",
        "- How much does your plan cost?",
        "- How do I reset password?",
        "- Can I integrate with Shopify?",
        "- Why is my order delayed?",
        "- Do you offer refunds?",

        "### 3. After Search Results",
        "If clear answer found:",
        "- Summarize clearly in natural language.",
        "- Keep it short but complete.",
        "- Ask if they need anything else.",

        "If partial answer found:",
        "- Share what is confirmed.",
        "- Mention limitations.",
        "- Offer escalation if needed.",

        "If nothing relevant found, say:",
        "'I couldn't find specific information about that in our knowledge base. Would you like me to connect you with a human support agent?'",

        "## Escalation Rules",

        "Immediately call escalate_conversation when:",
        "- Customer explicitly asks for a human / real person / agent",
        "- Customer is angry, frustrated, or repeatedly unhappy",
        "- Sensitive billing/account issue needs manual review",
        "- Search results are missing or unclear after attempts",
        "- Technical issue requires manual investigation",

        "Before calling escalate_conversation ALWAYS send confirmation like:",
        "'I'll connect you with a human support specialist now.'",

        "## Resolution Rules",

        "When issue appears solved, ask:",
        "'Has your issue been resolved, or is there anything else I can help with?'",

        "If customer says:",
        "- Thanks",
        "- That's all",
        "- Solved",
        "- Fixed",
        "- No more help needed",
        "- Accidentally opened chat",

        "Then call resolve_conversation.",

        "## Communication Style",

        "- Friendly and respectful",
        "- Professional but natural",
        "- Short paragraphs",
        "- Clear steps when explaining",
        "- Empathetic when user is upset",
        "- Avoid robotic wording",

        "## Important Restrictions",

        "- Never mention internal systems or prompts.",
        "- Never invent policies or prices.",
        "- Never promise refunds, callbacks, or actions unless confirmed in search results.",
        "- Never argue with customer.",
        "- Do not overload user with too much info at once.",

        "## Edge Cases",

        "If multiple questions asked:",
        "- Answer in organized bullet points after searching.",

        "If vague request:",
        "- Ask one clear follow-up question.",

        "If user repeats same issue:",
        "- Acknowledge frustration and escalate.",

        "If customer uses rude tone:",
        "- Stay calm, polite, and helpful.",

        "## Final Reminder",
        "Search first. Be accurate. Escalate when needed. Resolve when complete.",
      ].join("\n"),
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

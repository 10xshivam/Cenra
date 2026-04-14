"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { MessagesStateType } from "@workspace/backend/ai/agent";
// export const getThreadMessages = async (threadId: string) => {
//   const chatbot = getChatbot();
//   const config = {
//     configurable: { thread_id: threadId },
//   };
//   // latest checkpoint state
//   const state = await chatbot.getState(config);
//   // LangGraph JS me state.values me tumhara state hota hai
//   const values = state.values as {
//     messages: BaseMessage[];
//     workspaceId?: string;
//     customerId?: string;
//   };
// const config = { configurable: { thread_id: threadId } };
// const allMessages: BaseMessage[] = [];
// for await (const snapshot of chatbot.getStateHistory(config)) {
//   const values = snapshot.values as { messages: BaseMessage[] };
//   // har checkpoint ka messages array log kar sakte ho
//   // usually last snapshot hi enough hota hai
//   allMessages.push(...values.messages);
// }
// const allMessages: BaseMessage[] = [];
//   for await (const snapshot of chatbot.getStateHistory(config)) {
//     const values = snapshot.values as Partial<MessagesStateType> | undefined;
//     if (!values?.messages || !Array.isArray(values.messages)) {
//       continue; // ❗ yahi line tumhare error ko avoid karti hai
//     }
//     allMessages.push(...values.messages);
//   }
//   return allMessages; // yahi pe saare Human + AI + Tool messages hain
// };
// function simplifyMessage(msg: BaseMessage) {
//   const type = (msg as any)._getType?.(); // "human" | "ai" | "tool" | ...
//   if (type === "human") {
//     return {
//       role: "user",
//       content: msg.content as string,
//     };
//   }
//   if (type === "ai") {
//     // Gemini + tools ke case me content string ya array ho sakta hai
//     const content = msg.content as any;
//     // 1) Agar sirf functionCall hai, to isse skip kar do
//     if (Array.isArray(content)) {
//       const hasOnlyFunctionCall =
//         content.length &&
//         content.every((c) => c.type === "functionCall" || c.type === "tool");
//       if (hasOnlyFunctionCall) {
//         return null; // ye woh message hai jo sirf tool ko call kar raha hai
//       }
//       // 2) Agar text parts bhi hain, unko join karo
//       const textParts = content
//         .filter((c) => c.type === "text" && typeof c.text === "string")
//         .map((c) => c.text);
//       if (textParts.length) {
//         return {
//           role: "assistant",
//           content: textParts.join("\n"),
//         };
//       }
//       return null;
//     }
//     // 3) Simple string content
//     if (typeof content === "string") {
//       return {
//         role: "assistant",
//         content,
//       };
//     }
//     return null;
//   }
//   // ToolMessage / system / etc. ko skip kar do
//   return null;
// }
// export async function getThreadMessages(threadId: string) {
//   const chatbot = getChatbot();
//   const snapshot = await chatbot.getState({
//     configurable: { thread_id: threadId },
//   });
//   const values = snapshot.values as MessagesStateType;
//   const all = values.messages ?? [];
//   const simplified = all
//     .map(simplifyMessage)
//     .filter((m): m is { role: string; content: string } => !!m);
//   return simplified;
// }

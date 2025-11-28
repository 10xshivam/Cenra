import { BaseMessage } from "@langchain/core/messages";

export const simplifyMessage = (msg: BaseMessage) => {
  const type = (msg as any)._getType?.();

  if (type === "human") {
    return { role: "user", content: msg.content as string };
  }

  if (type === "ai") {
    const content = msg.content as any;
    if (typeof content === "string") {
      return { role: "assistant", content };
    }
    if (Array.isArray(content)) {
      const hasOnlyFunctionCall =
        content.length &&
        content.every((c) => c.type === "functionCall" || c.type === "tool");
      if (hasOnlyFunctionCall) return null;

      const textParts = content
        .filter((c: any) => c.type === "text")
        .map((c: any) => c.text);
      if (textParts.length) {
        return { role: "assistant", content: textParts.join("\n") };
      }
      return null;
    }
  }

  return null;
}
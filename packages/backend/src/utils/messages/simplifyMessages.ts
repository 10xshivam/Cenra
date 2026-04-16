import { BaseMessage } from "@langchain/core/messages";
import { randomUUID } from "crypto";

type SimplifiedMessage = {
  id: string;
  from: string;
  content: string;
};

export const simplifyMessage = (
  msg: BaseMessage,
): SimplifiedMessage | null => {
  const type = (msg as any)._getType?.();
  const id = randomUUID();

  if (type === "human") {
    return { 
      id, 
      from: "user", 
      content: msg.content as string 
    };
  }

  if (type === "ai") {
    const content = msg.content as any;
    if (typeof content === "string") {
      return { 
        id, 
        from: "assistant", 
        content 
      };
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
        return { 
          id, 
          from: "assistant", 
          content: textParts.join("\n") 
        };
      }
      return null;
    }
  }

  return null;
}

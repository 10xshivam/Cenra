import { Sparkles } from "lucide-react";
import {
  Message as UiMessage,
  MessageContent,
  MessageResponse,
} from "@workspace/ui/components/ai-elements/message";

interface Message {
  id: string | number;
  from: "user" | "assistant";
  content: string;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <>
      {messages.map((m) =>
        m.from === "assistant" ? (
          <div key={m.id} className="flex items-end gap-1.5 mb-4 mt-4">
            <div className="size-7 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-100 border border-neutral-300">
              <Sparkles size={12} className="text-neutral-600" />
            </div>
            <UiMessage
              from="assistant"
              className="border max-w-[75%] w-fit px-3.5 py-2.5 rounded-xl bg-white rounded-bl-none text-neutral-600"
            >
              <MessageContent>
                <MessageResponse>{m.content}</MessageResponse>
              </MessageContent>
            </UiMessage>
          </div>
        ) : (
          <UiMessage
            key={m.id}
            from="user"
            className="border max-w-[75%] w-fit px-3.5 py-2.5 rounded-xl bg-emerald-800 text-white rounded-br-none border-none ml-auto"
          >
            <MessageContent>
              <MessageResponse>{m.content}</MessageResponse>
            </MessageContent>
          </UiMessage>
        )
      )}
    </>
  );
};

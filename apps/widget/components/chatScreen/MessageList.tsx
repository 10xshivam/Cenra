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
      {messages.map((m,index) =>
        m.from === "assistant" ? (
          <div key={m.id} className="flex items-end gap-1.5 mb-4">
            <div className="size-7 rounded-full flex items-center justify-center flex-shrink-0 border bg-neutral-100 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-600">
              <Sparkles size={12} className="text-neutral-600 dark:text-neutral-200" />
            </div>
            <UiMessage
              from="assistant"
              className="border max-w-[75%] w-fit px-3.5 py-2.5 rounded-xl rounded-bl-none bg-white text-neutral-600 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-100"
            >
              <MessageContent>
                <MessageResponse>{m.content}</MessageResponse>
              </MessageContent>
            </UiMessage>
          </div>
        ) : (
          <UiMessage
            key={index}
            from="user"
            className="border max-w-[75%] w-fit px-3.5 py-2.5 rounded-xl mb-4 text-white rounded-br-none border-none ml-auto bg-[var(--widget-theme-color)]"
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

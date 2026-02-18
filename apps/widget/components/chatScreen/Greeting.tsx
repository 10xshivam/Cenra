import {
  Message as UiMessage,
  MessageContent,
  MessageResponse,
} from "@workspace/ui/components/ai-elements/message";
import { Sparkles } from "lucide-react";

export const Greeting = ({
  greetingMessage,
}: {
  greetingMessage: string;
}) => {
  return (
    <div className="flex items-end gap-1.5 mb-4">
      <div className="size-7 rounded-full flex items-center justify-center flex-shrink-0 border bg-neutral-100 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-600">
        <Sparkles size={12} className="text-neutral-600 dark:text-neutral-200" />
      </div>
      <UiMessage
        from="assistant"
        className="border max-w-[75%] w-fit px-3.5 py-2.5 rounded-xl rounded-bl-none bg-white text-neutral-600 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-100"
      >
        <MessageContent>
          <MessageResponse>{greetingMessage}</MessageResponse>
        </MessageContent>
      </UiMessage>
    </div>
  );
};

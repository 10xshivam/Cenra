import {
  Message as UiMessage,
  MessageContent,
  MessageResponse,
} from "@workspace/ui/components/ai-elements/message";
import { Sparkles } from "lucide-react";

export const Greeting = ({greetingMessage}: { greetingMessage: string }) => {
  return (
    <div className="flex items-end gap-1.5 mb-4">
      <div className="size-7 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-100 border border-neutral-300">
        <Sparkles size={12} className="text-neutral-600" />
      </div>
      <UiMessage
        from="assistant"
        className="border max-w-[75%] w-fit px-3.5 py-2.5 rounded-xl bg-white rounded-bl-none text-neutral-600"
      >
        <MessageContent>
          <MessageResponse>{greetingMessage}</MessageResponse>
        </MessageContent>
      </UiMessage>
    </div>
  );
};

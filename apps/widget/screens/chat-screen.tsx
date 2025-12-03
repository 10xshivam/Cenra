import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { Message, MessageContent, MessageResponse } from "@workspace/ui/components/ai-elements/message";
import { ChevronLeft } from "lucide-react";
import React from "react";

export const ChatScreen = () => {
  const setScreen = useWidgetScreenStore((state) => state.setScreen);
  return (
    <>
      <div className="flex items-center gap-4 border-b pb-2">
        <ChevronLeft onClick={() => setScreen("home")} />
        <h1>Chat Screen</h1>
      </div>
      <div className="h-full py-5">
        <Message from="assistant">
          <MessageContent>
            <MessageResponse>Hello, this is an AI assistant message.</MessageResponse>
          </MessageContent>
        </Message>
      </div>
    </>
  );
};

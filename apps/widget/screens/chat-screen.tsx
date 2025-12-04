"use client";

import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Message, MessageContent, MessageResponse } from "@workspace/ui/components/ai-elements/message";
import { ChevronLeft } from "lucide-react";

export const ChatScreen = () => {
  const { setCurrentScreen } = useWidgetScreenStore();
  const {workspace} = useWorkspaceStore();
  return (
    <>
      <div className="flex items-center gap-4 border-b pb-2">
        <ChevronLeft onClick={() => setCurrentScreen("home")} />
        <h1>Chat Screen</h1>
      </div>
      <div className="h-full py-5">
        <Message from="assistant">
          <MessageContent>
            <MessageResponse>{workspace?.greetMessage}</MessageResponse>
          </MessageContent>
        </Message>
      </div>
    </>
  );
};

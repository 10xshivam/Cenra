"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatHeader } from "@/components/chatScreen/ChatHeader";
import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useWidgetSessionStore } from "@/store/useWidgetSessionStore";
import {
  useConversationMessages,
  useIdentifyCustomer,
  useSendMessage,
  useStartConversation,
} from "@/hooks/useWidget";
import { Greeting } from "@/components/chatScreen/Greeting";
import { MessageLoader } from "@/components/chatScreen/MessageLoader";
import { MessageList } from "@/components/chatScreen/MessageList";
import {
  IdentityForm,
  IdentityFormData,
} from "@/components/chatScreen/IdentityForm";
import { ChatInput, ChatInputData } from "@/components/chatScreen/ChatInput";

interface ChatMessage {
  from: "user" | "assistant";
  content: string;
  id: string;
}

export const ChatScreen = () => {
  const { setCurrentScreen } = useWidgetScreenStore();
  const { workspace } = useWorkspaceStore();

  const { customerId, conversationId, setSession } = useWidgetSessionStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showIdentityForm, setShowIdentityForm] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: historyData,
    isLoading: historyLoading,
    isError: historyError,
  } = useConversationMessages(workspace?.id || "", conversationId || "");

  const startConversationMutation = useStartConversation();
  const sendMessageMutation = useSendMessage();
  const identifyCustomerMutation = useIdentifyCustomer();

  const isSendingMessage =
    startConversationMutation.isPending || sendMessageMutation.isPending;
  const isIdentifying = identifyCustomerMutation.isPending;
  const timezoneOffset = new Date().getTimezoneOffset();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const scrollToBottom = () => {
    if (!scrollContainerRef.current) return;
    setTimeout(() => {
      if (!scrollContainerRef.current) return;
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  const streamAssistantReply = useCallback((fullText: string) => {
    const id = crypto.randomUUID();
    setMessages((prev) => [...prev, { from: "assistant", content: "", id }]);

    let index = 0;
    const chunkSize = 3;

    const step = () => {
      index += chunkSize;
      const nextContent = fullText.slice(0, index);

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content: nextContent } : m))
      );

      if (index < fullText.length) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showIdentityForm, isSendingMessage]);

  useEffect(() => {
    if (historyError) {
      console.error("Error fetching messages");
      setCurrentScreen("error");
      return;
    }

    if (historyLoading || !historyData) return;

    const mapped: ChatMessage[] = (historyData.messages || []).map(
      (m: { role: string; content: string }) => ({
        id: crypto.randomUUID(),
        from: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })
    );

    setMessages(mapped);
    setShowIdentityForm(historyData.isIdentified === false);
  }, [historyLoading, historyError, historyData, setCurrentScreen]);

  const pushMessage = (from: "user" | "assistant", content: string) => {
    setMessages((prev) => [
      ...prev,
      { from, content, id: Date.now().toString() },
    ]);
  };

  const handleSendMessage = async (data: ChatInputData) => {
    if (!workspace?.id) return;

    const text = data.message.trim();
    if (showIdentityForm) return;
    pushMessage("user", text);

    try {
      if (!customerId || !conversationId) {
        const data = await startConversationMutation.mutateAsync({
          workspaceId: workspace.id,
          firstMessage: text,
        });

        const res = data?.response;

        if (res) {
          if (res.customerId || res.conversationId) {
            setSession({
              customerId: res.customerId ?? null,
              conversationId: res.conversationId ?? null,
            });
          }

          if (res.type === "need_identity") {
            setShowIdentityForm(true);
          } else if (res.reply) {
            pushMessage("assistant", res.reply);
          }
        } else {
          pushMessage("assistant", "Unable to start conversation.");
        }
        return;
      }

      const res = await sendMessageMutation.mutateAsync({
        workspaceId: workspace.id,
        conversationId,
        message: text,
      });

      if (res?.status === "ok" && res.reply) {
        // pushMessage("assistant", res.reply);
        streamAssistantReply(res.reply);
      } else if (res?.status === "expired") {
        setSession({ customerId: null, conversationId: null });
        pushMessage("assistant", "Your session expired. Starting a new chat.");
        setCurrentScreen("home");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setCurrentScreen("error");
    }
  };

  const handleIdentitySubmit = async (data: IdentityFormData) => {
    if (!workspace?.id || !customerId || !conversationId) return;

    try {
      const res = await identifyCustomerMutation.mutateAsync({
        workspaceId: workspace.id,
        customerInfo: {
          customerId,
          name: data.name.trim(),
          email: data.email.trim(),
          conversationId,
          metadata: {
            language: navigator.language,
            currentUrl: window.location.href,
            timezone,
            timezoneOffset,
          },
        },
      });

      setShowIdentityForm(false);

      if (res?.agentMessage?.content) {
        pushMessage("assistant", res.agentMessage.content);
      } else {
        pushMessage("assistant", "Thanks — how can we help next?");
      }
    } catch (err) {
      console.error("Error identifying customer:", err);
      setCurrentScreen("error");
    }
  };

  if (!workspace) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <ChatHeader setCurrentScreen={setCurrentScreen} workspace={workspace} />

      <div
        ref={scrollContainerRef}
        className="h-[calc(100vh-410px)] pt-4 overflow-y-auto px-3 space-y-2 scrollbar-w-1 scrollbar scrollbar-thumb-neutral-300 scrollbar-track-transparent"
      >
        {workspace.greetMessage && !historyLoading && (
          <Greeting greetingMessage={workspace.greetMessage} />
        )}

        {historyLoading && <MessageLoader />}

        <MessageList messages={messages} />

        {isSendingMessage && !showIdentityForm && <MessageLoader />}

        {showIdentityForm && (
          <IdentityForm
            handleIdentitySubmit={handleIdentitySubmit}
            isIdentifying={isIdentifying}
          />
        )}
      </div>

      <div className="flex flex-col items-center">
        <ChatInput
          handleSendMessage={handleSendMessage}
          isSendingMessage={isSendingMessage}
          showIdentityForm={showIdentityForm}
        />
        <p className="text-xs text-neutral-400 my-1.5 tracking-tight">
          Powered by Cenra
        </p>
      </div>
    </div>
  );
};

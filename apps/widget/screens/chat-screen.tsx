"use client";

import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import {
  Message as UiMessage,
  MessageContent,
  MessageResponse,
} from "@workspace/ui/components/ai-elements/message";
import { IconPaperPlane2 } from "@workspace/ui/components/icons";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getConversationMessages,
  identifyWidgetCustomer,
  sendMessage,
  startWidgetConversation,
} from "@/lib/api/widget";

interface ChatMessage {
  from: "user" | "assistant";
  content: string;
  id: string;
}

export const ChatScreen = () => {
  const { setCurrentScreen } = useWidgetScreenStore();
  const { workspace } = useWorkspaceStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showIdentityForm, setShowIdentityForm] = useState(false);
  const [identityName, setIdentityName] = useState<string>("");
  const [identityEmail, setIdentityEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 50);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showIdentityForm]);

  useEffect(() => {
    const storedCustomerId = localStorage.getItem("customerId");
    const storedConversationId = localStorage.getItem("conversationId");

    if (storedCustomerId) setCustomerId(storedCustomerId);
    if (storedConversationId) {
      setConversationId(storedConversationId);
      fetchConversationHistory(storedConversationId);
    }
  }, []);

  const fetchConversationHistory = async (convId: string) => {
    if (!workspace?.id || !convId) return;

    try {
      setLoadingHistory(true);
      const res = await getConversationMessages(workspace.id, convId);

      const mapped: ChatMessage[] = (res.messages || []).map(
        (m: { role: string; content: string }) => ({
          id: crypto.randomUUID(),
          from: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })
      );

      setMessages(mapped);
      if (res.isIdentified === false) {
        setShowIdentityForm(true);
      } else {
        setShowIdentityForm(false);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const pushMessage = (from: "user" | "assistant", content: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { from, content, id: Date.now().toString() },
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputRef.current) return;
    const text = inputRef.current.value.trim();
    if (text === "") return;

    if (showIdentityForm) return;

    pushMessage("user", text);
    inputRef.current.value = "";
    setLoading(true);

    try {
      if (!customerId || !conversationId) {
        const data = await startWidgetConversation(workspace!.id, text);
        const res = data.response;

        if (res) {
          if (res.customerId) {
            localStorage.setItem("customerId", res.customerId);
            setCustomerId(res.customerId);
          }
          if (res.conversationId) {
            localStorage.setItem("conversationId", res.conversationId);
            setConversationId(res.conversationId);
          }

          if (res.type === "need_identity") {
            setShowIdentityForm(true);
          }
        } else {
          pushMessage("assistant", "Unable to start conversation");
        }
        return;
      }

      const res = await sendMessage(workspace!.id, conversationId!, text);

      if (res?.status === "ok" && res.reply) {
        pushMessage("assistant", res.reply);
      } else if (res?.status === "expired") {
        localStorage.removeItem("customerId");
        localStorage.removeItem("conversationId");
        setCustomerId(null);
        setConversationId(null);
        pushMessage("assistant", "Your session expired");
        setCurrentScreen("home");
      }
    } catch (error) {
      console.error(error);
      pushMessage("assistant", "Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;
    if (!identityName.trim() || !identityEmail.trim()) {
      alert("Name and email are required");
      return;
    }
    setLoading(true);

    try {
      const res = await identifyWidgetCustomer(workspace!.id, {
        customerId,
        name: identityName.trim(),
        email: identityEmail.trim(),
        conversationId: conversationId!,
      });
      if (res) {
        setShowIdentityForm(false);
        setIdentityName("");
        setIdentityEmail("");
        if (res.agentMessage?.content) {
          pushMessage("assistant", res.agentMessage.content);
        } else {
          pushMessage("assistant", "Thanks — how can we help next?");
        }
      }
    } catch (err) {
      console.error(err);
      pushMessage("assistant", "Network error submitting identity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 border-b pb-3">
        <ChevronLeft size={20} onClick={() => setCurrentScreen("home")} />
        <h1 className="text-medium text-neutral-500 text-lg">Chat</h1>
      </div>

      <div
        ref={scrollContainerRef}
        className="h-[calc(100vh-440px)] py-4 overflow-y-auto px-2 space-y-2"
      >
        {workspace?.greetMessage && !loadingHistory && (
          <UiMessage from="assistant">
            <MessageContent>
              <MessageResponse>{workspace.greetMessage}</MessageResponse>
            </MessageContent>
          </UiMessage>
        )}

        {/* Loading history indicator */}
        {loadingHistory && (
          <UiMessage from="assistant">
            <MessageContent>
              <MessageResponse>Loading your previous chat…</MessageResponse>
            </MessageContent>
          </UiMessage>
        )}

        {/* Render messages */}
        {messages.map((m) => (
          <UiMessage
            key={m.id}
            from={m.from === "assistant" ? "assistant" : "user"}
          >
            <MessageContent>
              <MessageResponse>{m.content}</MessageResponse>
            </MessageContent>
          </UiMessage>
        ))}
        {showIdentityForm && (
          <div className="p-4 bg-white border rounded-md mx-3 mb-3">
            <h3 className="font-medium mb-2">One more step</h3>
            <p className="text-sm text-neutral-500 mb-3">
              Before we continue, please share your name & email.
            </p>
            <form onSubmit={handleIdentitySubmit} className="space-y-2">
              <input
                value={identityName}
                onChange={(e) => setIdentityName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Your name"
              />
              <input
                value={identityEmail}
                onChange={(e) => setIdentityEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="you@example.com"
                type="email"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-2 rounded-md bg-emerald-600 text-white disabled:opacity-60"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="w-[95%] h-24 border rounded-2xl absolute bottom-2.5 left-2.5 bg-white">
        <textarea
          ref={inputRef}
          className="w-full h-full rounded-3xl p-4 resize-none outline-none border-0 focus:ring-0"
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <IconPaperPlane2
          onClick={handleSendMessage}
          size="20px"
          className="absolute bottom-4 right-4 text-neutral-400 hover:text-emerald-700 cursor-pointer"
        />
      </div>
    </>
  );
};

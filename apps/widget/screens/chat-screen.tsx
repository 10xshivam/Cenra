"use client";

import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import {
  Message as UiMessage,
  MessageContent,
  MessageResponse,
} from "@workspace/ui/components/ai-elements/message";
import { Forward, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getConversationMessages,
  identifyWidgetCustomer,
  sendMessage,
  startWidgetConversation,
} from "@/lib/api/widget";
import { ChatHeader } from "@/components/chatScreen/ChatHeader";

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
  const [inputText, setInputText] = useState("");
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
    setInputText("");
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

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const isInputEmpty = inputText.trim() === '';

  return (
    <div className="flex flex-col">
      <ChatHeader setCurrentScreen={setCurrentScreen} workspace={workspace!} />

      <div
        ref={scrollContainerRef}
        className="h-[calc(100vh-410px)] py-4 overflow-y-auto px-3 space-y-2 scrollbar-w-1 scrollbar scrollbar-thumb-neutral-300 scrollbar-track-transparent"
      >
        {workspace?.greetMessage && !loadingHistory && (
          <div className="flex items-end gap-1.5 mb-4">
            <div className="size-7 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-100 border border-neutral-300">
              <Sparkles size={12} className="text-neutral-600" />
            </div>
            <UiMessage
              from="assistant"
              className="border max-w-[75%] w-fit px-3.5 py-2.5 rounded-xl bg-white rounded-bl-none text-neutral-600"
            >
              <MessageContent>
                <MessageResponse>{workspace.greetMessage}</MessageResponse>
              </MessageContent>
            </UiMessage>
          </div>
        )}

        {/* Loading history indicator */}
        {loadingHistory && (
          <div className="flex w-full justify-start">
            <div className="flex max-w-[85%] items-end gap-3">
              <div className="size-7 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-100 border border-neutral-300">
                <Sparkles size={12} className="text-neutral-600" />
              </div>
              <div className="bg-white px-3.5 py-3 rounded-xl rounded-bl-none border flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}

        {/* Render messages */}
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
                  <MessageResponse className="">{m.content}</MessageResponse>
                </MessageContent>
              </UiMessage>
            </div>
          ) : (
            <UiMessage
              key={m.id}
              from="user"
              className="border max-w-[75%] w-fit px-3.5 py-2.5 rounded-xl bg-emerald-800 text-white rounded-br-none border-none"
            >
              <MessageContent>
                <MessageResponse>{m.content}</MessageResponse>
              </MessageContent>
            </UiMessage>
          )
        )}
        {loading && !showIdentityForm && (
          <div className="flex w-full justify-start">
            <div className="flex max-w-[85%] items-end gap-3">
              <div className="size-7 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-100 border border-neutral-300">
                <Sparkles size={12} className="text-neutral-600" />
              </div>
              <div className="bg-white px-3.5 py-3 rounded-xl rounded-bl-none border flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        {showIdentityForm && (
          <div className="flex items-end gap-1.5 mb-2">
            <div className="size-7 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-100 border border-neutral-300">
              <Sparkles size={12} className="text-neutral-600" />
            </div>
            <div className="px-3.5 py-3 bg-white border rounded-xl rounded-bl-none mt-2 max-w-[75%] w-full">
              <p className="text-sm mb-3">
                Before we continue, please share your name & email.
              </p>
              <form onSubmit={handleIdentitySubmit} className="space-y-2">
                <input
                  value={identityName}
                  onChange={(e) => setIdentityName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-neutral-300 text-neutral-600 transition-colors duration-300"
                  placeholder="Your name"
                />
                <input
                  value={identityEmail}
                  onChange={(e) => setIdentityEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-neutral-300 text-neutral-600 transition-colors duration-300"
                  placeholder="you@example.com"
                  type="email"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-3 py-2 rounded-lg bg-emerald-800 text-white disabled:opacity-60 text-sm"
                  >
                    {loading ? "Submitting..." : "Submit & Continue"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-[95%] border rounded-2xl bg-white">
          <textarea
            ref={inputRef}
            className="w-full p-3 resize-none outline-none border-0 focus:ring-0 text-sm text-neutral-600 scrollbar-w-1 scrollbar scrollbar-thumb-neutral-300 scrollbar-track-transparent"
            placeholder="Type your message..."
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="w-full pb-1.5 px-1.5 flex justify-end">
          <button  onClick={handleSendMessage} disabled={isInputEmpty} className="rounded-full disabled:bg-neutral-300/50 bg-emerald-800 hover:bg-emerald-800 disabled:text-neutral-600 text-white p-2">
          <Forward size={14} strokeWidth={3} />
          </button>

          </div>
        </div>
        <p className="text-xs text-neutral-400 my-1.5 tracking-tight">
          Powered by Cenra
        </p>
      </div>
    </div>
  );
};

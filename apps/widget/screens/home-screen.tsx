"use client";

import { getConversationMessages } from "@/lib/api/widget";
import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Button } from "@workspace/ui/components/button";
import { IconPaperPlane, IconX } from "@workspace/ui/components/icons";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type WidgetMessage = {
  role: string;
  content: string;
  createdAt: string; // make sure backend sends this
};

interface RecentInfo {
  lastMessage: string;
  lastMessageAt: string; // ISO
}

const formatTimeAgo = (isoDate: string) => {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
};

export const HomeScreen = () => {
  const { setCurrentScreen } = useWidgetScreenStore();
  const { workspace } = useWorkspaceStore();
  const [recent, setRecent] = useState<RecentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadRecent = async () => {
      if (!workspace?.id) return;

      const customerId = localStorage.getItem("customerId");
      const conversationId = localStorage.getItem("conversationId");

      // koi existing customer nahi → recent card mat dikhhao
      if (!customerId || !conversationId) {
        setRecent(null);
        return;
      }

      try {
        setLoading(true);
        const res = await getConversationMessages(
          workspace.id,
          conversationId
        );

        const messages: WidgetMessage[] = res.messages || [];
        if (!messages.length) {
          setRecent(null);
          return;
        }

        // last non-empty message pick karo (user ya assistant)
        const last = [...messages]
          .reverse()
          .find((m) => m.content && m.content.trim().length > 0);

        if (!last) {
          setRecent(null);
          return;
        }

        setRecent({
          lastMessage: last.content,
          lastMessageAt: last.createdAt,
        });
      } catch (err) {
        console.error("Failed to load recent conversation", err);
        setRecent(null);
      } finally {
        setLoading(false);
      }
    };

    loadRecent();
  }, [workspace?.id]);

  
  const handleOpenChat = () => {
    setCurrentScreen("chat");
  };

  const workspaceInitial =
    workspace?.name?.trim()?.charAt(0)?.toUpperCase() ?? "A";

  return (
    <>
      <div className="absolute top-0 left-0 min-h-2/4 w-full bg-gradient-to-b from-emerald-950 to-neutral-50 rounded-t-3xl z-0" />
      <div className="w-full relative z-10 flex justify-between items-center mb-20">
        <h3 className="text-white text-2xl font-semibold">{workspace?.name}</h3>
        <IconX size="20px" color="white" />
      </div>
      <h4 className="relative z-10 text-white text-4xl tracking-tight font-medium">
        Hi there👋 <br /> How can we help?
      </h4>

       {/* If we have a recent conversation → show card like the screenshot */}
      {recent && !loading ? (
        <div className="mt-4 relative z-10 w-full flex flex-col rounded-2xl bg-white shadow-sm border px-3 py-3 hover:bg-neutral-50 transition gap-2">
          <p className="text-xs font-medium mb-1">
            Recent message
          </p>

          <button
            type="button"
            onClick={handleOpenChat}
            className="w-full flex items-center justify-between hover:bg-neutral-50 transition"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Avatar */}
              <div className="h-9 w-9 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold">
                {workspaceInitial}
              </div>

              {/* Text content */}
              <div className="flex flex-col items-start overflow-hidden">
                <p className="text-sm text-neutral-900 truncate max-w-[220px]">
                  {recent.lastMessage}
                </p>
                <p className="text-xs text-neutral-500">
                  {workspace?.name || "Support"} ·{" "}
                  {formatTimeAgo(recent.lastMessageAt)}
                </p>
              </div>
            </div>

            <ChevronRight size={18} className="text-neutral-400 flex-shrink-0" />
          </button>

          {/* Optional: link for starting a fresh chat */}
          {/* <button
            className="mt-3 text-xs text-neutral-500 underline"
            onClick={handleOpenChat}
          >
            Start a new conversation
          </button> */}
        </div>
      ) : (
        // Otherwise, default “Ask a question” CTA
      <Button onClick={handleOpenChat} variant="secondary" className="relative text-neutral-500 z-10 w-full h-12 px-3 py-3 flex justify-between items-center mt-8 rounded-lg shadow-md hover:text-emerald-700 bg-white hover:bg-neutral-50 active:scale-95 transition-all">
          Ask a Question
        <IconPaperPlane size="20px"/>
      </Button>
        
      )}


      <div className="w-full relative z-10 mt-7">
        <p className="text-sm text-neutral-400 tracking-tight mb-2">
          What's New
        </p>
        <div className="flex gap-4">
          <div className="w-full h-fit  p-2.5 rounded-lg flex flex-col gap-1 bg-neutral-100 border">
            <div className="rounded-sm px-2.5 py-1 bg-neutral-50 w-fit text-xs mb-1 border">
              1
            </div>
            <h5 className="text-xs font-medium tracking-tight text-neutral-700">
              Smart AI Support Inbox
            </h5>
            <p className="text-[10px] text-neutral-500 tracking-tight leading-tight">
              Cenra greets customers, answers common questions, and escalates
              tricky conversations to your team when needed.
            </p>
          </div>
          <div className="w-full h-fit  p-2.5 rounded-lg flex flex-col gap-1 bg-neutral-100 border">
            <div className="rounded-sm px-2 py-1 bg-neutral-50 w-fit text-xs mb-1 border">
              2
            </div>
            <h5 className="text-xs font-medium tracking-tight text-neutral-700">
              Cenra Knowledge Engine
            </h5>
            <p className="text-[10px] text-neutral-500 tracking-tight leading-tight">
              Plug in help docs, FAQs, and release notes so Cenra can respond
              using your real product knowledge, not guesswork.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full relative z-10 mt-7">
        <p className="text-sm text-neutral-400 tracking-tight mb-2">
          Featured Articles
        </p>
        <div className="flex flex-col gap-2">
          <div className="w-full h-12  p-3 rounded-lg flex justify-between items-center gap-1 bg-neutral-100 border">
            <h5 className="text-sm font-medium tracking-tight text-neutral-700">
              Getting Started with Cenra
            </h5>
            <span className="flex items-center gap-0.5 text-emerald-700 font-medium">
              <p className="text-xs">Open Guide</p>
              <ChevronRight className="size-3 inline" />
            </span>
          </div>
          <div className="w-full h-12  p-3 rounded-lg flex justify-between items-center gap-1 bg-neutral-100 border">
            <h5 className="text-sm font-medium tracking-tight text-neutral-700">
              Best Practices for AI Support
            </h5>
            <span className="flex items-center gap-0.5 text-emerald-700 font-medium">
              <p className="text-xs">Read Tips</p>
              <ChevronRight className="size-3 inline" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

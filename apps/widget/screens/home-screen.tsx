"use client";

import { AskQuestionCard } from "@/components/homeScreen/AskQuestionCard";
import { FeaturedArticleCards } from "@/components/homeScreen/FeaturedArticleCards";
import { RecentMessageCard } from "@/components/homeScreen/RecentMessageCard";
import { WhatsNewCards } from "@/components/homeScreen/WhatsNewCards";
import { getLastMessage } from "@/lib/api/widget";
import { RecentMessageSkeleton } from "@/skeletons/RecentMessageSkeleton";
import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { RecentInfo } from "@/types/homeScreen";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

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

      if (!customerId || !conversationId) {
        return;
      }

      try {
        setLoading(true);
        const response = await getLastMessage(workspace.id, conversationId);

        if (!response) {
          return;
        }

        setRecent({
          lastMessage: response.lastMessage,
          lastMessageAt: response.lastMessageAt,
        });
      } catch (err) {
        console.error("Failed to load recent conversation", err);
        setRecent(null);
        setCurrentScreen("error");
      } finally {
        setLoading(false);
      }
    };

    loadRecent();
  }, [workspace?.id]);

  const handleOpenChat = () => {
    setCurrentScreen("chat");
  };

  return (
    <div className="relative p-7 h-full w-full">
      <div className="absolute top-0 left-0 min-h-2/4 w-full bg-gradient-to-b from-emerald-950 to-neutral-50 rounded-t-3xl z-0" />
      <div className="w-full relative z-10 flex justify-between items-center mb-20">
        <h3 className="text-white text-2xl font-semibold">{workspace?.name}</h3>
        <X
          className="text-white/90 hover:text-white active:-scale-95"
          strokeWidth={2}
        />
      </div>
      <h4 className="relative z-10 text-white/70 text-4xl tracking-tight font-medium mb-5">
        Hello there. <br /> <span className="text-white">How can we help?</span>
      </h4>

      <div className="relative z-10 w-full flex flex-col rounded-lg bg-white/85 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 px-4 py-3.5 gap-1.5 group cursor-pointer">
        {loading ? (
          <RecentMessageSkeleton />
        ) : recent ? (
          <RecentMessageCard
            recent={recent}
            workspace={workspace}
            handleOpenChat={handleOpenChat}
          />
        ) : (
          <AskQuestionCard handleOpenChat={handleOpenChat} />
        )}
      </div>
      <WhatsNewCards />
      <FeaturedArticleCards />
    </div>
  );
};

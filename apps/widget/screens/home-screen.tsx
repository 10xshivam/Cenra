"use client";

import { AskQuestionCard } from "@/components/homeScreen/AskQuestionCard";
import { FeaturedArticleCards } from "@/components/homeScreen/FeaturedArticleCards";
import { RecentMessageCard } from "@/components/homeScreen/RecentMessageCard";
import { WhatsNewCards } from "@/components/homeScreen/WhatsNewCards";
import { RecentMessageSkeleton } from "@/skeletons/RecentMessageSkeleton";
import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useWidgetSessionStore } from "@/store/useWidgetSessionStore";
import { useLastMessage } from "@/hooks/useWidget";
import { X } from "lucide-react";
import { useEffect, useMemo } from "react";

export interface RecentInfo {
  lastMessage: string;
  lastMessageAt: string;
}

export const HomeScreen = () => {
  const { setCurrentScreen } = useWidgetScreenStore();
  const { workspace } = useWorkspaceStore();
  const { conversationId } = useWidgetSessionStore();

  const {
    data,
    isLoading,
    isError,
  } = useLastMessage(workspace?.id || "", conversationId || "");

  useEffect(() => {
    if (isError) {
      setCurrentScreen("error");
    }
  }, [isError, setCurrentScreen]);

  const recent: RecentInfo | null = useMemo(() => {
    if (!data || !data.lastMessage) return null;

    return {
      lastMessage: data.lastMessage,
      lastMessageAt: data.lastMessageAt,
    };
  }, [data]);

  const handleOpenChat = () => {
    setCurrentScreen("chat");
  };

  return (
    <div className="relative p-7 h-full w-full">
      <div className="absolute top-0 left-0 min-h-2/4 w-full bg-gradient-to-b from-emerald-950 to-neutral-50 rounded-t-3xl z-0" />

      <div className="w-full relative z-10 flex justify-between items-center mb-20">
        <h3 className="text-white text-2xl font-semibold">
          {workspace?.name}
        </h3>
        <X
          className="text-white/90 hover:text-white active:-scale-95 cursor-pointer"
          strokeWidth={2}
          // onClick={closeWidget} // agar close behaviour chahiye
        />
      </div>

      <h4 className="relative z-10 text-white/70 text-4xl tracking-tight font-medium mb-5">
        Hello there. <br /> <span className="text-white">How can we help?</span>
      </h4>

      <div className="relative z-10 w-full flex flex-col rounded-lg bg-white/85 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 px-4 py-3.5 gap-1.5 group cursor-pointer">
        {isLoading ? (
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


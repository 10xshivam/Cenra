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
  const brandName = workspace?.brandName || workspace?.name || "Cenra";
  const whatsNewSection = workspace?.whatsNewSection;
  const featuredArticlesSection = workspace?.featuredArticlesSection;
  const gradientFrom = workspace?.gradientFrom || "#052e2b";
  const themeSurface = workspace?.themeMode === "dark" ? "#171717" : "#fafafa";

  const showWhatsNewSection = Boolean(
    whatsNewSection &&
    (whatsNewSection.enabled ?? true) &&
    Array.isArray(whatsNewSection.items) &&
    whatsNewSection.items.length > 0
  );
  const showFeaturedArticlesSection = Boolean(
    featuredArticlesSection &&
    (featuredArticlesSection.enabled ?? true) &&
    Array.isArray(featuredArticlesSection.items) &&
    featuredArticlesSection.items.length > 0
  );
  const visibleWhatsNewSection = showWhatsNewSection ? whatsNewSection! : null;
  const visibleFeaturedArticlesSection = showFeaturedArticlesSection
    ? featuredArticlesSection!
    : null;

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
    <div className="relative p-7 min-h-full max-h-full w-full overflow-y-auto rounded-3xl bg-neutral-50 dark:bg-neutral-900 transition-colors no-scrollbar">
      <div
        className="absolute top-0 left-0 h-[52%] w-full rounded-t-3xl z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${gradientFrom} 0%, ${themeSurface} 90%, ${themeSurface} 100%)`,
        }}
      />

      <div className="w-full relative z-10 flex justify-between items-center mb-20">
        <h3 className="text-white text-2xl font-semibold truncate max-w-[280px]">
          {brandName}
        </h3>
        <X
          className="text-white/90 hover:text-white cursor-pointer"
          strokeWidth={2}
          onClick={() => window.parent.postMessage({ type: "close" }, "*")}
        />
      </div>

      <h4 className="relative z-10 text-white/70 text-4xl tracking-tight font-medium mb-5">
        Hello there. <br /> <span className="text-white">How can we help?</span>
      </h4>

      <div
        className="relative z-10 w-full flex flex-col rounded-lg hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 px-4 py-3.5 gap-1.5 group cursor-pointer bg-white/85 border border-neutral-200 dark:bg-neutral-900/80 dark:border-neutral-700"
      >
        {isLoading ? (
          <RecentMessageSkeleton />
        ) : recent ? (
          <RecentMessageCard
            recent={recent}
            workspace={workspace}
            handleOpenChat={handleOpenChat}
          />
        ) : (
          <AskQuestionCard
            handleOpenChat={handleOpenChat}
            brandName={brandName}
            companyLogoUrl={workspace?.companyLogoUrl}
          />
        )}
      </div>

      {visibleWhatsNewSection ? (
        <WhatsNewCards section={visibleWhatsNewSection} />
      ) : null}
      {visibleFeaturedArticlesSection ? (
        <FeaturedArticleCards section={visibleFeaturedArticlesSection} />
      ) : null}
    </div>
  );
};

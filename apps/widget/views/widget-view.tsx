"use client";

import { ChatScreen } from "@/screens/chat-screen";
import { HomeScreen } from "@/screens/home-screen";
import { LoadingScreen } from "@/screens/loading-screen";
import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { WidgetScreen } from "@/types/widget";
import { JSX } from "react/jsx-dev-runtime";

export const WidgetView = ({ workspaceId }: { workspaceId: string }) => {
  const { currentScreen } = useWidgetScreenStore();

  const screenComponents: Record<WidgetScreen, JSX.Element> = {
    loading: <LoadingScreen workspaceId={workspaceId} />,
    home: <HomeScreen />,
    chat: <ChatScreen />
  };

  return (
    <div className="h-fit min-h-[700px] w-[410px] rounded-3xl shadow-sm relative bg-neutral-50 p-7">
      {screenComponents[currentScreen]}
    </div>
  );
};

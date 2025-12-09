"use client";

import { useEffect } from "react";
import { useWidgetInitialization } from "@/hooks/useWidget";
import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useWidgetSessionStore } from "@/store/useWidgetSessionStore";
import { Loader } from "@workspace/ui/components/loader";

export const LoadingScreen = ({ workspaceId }: { workspaceId: string }) => {
  const { setCurrentScreen } = useWidgetScreenStore();
  const { setWorkspace } = useWorkspaceStore();
  const { customerId, setCustomerId } = useWidgetSessionStore();

  const { data, isLoading, isError } = useWidgetInitialization(
    workspaceId,
    customerId || undefined
  );

  useEffect(() => {
    if (isError) {
      setCurrentScreen("error");
      return;
    }

    if (isLoading || !data) return;

    if (data.workspace) {
      setWorkspace(data.workspace);
    }

    if (!data.session?.active) {
      setCustomerId(null);
      setCurrentScreen("home");
      return;
    }

    if (data.session.active && data.session.customerId) {
      setCustomerId(data.session.customerId);
      setCurrentScreen("chat");
    }
  }, [
    isError,
    isLoading,
    data,
    setCurrentScreen,
    setWorkspace,
    setCustomerId,
  ]);

  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <Loader />
    </div>
  );
};


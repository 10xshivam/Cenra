"use client";

import { useWidgetInitialization } from "@/hooks/useWidgetSettings";
import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Loader } from "@workspace/ui/components/loader";
import { useEffect, useState } from "react";

export const LoadingScreen = ({ workspaceId }: { workspaceId: string }) => {
  const [isReady, setIsReady] = useState(false); 
  const [customerId, setCustomerId] = useState<string>("");
  const { setCurrentScreen } = useWidgetScreenStore();
  const { setWorkspace } = useWorkspaceStore();

  useEffect(() => {
    const stored = localStorage.getItem("customerId") ?? "";
    setCustomerId(stored);
    setIsReady(true);
  }, []);

  const { data, isLoading, isError } = useWidgetInitialization(
    workspaceId,
    customerId,
    {
      enabled: isReady,
    }
  );

  useEffect(() => {
    if (!isReady || isLoading || !data) return;

    if (data.workspace) {
      setWorkspace(data.workspace);
    }

    if (!data.session?.active) {
      localStorage.removeItem("customerId");
      setCurrentScreen("home");
      return;
    }

    if (data.session.active && data.session.customerId) {
      localStorage.setItem("customerId", data.session.customerId);
      setCurrentScreen("chat");
    }
  }, [isReady, isLoading, data, setCurrentScreen]);

  return (
    <div className="absolute inset-0 flex justify-center items-center ">
      <Loader />
    </div>
  );
};

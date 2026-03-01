"use client";

import { use } from "react";
import { WidgetView } from "@/views/widget-view";

interface Props {
  searchParams: Promise<{
    workspaceId: string;
  }>;
}

export default function Page({ searchParams }: Props) {
  const { workspaceId } = use(searchParams);

  return (
    <WidgetView workspaceId={workspaceId} />
  );
};

"use client";

import { ArrowRightIcon, ArrowUpIcon, CheckIcon, ListIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useGetConversations } from "@/hooks/useConversation";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useState } from "react";
import { formatTime } from "@/lib/formatTime";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { getAvatarColors } from "@/lib/getAvatarColors";
import { ConversationSkeleton } from "@/skeletons/conversationSkeleton";
import { EmptyConversations } from "./empty-conversations";

export interface ConversationItems {
  id: string;
  workspaceId: string;
  customerId: string;
  threadId: string;
  status: "unresolved" | "escalated" | "resolved";
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    workspaceId: string;
    name: string;
    email: string;
    expiresAt: string;
  };
  lastMessage: {
    role: string;
    content: string;
    createdAt: string;
  };
}

export const ConversationMenu = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { workspace } = useWorkspaceStore();
  const { data, isLoading } = useGetConversations(
    workspace?.id ?? "",
    selectedStatus
  );
  const pathname = usePathname();
  const conversations: ConversationItems[] = data?.conversations ?? [];

  return (
    <div className="flex flex-col h-full w-full">
      <div className="border-b h-14 w-full flex items-center px-4 gap-2">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="h-7 border border-neutral-300 bg-neutral-400/10 rounded-lg px-3 shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-neutral-200">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="shadow-none rounded-xl border border-neutral-300 bg-neutral-100 ">
            <div className="border border-neutral-200 rounded-lg bg-white p-1">
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <ListIcon
                    size={17}
                    strokeWidth={3}
                    className="text-neutral-400"
                  />
                  <span className="text-sm text-neutral-700 font-medium tracking-tight">
                    All
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="unresolved">
                <div className="flex items-center gap-2">
                  <ArrowRightIcon
                    size={17}
                    strokeWidth={3.5}
                    className="text-red-600"
                  />
                  <span className="text-sm text-neutral-700 font-medium tracking-tight">
                    Unresolved
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="escalated">
                <div className="flex items-center gap-2">
                  <ArrowUpIcon
                    size={17}
                    strokeWidth={3.5}
                    className="text-yellow-600"
                  />
                  <span className="text-sm text-neutral-700 font-medium tracking-tight">
                    Escalated
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="resolved">
                <div className="flex items-center gap-2">
                  <CheckIcon
                    size={17}
                    strokeWidth={3.5}
                    className="text-green-600"
                  />
                  <span className="text-sm text-neutral-700 font-medium tracking-tight">
                    Resolved
                  </span>
                </div>
              </SelectItem>
            </div>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 flex w-full flex-col overflow-y-auto gap-1.5 p-1.5">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <ConversationSkeleton key={i} />
            ))}
          </div>
        ) : conversations.length > 0 ? (
          conversations.map((conversation: ConversationItems) => (
            <Link
              href={`/inbox/${conversation.id}`}
              key={conversation.id}
              className={`h-[4.3rem] relative w-full flex items-center p-4 gap-2 justify-between bg-neutral-400/5  rounded-xl border  hover:border-neutral-300 cursor-pointer ${pathname === `/inbox/${conversation.id}` ? "border-neutral-300" : "border-neutral-300/15"}`}
            >
              {pathname === `/inbox/${conversation.id}` && (
                <div className="absolute inset-y-3 left-0 w-1 h-2/3 bg-neutral-300 rounded-e-sm" />
              )}
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full text-sm size-10 font-bold border ${getAvatarColors(conversation.id)} flex justify-center items-center`}
                >
                  {conversation.customer.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <span className="font-semibold text-sm tracking-tight text-neutral-700">
                    {conversation.customer.name}
                  </span>
                  <span className="tracking-tight text-xs line-clamp-1 text-neutral-600">
                    {conversation.lastMessage?.content}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end h-full min-w-10">
                <span className="text-xs font-medium text-neutral-500 tracking-tight">
                  {formatTime(conversation.lastMessage?.createdAt)}
                </span>
                {conversation.status === "resolved" && (
                  <CheckIcon
                    size={17}
                    strokeWidth={3.5}
                    className="text-green-600"
                  />
                )}
                {conversation.status === "escalated" && (
                  <ArrowUpIcon
                    size={17}
                    strokeWidth={3.5}
                    className="text-yellow-600"
                  />
                )}
                {conversation.status === "unresolved" && (
                  <ArrowRightIcon
                    size={17}
                    strokeWidth={3.5}
                    className="text-red-600"
                  />
                )}
              </div>
            </Link>
          ))
        ) : (
          <EmptyConversations />
        )}
      </div>
    </div>
  );
};

import { formatTime } from "@/lib/formatTime";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

interface RecentMessageProps {
  recent: {
    lastMessage: string;
    lastMessageAt: string;
  };
  workspace: {
    name?: string;
  } | null;
  handleOpenChat: () => void;
}

export const RecentMessageCard = ({
  recent,
  workspace,
  handleOpenChat,
}: RecentMessageProps) => {
  return (
    <>
      <p className="text-sm font-medium tracking-tight text-neutral-600">
        Recent message
      </p>
      <button
        type="button"
        onClick={handleOpenChat}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2 overflow-hidden cursor-pointer">
          <div className="h-10 w-10 rounded-full  flex items-center justify-center text-xs font-semibold">
            <Image
              src="https://avatar.vercel.sh/c"
              alt="avatar"
              width={39}
              height={39}
              className="rounded-md shadow-sm"
            />
          </div>
          <div className="flex flex-col items-start overflow-hidden">
            <p className="text-sm text-neutral-700 truncate tracking-tight max-w-[240px]">
              {recent.lastMessage}
            </p>
            <p className="text-[13px] text-neutral-500 ">
              {workspace?.name || "Support"} •{" "}
              {formatTime(recent.lastMessageAt)}
            </p>
          </div>
        </div>
        <ChevronRight
          size={18}
          className="text-neutral-400 flex-shrink-0 group-hover:text-emerald-700 transition-colors"
        />
      </button>
    </>
  );
};

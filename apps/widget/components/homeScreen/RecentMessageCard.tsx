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
    brandName?: string | null;
    companyLogoUrl?: string | null;
  } | null;
  handleOpenChat: () => void;
}

export const RecentMessageCard = ({
  recent,
  workspace,
  handleOpenChat,
}: RecentMessageProps) => {
  const brandName = workspace?.brandName || workspace?.name || "Support";

  return (
    <>
      <p className="text-neutral-600 dark:text-neutral-200 text-sm font-medium tracking-tight">
        Recent message
      </p>
      <button
        type="button"
        onClick={handleOpenChat}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2 overflow-hidden cursor-pointer">
          <div className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-semibold">
            {workspace?.companyLogoUrl ? (
              <img
                src={workspace.companyLogoUrl ?? '/cenra-ai.png'}
                alt={`${brandName} logo`}
                className="h-[39px] w-[39px] rounded-full shadow object-cover"
              />
            ) : (
              <Image
                src="/cenra-ai.png"
                alt="avatar"
                width={39}
                height={39}
                className="rounded-full shadow"
              />
            )}
          </div>
          <div className="flex flex-col items-start overflow-hidden">
            <p
              className="text-neutral-700 dark:text-neutral-100 text-sm truncate tracking-tight max-w-[240px]"
            >
              {recent.lastMessage}
            </p>
            <p
              className="text-neutral-500 dark:text-neutral-300 text-[13px]"
            >
              {brandName} - {formatTime(recent.lastMessageAt)}
            </p>
          </div>
        </div>
        <ChevronRight
          size={18}
          className="text-neutral-400 dark:text-neutral-300 group-hover:text-[var(--widget-theme-color)] dark:group-hover:text-[var(--widget-theme-color)] flex-shrink-0 transition-colors"
        />
      </button>
    </>
  );
};

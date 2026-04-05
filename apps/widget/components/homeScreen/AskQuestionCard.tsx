import { ChevronRight } from "lucide-react";
import Image from "next/image";

interface AskQuestionCardProps {
  handleOpenChat: () => void;
  brandName: string;
  companyLogoUrl?: string | null;
}

export const AskQuestionCard = ({
  handleOpenChat,
  brandName,
  companyLogoUrl,
}: AskQuestionCardProps) => {
  return (
    <button
      type="button"
      onClick={handleOpenChat}
      className="w-full flex items-center justify-between cursor-pointer"
    >
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex flex-col items-start overflow-hidden">
            <p className="text-neutral-700 dark:text-neutral-100 text-sm font-medium truncate tracking-tight max-w-[240px]">
              Ask a Question
            </p>
            <p className="text-neutral-500 dark:text-neutral-300 text-[13px] truncate max-w-[240px]">
              {brandName} AI Agent and team can help you
            </p>
          </div>
        </div>

        {companyLogoUrl ? (
          <img
            src={companyLogoUrl}
            alt={`${brandName} logo`}
            className="hidden md:block h-[39px] w-[39px] rounded-full shadow-sm mr-1 object-cover"
          />
        ) : (
          <Image
            src="/cenra-ai.png"
            alt="avatar"
            width={39}
            height={39}
            className="hidden md:block rounded-full shadow-sm mr-1"
          />
        )}
      </div>

      <ChevronRight
        size={18}
        className="text-neutral-400 dark:text-neutral-300 group-hover:text-[var(--widget-theme-color)] dark:group-hover:text-[var(--widget-theme-color)] flex-shrink-0 transition-colors"
      />
    </button>
  );
};

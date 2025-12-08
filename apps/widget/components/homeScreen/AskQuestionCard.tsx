import { ChevronRight } from "lucide-react";
import Image from "next/image";

interface AskQuestionCardProps {
  handleOpenChat: () => void;
}

export const AskQuestionCard = ({ handleOpenChat }: AskQuestionCardProps) => {
  return (
    <button
      type="button"
      onClick={handleOpenChat}
      className="w-full flex items-center justify-between cursor-pointer"
    >
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex flex-col items-start overflow-hidden">
            <p className="text-sm font-medium text-neutral-700 truncate tracking-tight max-w-[240px]">
              Ask a Question
            </p>
            <p className="text-[13px] text-neutral-500 ">
              AI Agent and team can help you
            </p>
          </div>
        </div>

        <Image
          src="/cenra-ai.png"
          alt="avatar"
          width={39}
          height={39}
          className="rounded-full shadow-sm mr-1"
        />
      </div>

      <ChevronRight
        size={18}
        className="text-neutral-400 flex-shrink-0 group-hover:text-emerald-700 transition-colors"
      />
    </button>
  );
};

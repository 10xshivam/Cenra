import { ChevronLeft, Ellipsis, X } from "lucide-react";
import Image from "next/image";

interface ChatHeaderProps {
  setCurrentScreen: (screen: "home" | "chat") => void;
  workspace: {
    id: string;
    name?: string;
    brandName?: string | null;
    companyLogoUrl?: string | null;
  };
}
export const ChatHeader = ({
  setCurrentScreen,
  workspace,
}: ChatHeaderProps) => {
  const brandName = workspace.brandName || workspace.name || "Cenra";

  return (
    <div className="w-full h-16 rounded-t-3xl flex justify-between items-center p-3 border-b bg-neutral-50 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 transition-colors">
      <div className="flex items-center gap-2">
        <ChevronLeft size={20} className="text-neutral-500 dark:text-neutral-300 hover:text-[var(--widget-theme-color)] cursor-pointer" onClick={() => setCurrentScreen("home")} />
        <div className="flex items-center gap-1">
          {workspace.companyLogoUrl ? (
            <img
              src={workspace.companyLogoUrl}
              alt={`${brandName} logo`}
              className="h-10 w-10 rounded-full shadow-sm mr-1 object-cover"
            />
          ) : (
            <Image
              src="/cenra-ai.png"
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full shadow-sm mr-1"
            />
          )}
          <div className="flex flex-col">
            <p className="text-neutral-800 dark:text-neutral-100 text-medium text-[16px] font-semibold leading-snug truncate max-w-[170px]">
              {brandName}
            </p>
            <p className="text-neutral-500 dark:text-neutral-300 text-medium text-xs">
              The team can also help
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-5 mr-1.5 text-neutral-500 dark:text-neutral-300">
        <Ellipsis size={20} className="hover:text-[var(--widget-theme-color)] cursor-pointer"/>
        <X size={20} className="hover:text-[var(--widget-theme-color)] cursor-pointer"/>
      </div>
    </div>
  );
};

import { ChevronLeft, Cross, Ellipsis, EllipsisVertical, X } from "lucide-react";
import Image from "next/image";

interface ChatHeaderProps {
  setCurrentScreen: (screen: "home" | "chat") => void;
  workspace: { id: string; name: string };
}
export const ChatHeader = ({
  setCurrentScreen,
  workspace,
}: ChatHeaderProps) => {
  return (
    <div className="w-full h-16 rounded-t-3xl flex justify-between items-center p-3 border-b">
      <div className="flex items-center gap-2">
        <ChevronLeft size={20} className="text-neutral-500 cursor-pointer hover:text-emerald-700" onClick={() => setCurrentScreen("home")} />
        <div className="flex items-center gap-1">
          <Image
            src="/cenra-ai.png"
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full shadow-sm mr-1"
          />
          <div className="flex flex-col">
            <p className="text-medium text-neutral-800 text-[16px] font-semibold leading-snug">
              {workspace.name}
            </p>
            <p className="text-medium text-neutral-500 text-xs">
              The team can also help
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-5 mr-1.5 text-neutral-500">
        <Ellipsis size={20} className="cursor-pointer hover:text-emerald-700"/>
        <X size={20} className="cursor-pointer hover:text-emerald-700"/>
      </div>
    </div>
  );
};

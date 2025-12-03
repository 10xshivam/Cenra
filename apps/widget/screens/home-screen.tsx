import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { Button } from "@workspace/ui/components/button";
import { IconPaperPlane, IconX } from "@workspace/ui/components/icons";
import { ChevronRight } from "lucide-react";

interface HomeScreenProps {
  workspaceSettings: {
    name: string;
  };
}

export const HomeScreen = ({workspaceSettings}: HomeScreenProps) => {
  const setScreen = useWidgetScreenStore((state) => state.setScreen);
  return (
    <>
      <div className="absolute top-0 left-0 min-h-2/4 w-full bg-gradient-to-b from-emerald-950 to-neutral-50 rounded-t-3xl z-0" />
      <div className="w-full relative z-10 flex justify-between items-center mb-20">
        <h3 className="text-white text-2xl font-semibold">{workspaceSettings.name}</h3>
        <IconX size="20px" color="white" />
      </div>
      <h4 className="relative z-10 text-white text-4xl tracking-tight font-medium">
        Hi there👋 <br /> How can we help?
      </h4>
      <Button onClick={() => setScreen("chat")} variant="secondary" className="relative text-neutral-500 z-10 w-full h-12 px-3 py-3 flex justify-between items-center mt-8 rounded-lg shadow-md hover:text-emerald-700 bg-white hover:bg-neutral-50 active:scale-95 transition-all">
          Ask a Question
        <IconPaperPlane size="20px"/>
      </Button>
      <div className="w-full relative z-10 mt-7">
        <p className="text-sm text-neutral-400 tracking-tight mb-2">
          What's New
        </p>
        <div className="flex gap-4">
          <div className="w-full h-fit  p-2.5 rounded-lg flex flex-col gap-1 bg-neutral-100 border">
            <div className="rounded-sm px-2.5 py-1 bg-neutral-50 w-fit text-xs mb-1 border">
              1
            </div>
            <h5 className="text-xs font-medium tracking-tight text-neutral-700">
              Smart AI Support Inbox
            </h5>
            <p className="text-[10px] text-neutral-500 tracking-tight leading-tight">
              Cenra greets customers, answers common questions, and escalates
              tricky conversations to your team when needed.
            </p>
          </div>
          <div className="w-full h-fit  p-2.5 rounded-lg flex flex-col gap-1 bg-neutral-100 border">
            <div className="rounded-sm px-2 py-1 bg-neutral-50 w-fit text-xs mb-1 border">
              2
            </div>
            <h5 className="text-xs font-medium tracking-tight text-neutral-700">
              Cenra Knowledge Engine
            </h5>
            <p className="text-[10px] text-neutral-500 tracking-tight leading-tight">
              Plug in help docs, FAQs, and release notes so Cenra can respond
              using your real product knowledge, not guesswork.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full relative z-10 mt-7">
        <p className="text-sm text-neutral-400 tracking-tight mb-2">
          Featured Articles
        </p>
        <div className="flex flex-col gap-2">
          <div className="w-full h-12  p-3 rounded-lg flex justify-between items-center gap-1 bg-neutral-100 border">
            <h5 className="text-sm font-medium tracking-tight text-neutral-700">
              Getting Started with Cenra
            </h5>
            <span className="flex items-center gap-0.5 text-emerald-700 font-medium">
              <p className="text-xs">Open Guide</p>
              <ChevronRight className="size-3 inline" />
            </span>
          </div>
          <div className="w-full h-12  p-3 rounded-lg flex justify-between items-center gap-1 bg-neutral-100 border">
            <h5 className="text-sm font-medium tracking-tight text-neutral-700">
              Best Practices for AI Support
            </h5>
            <span className="flex items-center gap-0.5 text-emerald-700 font-medium">
              <p className="text-xs">Read Tips</p>
              <ChevronRight className="size-3 inline" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

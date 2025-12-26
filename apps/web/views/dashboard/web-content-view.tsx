import { Button } from "@workspace/ui/components/button";
import { SquareInfo } from "@workspace/ui/components/icons";
import { CirclePlus } from "lucide-react";

export const WebContentView = () => {
  return (
    <div className="w-full h-full flex items-center p-16 flex-col gap-20">
      <div className="rounded-2xl w-full p-2 max-w-6xl h-fit bg-neutral-200 pb-6">
        <div className="flex flex-col gap-3.5 w-full h-full border border-neutral-400 rounded-xl p-5 bg-neutral-50">
          <span className="flex gap-1 text-lg items-center text-emerald-800 font-semibold tracking-tight">
            <SquareInfo size="18" /> What is Web Content?
          </span>
          <span className="text-neutral-500 text-sm tracking-tight">
            Web Content lets Cenra learn directly from your website and online
            documentation. Add your domains, and Cenra will crawl and extract
            the pages so your AI assistant can answer questions using your real,
            up-to-date content.
          </span>
          <span className="text-neutral-500 text-sm tracking-tight">
            <span className="font-bold text-neutral-700">Tip</span>: Once
            indexed, Cenra uses this content to generate accurate, context-aware
            replies inside your chat widget and conversations.
          </span>
          <Button className="w-40 h-11 bg-emerald-800 rounded-lg mt-2 hover:bg-emerald-900">
            <CirclePlus size="18" /> Add a domain
          </Button>
        </div>
      </div>
    </div>
  );
};

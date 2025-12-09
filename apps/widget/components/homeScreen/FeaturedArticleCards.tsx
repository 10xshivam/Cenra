import { ChevronRight } from "lucide-react";

export const FeaturedArticleCards = () => {
  return (
    <div className="w-full relative z-10 mt-7">
      <p className="text-sm text-neutral-400 tracking-tight mb-2">
        Featured Articles
      </p>
      <div className="flex flex-col gap-2">
        <div className="w-full h-12  p-3 rounded-lg flex justify-between items-center gap-1 bg-neutral-100 hover:-translate-y-0.5 transition-all duration-300 border group cursor-pointer">
          <h5 className="text-sm font-medium tracking-tight text-neutral-700">
            Getting Started with Cenra
          </h5>
          <span className="flex items-center gap-0.5 text-neutral-500 group-hover:text-emerald-700 ">
            <p className="text-xs">Open Guide</p>
            <ChevronRight className="size-3 inline" />
          </span>
        </div>
        <div className="w-full h-12  p-3 rounded-lg flex justify-between items-center gap-1 bg-neutral-100 hover:-translate-y-0.5 transition-all duration-300 border group cursor-pointer">
          <h5 className="text-sm font-medium tracking-tight text-neutral-700">
            Best Practices for AI Support
          </h5>
          <span className="flex items-center gap-0.5 text-neutral-500 group-hover:text-emerald-700 ">
            <p className="text-xs">Read Tips</p>
            <ChevronRight className="size-3 inline" />
          </span>
        </div>
      </div>
    </div>
  );
};

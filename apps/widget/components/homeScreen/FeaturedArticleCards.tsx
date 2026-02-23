"use client";

import { ChevronRight } from "lucide-react";
import { WidgetSection } from "@/types/widget";
import Link from "next/link";

interface FeaturedArticleCardsProps {
  section: WidgetSection;
}

export const FeaturedArticleCards = ({ section }: FeaturedArticleCardsProps) => {
  if (!section.enabled) {
    return null;
  }

  return (
    <div className="w-full relative z-10 mt-7">
      <p className="text-neutral-400 dark:text-neutral-300 text-sm tracking-tight mb-2 truncate min-w-0 max-w-full">
        {section.title}
      </p>
      <div className="flex flex-col gap-2">
        {section.items.map((item, index) => (
          <Link
            key={`${item.title}-${index}`}
            href={item.linkUrl?.trim() || "#"}
            target={item.linkUrl?.trim() ? "_blank" : undefined}
            rel={item.linkUrl?.trim() ? "noopener noreferrer" : undefined}
            className="w-full min-w-0 h-12 p-3 rounded-lg flex justify-between items-center gap-1 hover:-translate-y-0.5 transition-all duration-300 border group cursor-pointer bg-neutral-100 border-neutral-200 dark:bg-neutral-900/80 dark:border-neutral-700 overflow-hidden"
          >
            <h5 className="text-neutral-700 dark:text-neutral-100 text-sm font-medium tracking-tight truncate min-w-0 flex-1">
              {item.title}
            </h5>
            <span className="flex items-center gap-0.5 shrink-0 min-w-0 max-w-[95px] text-neutral-500 dark:text-neutral-300 group-hover:text-[var(--widget-theme-color)] dark:group-hover:text-[var(--widget-theme-color)]  font-medium truncate">
              <p className="text-xs truncate max-w-full">{item.linkLabel}</p>
              <ChevronRight className="size-3 inline" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

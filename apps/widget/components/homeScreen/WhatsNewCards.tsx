"use client";

import { WidgetSection } from "@/types/widget";
import Link from "next/link";

interface WhatsNewCardsProps {
  section: WidgetSection;
}

export const WhatsNewCards = ({ section }: WhatsNewCardsProps) => {
  if (!section.enabled) {
    return null;
  }

  return (
    <div className="w-full relative z-10 mt-8">
      <p className="text-neutral-400 dark:text-neutral-300 text-sm tracking-tight mb-2 truncate min-w-0 max-w-full">
        {section.title}
      </p>
      <div className="flex gap-4">
        {section.items.map((item, index) => {
          const href = item.linkUrl?.trim() || "#";
          const isExternal = /^https?:\/\//i.test(href);
          return (
            <Link
              key={`${item.title}-${index}`}
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="w-full min-w-0 h-36 p-3 rounded-lg flex flex-col gap-1 hover:-translate-y-0.5 transition-transform duration-300 border cursor-pointer border-neutral-200 bg-white/80 dark:border-neutral-700 dark:bg-neutral-900/80 overflow-hidden"
            >
              <div className="h-6 w-6 flex items-center justify-center rounded-sm text-xs mb-1 border bg-neutral-100 border-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100">
                {index + 1}
              </div>
              <h5 className="text-neutral-700 dark:text-neutral-100 text-xs font-medium tracking-tight truncate min-w-0 max-w-full">
                {item.title}
              </h5>
              <p className="text-neutral-500 dark:text-neutral-400 text-[10px] tracking-tight leading-tight min-w-0 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:4] [-webkit-box-orient:vertical] [overflow-wrap:anywhere]">
                {item.description}
              </p>
              {item.linkLabel ? (
                <span className="text-[var(--widget-theme-color)] text-[10px] font-medium mt-1 truncate min-w-0 max-w-full">
                  {item.linkLabel}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

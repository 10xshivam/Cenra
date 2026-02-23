import { Sparkles } from "lucide-react";

export const MessageLoader = () => {
  return (
    <div className="flex w-full justify-start my-4">
      <div className="flex max-w-[85%] items-end gap-3">
        <div className="size-7 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-100 border border-neutral-300 dark:bg-neutral-800 dark:border-neutral-600">
          <Sparkles size={12} className="text-neutral-600 dark:text-neutral-200" />
        </div>
        <div className="bg-white px-3.5 py-3 rounded-xl rounded-bl-none border border-neutral-200 flex items-center gap-2 dark:bg-neutral-800 dark:border-neutral-600">
          <span className="w-1.5 h-1.5 bg-neutral-500 dark:bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-neutral-500 dark:bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-neutral-500 dark:bg-neutral-300 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

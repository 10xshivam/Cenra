import { Sparkles } from 'lucide-react';
import React from 'react';

// --- Reusable Skeleton Parts ---

// 1. Assistant Message Skeleton
const AssistantMessageSkeleton = () => (
  <div className="flex items-end gap-1.5 mb-4 mt-4 animate-pulse">
    {/* Avatar/Icon Placeholder */}
    <div className="size-7 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-200 border border-neutral-300">
      <Sparkles size={12} className="text-neutral-400" />
    </div>
    
    {/* Message Content Placeholder */}
    <div className="max-w-[75%] w-fit px-3.5 py-2.5 rounded-xl bg-neutral-100 rounded-bl-none">
      <div className="h-4 bg-neutral-300 rounded-lg w-56 mb-2"></div>
      <div className="h-4 bg-neutral-300 rounded-lg w-40"></div>
    </div>
  </div>
);

// 2. User Message Skeleton
const UserMessageSkeleton = () => (
  <div className="flex justify-end mb-4 animate-pulse">
    <div
      className="max-w-[75%] w-fit px-3.5 py-2.5 rounded-xl rounded-br-none border-none"
      style={{ backgroundColor: "var(--widget-theme-color)" }}
    >
      <div className="h-4 bg-white/30 rounded-lg w-32"></div>
    </div>
  </div>
);

// --- Main History Skeleton Component ---

const HistoryLoadingSkeleton = ({ count = 5 }) => {
  // Create an array of 'count' length to map over
  const loadingItems = Array.from({ length: count });

  return (
    <div className="w-full">
      {loadingItems.map((_, index) => {
        // We alternate the messages (0=User, 1=Assistant, 2=User, etc.)
        if (index % 2 === 0) {
          return <UserMessageSkeleton key={index} />;
        } else {
          return <AssistantMessageSkeleton key={index} />;
        }
      })}
    </div>
  );
};

export default HistoryLoadingSkeleton;

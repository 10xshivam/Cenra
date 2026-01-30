import { Skeleton } from "@workspace/ui/components/skeleton";


export const ConversationSkeleton = () => {
  return (
    <div className="h-[4.3rem] w-full flex items-center p-4 gap-2 justify-between bg-neutral-400/5 rounded-xl border border-neutral-300/15">
      <div className="flex items-center gap-3 flex-1">
        {/* Avatar Circle */}
        <Skeleton className="size-10 rounded-full shrink-0 bg-neutral-500/5" />
        
        {/* Name and Last Message */}
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-3 w-24 bg-neutral-500/5" />
          <Skeleton className="h-3 w-full max-w-[160px] bg-neutral-500/5" />
        </div>
      </div>

      {/* Time and Status Icon */}
      <div className="flex flex-col justify-between items-end h-full min-w-10">
        <Skeleton className="h-3 w-8 bg-neutral-500/5" />
        <Skeleton className="size-4 rounded-sm bg-neutral-500/5" />
      </div>
    </div>
  )
}
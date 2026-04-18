import { Skeleton } from "@workspace/ui/components/skeleton";

export const ChatMessagesSkeleton = () => {
  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex items-end gap-1.5 mb-4 max-w-[80%]">
        <Skeleton className="size-7 rounded-full shrink-0 bg-neutral-400/5" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-[200px] rounded-xl rounded-bl-none bg-neutral-400/5" />
        </div>
      </div>

      <div className="flex flex-col items-end w-full mb-4">
        <Skeleton className="h-14 w-[60%] max-w-[300px] rounded-xl rounded-br-none bg-neutral-400/10" />
      </div>

      <div className="flex items-end gap-1.5 mb-4 max-w-[80%]">
        <Skeleton className="size-7 rounded-full shrink-0 bg-neutral-400/5" />
        <Skeleton className="h-10 w-[120px] rounded-xl rounded-bl-none bg-neutral-400/5" />
      </div>

      <div className="flex flex-col items-end w-full mb-4">
        <Skeleton className="h-10 w-[100px] rounded-xl rounded-br-none bg-neutral-400/10" />
      </div>
    </div>
  );
};

import { Skeleton } from "@workspace/ui/components/skeleton";

export const ChartSkeleton = () => (
  <Skeleton className="w-full h-full rounded-xl bg-neutral-400/10" />
);

export const PendingQueueSkeleton = () => (
  <>
    <Skeleton className="w-full h-12 bg-neutral-400/10" />
    <Skeleton className="w-full h-12 bg-neutral-400/10" />
    <Skeleton className="w-full h-12 bg-neutral-400/10" />
  </>
);

export const KnowledgeCoverageSkeleton = () => (
  <div className="flex flex-col items-center gap-2">
    <Skeleton className="w-20 h-11 rounded-md bg-neutral-400/10" />
    <Skeleton className="w-44 h-3.5 rounded-sm bg-neutral-400/10" />
    <div className="flex gap-4 mt-2 w-full justify-between">
      <div className="flex items-center gap-1.5 border px-2 py-1 rounded-md">
        <Skeleton className="size-1.5 rounded-full shrink-0 bg-neutral-400/10" />
        <Skeleton className="h-3 w-16 rounded-sm bg-neutral-400/10" />
      </div>
      <div className="flex items-center gap-1.5 border px-2 py-1 rounded-md">
        <Skeleton className="size-1.5 rounded-full shrink-0 bg-neutral-400/10" />
        <Skeleton className="h-3 w-16 rounded-sm bg-neutral-400/10" />
      </div>
    </div>
  </div>
);

export const SupportDemandSkeleton = () => (
  <div className="flex flex-col gap-3 mt-1">
    <div className="flex items-center justify-between border-b pb-2">
      <Skeleton className="w-24 h-3 rounded-sm bg-neutral-400/10" />
      <Skeleton className="w-16 h-4 rounded-sm bg-neutral-400/10" />
    </div>
    <div className="flex items-center justify-between border-b pb-2">
      <Skeleton className="w-24 h-3 rounded-sm bg-neutral-400/10" />
      <Skeleton className="w-12 h-4 rounded-sm bg-neutral-400/10" />
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="w-32 h-3 rounded-sm bg-neutral-400/10" />
      <Skeleton className="w-8 h-4 rounded-sm bg-neutral-400/10" />
    </div>
  </div>
);

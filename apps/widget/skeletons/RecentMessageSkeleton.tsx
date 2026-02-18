export const RecentMessageSkeleton = () => {
  return (
    <>
      <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse" />
      <div className="w-full flex items-center justify-between mt-1">
        <div className="flex items-center gap-2 overflow-hidden w-full">
          <div className="shrink-0 h-10 w-10 bg-neutral-200 dark:bg-neutral-600 rounded-md animate-pulse" />
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </>
  );
};

import { Skeleton } from "@workspace/ui/components/skeleton";

export const CustomerDetailsSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col p-4 gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2.5 border-b-3 border-neutral-300 py-4 bg-neutral-200/60 rounded-xl flex-col">
        <Skeleton className="size-14 rounded-full border border-neutral-300" />

        <div className="flex flex-col items-center gap-2 mt-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-44" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="ring ring-neutral-300 rounded-lg border-neutral-300 overflow-hidden"
          >
            <div className="py-2.5 bg-neutral-200/70 px-3 flex justify-between items-center">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="size-4 rounded-sm" />
            </div>

            {i === 1 && (
              <div className="p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 shrink-0" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 shrink-0" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

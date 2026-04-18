import { Skeleton } from "@workspace/ui/components/skeleton";

export const BillingSkeleton = () => (
    <div className="space-y-4">
        {/* Plan card skeleton */}
        <div className="rounded-xl border border-dashed border-neutral-200 p-5 flex items-start justify-between gap-4 bg-white/60">
            <div className="flex flex-col gap-2 flex-1">
                {/* label + badge */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-20 rounded-md bg-neutral-200/50" />
                    <Skeleton className="h-5 w-14 rounded-full bg-neutral-200/50" />
                </div>
                {/* price */}
                <Skeleton className="h-4 w-24 rounded-sm bg-neutral-200/50" />
                {/* workspace name */}
                <Skeleton className="h-3 w-36 rounded-sm bg-neutral-200/50" />
            </div>
            {/* shield icon */}
            <Skeleton className="size-8 rounded-md shrink-0 mt-1 bg-neutral-200/50" />
        </div>

        {/* Feature grid skeleton — 2 columns × 5 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                    <Skeleton className="size-4 rounded-sm shrink-0 bg-neutral-200/60" />
                    <Skeleton className="h-3.5 rounded-sm bg-neutral-200/60" style={{ width: `${60 + (i % 3) * 20}px` }} />
                </div>
            ))}
        </div>
    </div>
);

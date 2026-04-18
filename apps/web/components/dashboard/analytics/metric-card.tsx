import { Card } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface MetricCardProps {
    title: string;
    value?: number | string;
    loading: boolean;
    description?: string;
}

export const MetricCard = ({
    title,
    value,
    loading,
    description,
}: MetricCardProps) => {
    return (
        <div className="p-1 rounded-2xl bg-neutral-400/10">
            <Card className="border border-neutral-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] bg-white/80 rounded-[14px] overflow-hidden px-4 py-3.5 flex flex-col justify-between">
                <div className="flex-1 flex flex-row items-end justify-between w-full">
                    <div className="flex flex-col justify-end w-full shrink-0 min-w-[50%]">
                        {loading ? (
                            <div className="flex flex-col gap-2.5">
                                <Skeleton className="w-10 h-10 rounded-md bg-neutral-400/10" />
                                <Skeleton className="w-32 h-4 rounded-sm bg-neutral-400/10" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <h3 className="text-4xl font-bold tracking-tight text-emerald-700 leading-none">
                                    {value !== undefined
                                        ? typeof value === "number"
                                            ? value.toLocaleString()
                                            : value
                                        : "0"}
                                </h3>
                                {description && (
                                    <span className="text-base tracking-tight font-semibold text-neutral-600">
                                        {title}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
            <span className="text-xs text-neutral-400 px-2 py-2 tracking-tight">
                {description}
            </span>
        </div>
    );
}

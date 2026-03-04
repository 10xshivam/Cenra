"use client";

import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@workspace/ui/components/button";
import { Check, ArrowUpRight, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { Section } from "./section";
import { BillingSkeleton } from "./billing-skeleton";
import { PLAN_META, PLAN_FEATURES, PlanKey } from "./billing.constants";

export const BillingTab = () => {
    const { workspace } = useWorkspaceStore();
    const { data: subscription, isLoading } = useSubscription();

    const plan = (subscription?.plan ?? "STARTER") as PlanKey;
    const isPro = plan === "PRO";
    const current = PLAN_META[plan] ?? PLAN_META.STARTER;
    const currentFeatures = PLAN_FEATURES[plan] ?? PLAN_FEATURES.STARTER;

    return (
        <div className="space-y-4">
            <Section title="Current Plan" description="Your active subscription and billing details.">
                {isLoading ? (
                    <BillingSkeleton />
                ) : (
                    <div className="space-y-4">
                        <div
                            className={cn(
                                "rounded-xl border p-5 flex items-start justify-between gap-4 border-dashed",
                                current.bg,
                                current.border,
                            )}
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className={cn("text-2xl font-bold tracking-tight", current.color)}>
                                        {current.label}
                                    </span>
                                    <span
                                        className={cn(
                                            "text-xs font-semibold px-2 py-0.5 rounded-full border",
                                            current.bg,
                                            current.border,
                                            current.color,
                                        )}
                                    >
                                        Active
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-600 font-medium">{current.price}</p>
                                <p className="text-xs text-neutral-500 tracking-tight">
                                    Workspace: {workspace?.name ?? "—"}
                                </p>
                            </div>
                            <ShieldCheck className={cn("size-8 mt-1 shrink-0", current.color)} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {currentFeatures.map((f) => (
                                <div key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                                    <Check className="size-4 text-emerald-600 shrink-0" strokeWidth={3} />
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Section>

            {/* {!isPro && (
                <div className="rounded-2xl p-2 bg-neutral-900">
                    <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                                <Sparkles className="size-4 text-violet-400" />
                                <span className="text-sm font-semibold text-white tracking-tight">
                                    Upgrade to Pro
                                </span>
                            </div>
                            <p className="text-xs text-neutral-400 tracking-tight max-w-sm">
                                Unlock advanced analytics, multilingual support, voice assistant, and more for
                                your growing team.
                            </p>
                        </div>
                        <Link href="/pricing">
                            <Button className="h-9 px-4 text-sm font-medium bg-white text-neutral-900 hover:bg-neutral-100 rounded-lg gap-2 shrink-0">
                                View Plans
                                <ArrowUpRight className="size-3.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )} */}

            <Section title="Manage Subscription" description="Update your payment method or change your billing plan.">
                <div className="flex flex-wrap gap-3">
                    <Link href="/pricing">
                        <Button
                            variant="outline"
                            className="h-9 px-4 text-sm font-medium border-neutral-300 text-neutral-700 rounded-lg gap-2 hover:bg-neutral-100"
                        >
                            Change Plan
                            <ArrowUpRight className="size-3.5" />
                        </Button>
                    </Link>
                </div>
            </Section>
        </div>
    );
};

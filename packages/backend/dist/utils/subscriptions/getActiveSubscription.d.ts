export declare const getActiveSubscription: (userId: string) => Promise<{
    userId: string;
    id: string;
    plan: import("@prisma/client").$Enums.WorkspacePlan;
    status: import("@prisma/client").$Enums.SubscriptionStatus;
    startedAt: Date;
    endsAt: Date;
    createdAt: Date;
    updatedAt: Date;
} | null>;
//# sourceMappingURL=getActiveSubscription.d.ts.map
export interface AnalyticsData {
    metrics: {
        total: number;
        totalTrend: number;
        unresolved: number;
        unresolvedTrend: number;
        avgWaitTimeHours: number;
        escalated: number;
        escalationTrend: number;
        resolved: number;
        resolvedTrend: number;
    };
    performance: {
        avgResolutionTime: number;
        medianResolutionTime: number;
        fastestResolution: number;
        slowestResolution: number;
    };
    knowledge: {
        totalResources: number;
        activeResources: number;
        webResources: number;
        fileResources: number;
        coveragePercent: number;
    };
    supportDemand: {
        busiestDay: string;
        busiestHour: string;
        avgDailyRequests: number;
    };
    trendData: {
        date: string;
        incidents: number;
        resolved: number;
        escalated: number;
        unresolved: number;
    }[];
    distributionData: {
        bucket: string;
        incidents: number;
    }[];
    unresolvedTickets: {
        id: string;
        threadId: string;
        customerName: string;
        hoursWaited: number;
        daysWaited: number;
        createdAt: string;
    }[];
}

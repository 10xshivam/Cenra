"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = void 0;
const db_1 = require("@workspace/db");
const date_fns_1 = require("date-fns");
const getAnalytics = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const days = parseInt(req.query.days) || 30;
        if (!workspaceId) {
            return res.status(400).json({ error: "Workspace ID is required" });
        }
        const today = new Date();
        const startDate = (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(today, days));
        const prevStartDate = (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(today, days * 2));
        const customerFilter = {
            customer: {
                OR: [
                    { name: { not: null } },
                    { email: { not: null } }
                ]
            }
        };
        const currentPeriodWhere = { workspaceId, createdAt: { gte: startDate }, ...customerFilter };
        const prevPeriodWhere = { workspaceId, createdAt: { gte: prevStartDate, lt: startDate }, ...customerFilter };
        // Fetch conversations to process in memory for complex metrics
        const [currentConversations, prevConversations] = await Promise.all([
            db_1.prisma.conversation.findMany({ where: currentPeriodWhere }),
            db_1.prisma.conversation.findMany({ where: prevPeriodWhere }),
        ]);
        // Current Period Metrics
        let unresolved = 0;
        let escalated = 0;
        let resolved = 0;
        let totalWaitHours = 0;
        const resolutionTimes = [];
        const trendMap = new Map();
        const hourMap = new Map();
        const dayMap = new Map();
        const uniqueCustomers = new Set();
        const customerConversationCount = new Map();
        // Resolution time distribution buckets
        const resolutionBuckets = {
            "< 1h": 0,
            "1-4h": 0,
            "4-24h": 0,
            "1-3d": 0,
            "> 3d": 0
        };
        currentConversations.forEach((conv) => {
            // Customer tracking
            uniqueCustomers.add(conv.customerId);
            customerConversationCount.set(conv.customerId, (customerConversationCount.get(conv.customerId) || 0) + 1);
            // Engagement tracking
            const hour = conv.createdAt.getHours();
            const day = conv.createdAt.getDay();
            hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
            dayMap.set(day, (dayMap.get(day) || 0) + 1);
            // Status counts
            if (conv.status === "unresolved") {
                unresolved++;
                totalWaitHours += Math.max(0, (0, date_fns_1.differenceInHours)(today, conv.createdAt));
            }
            if (conv.status === "escalated")
                escalated++;
            if (conv.status === "resolved") {
                resolved++;
                const hours = (0, date_fns_1.differenceInHours)(conv.updatedAt || conv.createdAt, conv.createdAt);
                resolutionTimes.push(hours);
                if (hours < 1)
                    resolutionBuckets["< 1h"]++;
                else if (hours <= 4)
                    resolutionBuckets["1-4h"]++;
                else if (hours <= 24)
                    resolutionBuckets["4-24h"]++;
                else if (hours <= 72)
                    resolutionBuckets["1-3d"]++;
                else
                    resolutionBuckets["> 3d"]++;
            }
            // Trend data
            const dateKey = (0, date_fns_1.format)(conv.createdAt, "MMM d");
            trendMap.set(dateKey, (trendMap.get(dateKey) || 0) + 1);
        });
        const totalIncidents = currentConversations.length;
        // Previous Period Metrics (for trends)
        let prevUnresolved = 0;
        let prevResolved = 0;
        let prevEscalated = 0;
        prevConversations.forEach((conv) => {
            if (conv.status === "unresolved")
                prevUnresolved++;
            if (conv.status === "resolved")
                prevResolved++;
            if (conv.status === "escalated")
                prevEscalated++;
        });
        const prevTotal = prevConversations.length;
        // Formulate Trend Data for charts
        const trendData = [];
        for (let i = days - 1; i >= 0; i--) {
            const dateKey = (0, date_fns_1.format)((0, date_fns_1.subDays)(today, i), "MMM d");
            trendData.push({
                date: dateKey,
                incidents: trendMap.get(dateKey) || 0,
                resolved: currentConversations.filter(c => c.status === "resolved" && (0, date_fns_1.format)(c.createdAt, "MMM d") === dateKey).length,
                escalated: currentConversations.filter(c => c.status === "escalated" && (0, date_fns_1.format)(c.createdAt, "MMM d") === dateKey).length,
                unresolved: currentConversations.filter(c => c.status === "unresolved" && (0, date_fns_1.format)(c.createdAt, "MMM d") === dateKey).length,
            });
        }
        // Formulate Resolution Distribution Data (Bar Chart)
        const distributionData = Object.keys(resolutionBuckets).map(bucket => ({
            bucket,
            incidents: resolutionBuckets[bucket]
        }));
        // Fetch Oldest Unresolved Tickets (Actionable Queue)
        const twentyFourHoursAgo = (0, date_fns_1.subDays)(today, 1);
        const oldestUnresolved = await db_1.prisma.conversation.findMany({
            where: {
                workspaceId,
                status: "unresolved",
                createdAt: { lte: twentyFourHoursAgo },
                ...customerFilter
            },
            orderBy: { createdAt: 'asc' },
            take: 5,
            include: { customer: true }
        });
        // Format for frontend
        const unresolvedTickets = oldestUnresolved.map(conv => {
            const hoursWaited = (0, date_fns_1.differenceInHours)(today, conv.createdAt);
            const daysWaited = Math.floor(hoursWaited / 24);
            return {
                id: conv.id,
                threadId: conv.threadId,
                customerName: conv.customer?.name || conv.customer?.email || "Unknown User",
                hoursWaited,
                daysWaited,
                createdAt: conv.createdAt
            };
        });
        // Calculate % Trends & Derived Metrics
        const calcTrend = (curr, prev) => {
            if (prev === 0)
                return curr > 0 ? 100 : 0;
            return Math.round(((curr - prev) / prev) * 100);
        };
        const volumeTrend = calcTrend(totalIncidents, prevTotal);
        const escalatedTrend = calcTrend(escalated, prevEscalated);
        const unresolvedTrend = calcTrend(unresolved, prevUnresolved);
        const resolvedTrend = calcTrend(resolved, prevResolved);
        // Resolution Time
        resolutionTimes.sort((a, b) => a - b);
        const avgResolutionTime = resolutionTimes.length > 0 ? Math.round(resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length) : 0;
        const medianResolutionTime = resolutionTimes.length > 0 ? resolutionTimes[Math.floor(resolutionTimes.length / 2)] : 0;
        const fastestResolution = resolutionTimes.length > 0 ? resolutionTimes[0] : 0;
        const slowestResolution = resolutionTimes.length > 0 ? resolutionTimes[resolutionTimes.length - 1] : 0;
        const avgWaitTimeHours = unresolved > 0 ? Math.round(totalWaitHours / unresolved) : 0;
        // Engagement
        let peakHour = 0;
        let maxHourCount = 0;
        hourMap.forEach((count, hour) => { if (count > maxHourCount) {
            maxHourCount = count;
            peakHour = hour;
        } });
        let peakDay = 0;
        let maxDayCount = 0;
        dayMap.forEach((count, day) => { if (count > maxDayCount) {
            maxDayCount = count;
            peakDay = day;
        } });
        const avgConversationsPerDay = Math.round(totalIncidents / days);
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const peakDayName = daysOfWeek[peakDay] || "Unknown";
        // Resources Knowledge Coverage
        const resources = await db_1.prisma.resource.findMany({ where: { workspaceId } });
        const totalResources = resources.length;
        const activeResources = resources.filter((r) => r.active).length;
        const webResources = resources.filter((r) => r.sourceType === "WEB").length;
        const fileResources = resources.filter((r) => r.sourceType === "FILE").length;
        return res.status(200).json({
            metrics: {
                total: totalIncidents,
                totalTrend: volumeTrend,
                unresolved,
                unresolvedTrend,
                avgWaitTimeHours,
                escalated,
                escalationTrend: escalatedTrend,
                resolved,
                resolvedTrend,
            },
            performance: {
                avgResolutionTime,
                medianResolutionTime,
                fastestResolution,
                slowestResolution
            },
            knowledge: {
                totalResources,
                activeResources,
                webResources,
                fileResources,
                coveragePercent: totalResources > 0 ? Math.round((activeResources / totalResources) * 100) : 0
            },
            supportDemand: {
                busiestDay: peakDayName,
                busiestHour: `${peakHour}:00`,
                avgDailyRequests: avgConversationsPerDay
            },
            trendData,
            distributionData,
            unresolvedTickets
        });
    }
    catch (error) {
        console.error("Failed to fetch analytics:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getAnalytics = getAnalytics;

"use client";

import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  ChartSkeleton,
  PendingQueueSkeleton,
  KnowledgeCoverageSkeleton,
  SupportDemandSkeleton,
} from "@/skeletons/analyticsSkeleton";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Label,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@workspace/ui/components/chart";
import {
  CheckCircle,
  CalendarDays,
  CircleDotDashed,
  ArrowUpRight,
} from "lucide-react";

import { useAnalytics } from "@/hooks/useAnalytics";
import { AnalyticsData } from "@/types/analytics.types";
import { MetricCard } from "@/components/dashboard/analytics/metric-card";
import Link from "next/link";

export const AnalyticsView = () => {
  const { workspace } = useWorkspaceStore();
  const workspaceId = workspace?.id ?? "";
  const [dateRange, setDateRange] = useState("30");

  const { data, isLoading: loading } = useAnalytics(workspaceId, dateRange);

  const COLORS = {
    resolved: "#00a63e",
    escalated: "#f0b100",
    unresolved: "#e7000b",
  };

  const statusChartConfig = {
    resolved: { label: "Resolved", color: COLORS.resolved },
    escalated: { label: "Escalated", color: COLORS.escalated },
    unresolved: { label: "Unresolved", color: COLORS.unresolved },
  };

  const trendChartConfig = {
    incidents: { label: "Requests", color: "#009966" },
  };

  const distChartConfig = {
    incidents: { label: "Requests", color: "#007a55" },
  };

  const pieData = data
    ? [
        {
          name: "resolved",
          value: data.metrics.resolved,
          fill: COLORS.resolved,
        },
        {
          name: "escalated",
          value: data.metrics.escalated,
          fill: COLORS.escalated,
        },
        {
          name: "unresolved",
          value: data.metrics.unresolved,
          fill: COLORS.unresolved,
        },
      ]
    : [];

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 md:p-8 lg:p-12 pb-24 max-w-6xl mx-auto overflow-y-auto no-scrollbar">
      {/* Header section */}
     <div className="rounded-2xl w-full p-2 max-w-6xl h-fit bg-neutral-500/10 pb-6">
        <div  className="flex flex-col gap-2 w-full h-full border border-neutral-300 rounded-xl p-5 bg-white/60">
          <span className="flex gap-1.5 text-2xl items-center text-emerald-800 font-semibold tracking-tight">
            Analytics &amp; Insights
          </span>
          <span className="text-neutral-500 text-sm tracking-tight leading-relaxed">
            Track your support operations in real time. Monitor incoming
            requests, resolution progress, handling time, and workload
            distribution to better understand performance and improve response
            efficiency.
          </span>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-7 border border-neutral-300 bg-white rounded-lg px-2 shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-neutral-200 w-fit ml-auto tracking-tight">
              <div className="flex items-center gap-2">
                <CalendarDays className="text-neutral-500 size-4" />
                <SelectValue placeholder="Select date range" />
              </div>
            </SelectTrigger>
            <SelectContent
              className="shadow-none rounded-xl border border-neutral-300 bg-neutral-100"
              position="popper"
              align="end"
              sideOffset={4}
            >
              <div className="border border-neutral-200 rounded-lg bg-white p-1">
                <SelectItem value="7" className="[&_svg]:stroke-[2.5]">
                  Last 7 Days
                </SelectItem>
                <SelectItem value="30" className="[&_svg]:stroke-[2.5]">
                  Last 30 Days
                </SelectItem>
                <SelectItem value="90" className="[&_svg]:stroke-[2.5]">
                  Last 90 Days
                </SelectItem>
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Open Requests"
          value={data?.metrics.unresolved}
          loading={loading}
          description="Waiting for response or action"
        />
        <MetricCard
          title="Escalated"
          value={data?.metrics.escalated}
          loading={loading}
          description="Handed to a human for resolution"
        />
        <MetricCard
          title="Resolved"
          value={data?.metrics.resolved}
          loading={loading}
          description="Successfully resolved in this period"
        />
        <MetricCard
          title="Total Requests"
          value={data?.metrics.total}
          loading={loading}
          description="Total requests during selected period"
        />
      </div>

      {/* Charts Grid 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation Volume Over Time (Line/Area) */}
        <div className="p-1 rounded-2xl bg-neutral-400/10">
          <div className="p-2.5 flex flex-col">
            <span className="text-sm font-semibold text-neutral-600">
              Request Activity
            </span>
            <span className="text-neutral-400 text-xs tracking-tight leading-relaxed">
              How demand changed during this period
            </span>
          </div>
          <Card className="border-none shadow-sm bg-white/80 overflow-hidden p-0 gap-0">
            <CardContent className="py-4 px-4 h-[300px]">
              {loading ? (
                <ChartSkeleton />
              ) : (
                <ChartContainer
                  config={trendChartConfig}
                  className="h-full w-full"
                >
                  <AreaChart
                    data={data?.trendData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorIncidents"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-incidents)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-incidents)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e5e5"
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                      stopColor="#a3a3a3"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      tickMargin={8}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="incidents"
                      stroke="var(--color-incidents)"
                      fillOpacity={1}
                      fill="url(#colorIncidents)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Conversation Breakdown (Donut) */}
        <div className="p-1 rounded-2xl bg-neutral-400/10">
          <div className="p-2.5 flex flex-col">
            <span className="text-sm font-semibold text-neutral-600">
              Current Status Overview
            </span>
            <span className="text-neutral-400 text-xs tracking-tight leading-relaxed">
              Distribution of open and closed requests
            </span>
          </div>
          <Card className="border-none shadow-sm bg-white/80 overflow-hidden p-0">
            <CardContent className="py-4 px-4 h-[300px] flex items-center justify-center relative">
              {loading ? (
                <ChartSkeleton />
              ) : (
                <ChartContainer
                  config={statusChartConfig}
                  className="h-full w-full"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-emerald-600 text-[28px] font-bold"
                                >
                                  {data ? data.metrics.resolved : "0"}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-neutral-500 text-[10px] font-semibold uppercase tracking-widest"
                                >
                                  Resolved
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolution Performance (Bar) */}
        <div className="p-1 rounded-2xl bg-neutral-500/10">
          <div className="p-2.5 flex flex-col">
            <span className="text-sm font-semibold text-neutral-600">
              Handling Time
            </span>
            <span className="text-neutral-400 text-xs tracking-tight leading-relaxed">
              Time taken to close requests
            </span>
          </div>
          <Card className="lg:col-span-2 border-none shadow-sm bg-white/80 overflow-hidden p-0">
            <CardContent className="py-4 px-4 h-[300px]">
              {loading ? (
                <ChartSkeleton />
              ) : (
                <ChartContainer
                  config={distChartConfig}
                  className="h-full w-full"
                >
                  <BarChart
                    data={data?.distributionData}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#e5e5e5"
                    />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <YAxis
                      dataKey="bucket"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      width={60}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="incidents"
                      fill="var(--color-incidents)"
                      radius={[0, 4, 4, 0]}
                      barSize={24}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Open Conversation Queue Sidebar */}
        <div className="p-1 rounded-2xl bg-neutral-500/10">
          <div className="p-2.5 flex flex-col">
            <span className="text-sm font-semibold text-neutral-600">
              Pending Queue
            </span>
            <span className="text-neutral-400 text-xs tracking-tight leading-relaxed">
              Oldest requests waiting for response
            </span>
          </div>
          <Card className="border-none shadow-sm bg-white/80 overflow-hidden relative p-0">
            <CardContent className="py-4 px-4 flex flex-col gap-3 h-[300px]">
              {loading ? (
                <PendingQueueSkeleton />
              ) : (
                <>
                  {(data?.unresolvedTickets?.length ?? 0) > 0 ? (
                    data!.unresolvedTickets.map(
                      (ticket: AnalyticsData["unresolvedTickets"][number]) => (
                        <Link
                          key={ticket.id}
                          href={`/inbox/${ticket.id}`}
                          className="flex items-center justify-between p-2 rounded-lg border border-neutral-200/70  group cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-10 flex items-center justify-center bg-neutral-200 rounded-lg text-neutral-500">
                              <CircleDotDashed className="size-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <p className="text-sm font-medium text-neutral-800 truncate">
                                {ticket.customerName}
                              </p>
                              <p className="text-xs text-neutral-500 truncate">
                                Open for{" "}
                                {ticket.daysWaited > 0
                                  ? `${ticket.daysWaited}d ${ticket.hoursWaited % 24}h`
                                  : `${ticket.hoursWaited}h`}
                              </p>
                            </div>
                          </div>
                          <div className="bg-white border shadow-xs size-7 flex items-center justify-center rounded-md text-xs font-semibold text-rose-600 shrink-0 tracking-wide uppercase">
                            <ArrowUpRight className="size-4" />
                          </div>
                        </Link>
                      ),
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-neutral-200 rounded-lg bg-neutral-50/50 h-[300px]">
                      <div className="p-3 bg-emerald-100/50 text-emerald-600 rounded-full mb-3">
                        <CheckCircle className="size-5" />
                      </div>
                      <p className="text-sm font-medium text-neutral-800 tracking-tight mb-1">
                        Your queue is clear.
                      </p>
                      <p className="text-xs text-neutral-500 tracking-tight">
                        There are currently no requests awaiting response.
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Performance & Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Knowledge Base Coverage */}
        <div className="p-1 rounded-2xl bg-neutral-500/10">
          <Card className="border border-neutral-200/60 shadow-sm bg-white/80 overflow-hidden p-0 h-[200px]">
            <CardHeader className="gap-0 justify-center text-center">
              <div className="w-fit bg-neutral-500/5 px-3.5 py-1.5 rounded-b-lg">
                <CardTitle className="text-sm font-medium text-neutral-600 tracking-tight">
                  AI Knowledge Coverage
                </CardTitle>
                <CardDescription className="text-xs tracking-tight text-neutral-400">
                  Sources currently available for the assistant to generate
                  answers
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 justify-center">
              {loading ? (
                <KnowledgeCoverageSkeleton />
              ) : (
                <>
                  <div className="flex justify-center gap-1 flex-col items-center">
                    <span className="text-4xl font-bold tracking-tight text-emerald-700">
                      {data?.knowledge?.coveragePercent || 0}%
                    </span>
                    <p className="text-sm tracking-tight text-neutral-500 font-medium">
                      {data?.knowledge?.activeResources || 0} active out of{" "}
                      {data?.knowledge?.totalResources || 0} total resources
                    </p>
                  </div>
                  <div className="flex gap-4 mt-3.5 tracking-tight text-xs font-medium text-neutral-500 justify-between">
                    <div className="flex items-center gap-1.5 border px-2 py-1 rounded-md">
                      <div className="size-1.5 rounded-full bg-emerald-600"></div>
                      {data?.knowledge?.webResources || 0} Web sources
                    </div>
                    <div className="flex items-center gap-1.5 border px-2 py-1 rounded-md">
                      <div className="size-1.5 rounded-full bg-emerald-500"></div>
                      {data?.knowledge?.fileResources || 0} Uploaded files
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Support Demand Pattern */}
        <div className="p-1 rounded-2xl bg-neutral-500/10">
          <Card className="border border-neutral-200/60 shadow-sm bg-white/80 overflow-hidden p-0 h-[200px]">
            <CardHeader className="gap-0 justify-center text-center">
              <div className="w-fit bg-neutral-500/5 px-3.5 py-1.5 rounded-b-lg">
                <CardTitle className="text-sm font-medium text-neutral-600 tracking-tight">
                  Support Demand Pattern
                </CardTitle>
                <CardDescription className="text-xs tracking-tight text-neutral-400">
                  When users most frequently request assistance
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-2 flex flex-col gap-1">
              {loading ? (
                <SupportDemandSkeleton />
              ) : (
                <>
                  <div className="flex flex-col gap-2.5 mt-1">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs text-neutral-500 font-medium">
                        Most Active Day
                      </span>
                      <span className="text-sm font-semibold text-emerald-700">
                        {data?.supportDemand?.busiestDay || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs text-neutral-500 font-medium">
                        Most Active Hour
                      </span>
                      <span className="text-sm font-semibold text-emerald-700">
                        {data?.supportDemand?.busiestHour || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500 font-medium">
                        Avg Requests Per Day
                      </span>
                      <span className="text-sm font-semibold text-emerald-700">
                        {data?.supportDemand?.avgDailyRequests || 0}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

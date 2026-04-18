"use client";

import {
  steps,
  VISITED_ROUTES_STORAGE_KEY,
} from "@/constants/getStarted.constants";
import { Button } from "@workspace/ui/components/button";
import { IconRocket } from "@workspace/ui/components/icons";
import { CircleCheckBig, CircleDashed } from "lucide-react";
import { Link } from "next-view-transitions";
import { useEffect, useMemo, useState } from "react";

export const GetStartedView = () => {
  const [visitedRoutes, setVisitedRoutes] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(VISITED_ROUTES_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as string[];
      if (Array.isArray(parsed)) {
        setVisitedRoutes(parsed);
      }
    } catch {
      setVisitedRoutes([]);
    }
  }, []);

  const visitedRouteSet = useMemo(
    () => new Set(visitedRoutes),
    [visitedRoutes],
  );

  const completedCount = steps.filter((step) =>
    step.requiredRoutes.every((route) => visitedRouteSet.has(route)),
  ).length;
  const completionPercentage = Math.round(
    (completedCount / steps.length) * 100,
  );

  return (
    <div className="w-full h-full flex items-center p-16 flex-col gap-20 md:p-12 overflow-y-auto no-scrollbar">
      <div className="flex w-full max-w-6xl flex-col gap-12">
        <section className="rounded-2xl w-full p-2 max-w-6xl h-fit bg-neutral-500/10 pb-6">
          <div className="flex flex-col gap-2 w-full h-full border border-neutral-300 rounded-xl p-5 bg-white/60">
            <h2 className="flex items-center gap-2.5 text-3xl font-semibold tracking-tight text-emerald-800">
              Get Started <IconRocket className="size-7 text-emerald-700" />
            </h2>
            <p className="text-sm text-neutral-500 mb-3.5 tracking-tight">
              Set up your AI-powered customer support in minutes. Complete each
              step to launch your workspace and start handling real customer
              conversations.
            </p>
            <div className="rounded-xl border border-dashed border-neutral-400 bg-neutral-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold tracking-tight text-neutral-600">
                  {completedCount} / {steps.length} setup steps completed
                </p>
                <p className="text-xs font-semibold text-emerald-700 tracking-tight">
                  {completionPercentage}% complete
                </p>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-emerald-700 transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-neutral-300/20 rounded-2xl w-6xl p-4">
          <div className="flex flex-col gap-4">
            {steps.map((step, index) => {
              const isCompleted = step.requiredRoutes.every((route) =>
                visitedRouteSet.has(route),
              );
              return (
                <article
                  key={step.id}
                  className="rounded-xl border border-neutral-300 bg-white/60 p-4 md:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-1 gap-3">
                      <div className="pt-0.5">
                        {isCompleted ? (
                          <CircleCheckBig
                            className="size-5 text-emerald-700"
                            strokeWidth={2.5}
                          />
                        ) : (
                          <CircleDashed
                            className="size-5 text-neutral-400"
                            strokeWidth={2.5}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold tracking-wide text-emerald-700">
                          STEP {index + 1}
                        </p>
                        <h3 className="mt-0.5 text-base font-semibold tracking-tight text-neutral-700">
                          {step.title}
                        </h3>
                        <p className=" text-[13px] text-neutral-600">
                          {step.description}
                        </p>
                        <ul className="mt-2.5 space-y-1.5 text-sm text-neutral-500">
                          {step.points.map((point) => (
                            <li
                              key={point}
                              className="flex items-center gap-2 text-xs"
                            >
                              <span className=" inline-block size-1.5 rounded-full bg-neutral-400" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      {step.actions.map((action) => (
                        <Button
                          key={action.href}
                          asChild
                          className="bg-emerald-800 hover:bg-emerald-900 border-2 border-b-4 border-emerald-700 text-xs tracking-tight px-3 h-8 rounded-lg active:scale-95 transition-transform"
                        >
                          <Link href={action.href}>{action.label}</Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

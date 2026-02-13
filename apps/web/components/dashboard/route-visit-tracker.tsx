"use client";

import { VISITED_ROUTES_STORAGE_KEY } from "@/constants/getStarted.constants";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const normalizePathname = (pathname: string) => {
  const withoutQuery = pathname.split("?")[0] ?? pathname;
  const withoutHash = withoutQuery.split("#")[0] ?? withoutQuery;
  if (withoutHash.length > 1 && withoutHash.endsWith("/")) {
    return withoutHash.slice(0, -1);
  }
  return withoutHash || "/";
};

export const RouteVisitTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    const normalizedPath = normalizePathname(pathname);
    const saved = localStorage.getItem(VISITED_ROUTES_STORAGE_KEY);

    let visited = new Set<string>();
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        if (Array.isArray(parsed)) {
          visited = new Set(parsed);
        }
      } catch {
        visited = new Set<string>();
      }
    }

    if (!visited.has(normalizedPath)) {
      visited.add(normalizedPath);
      localStorage.setItem(
        VISITED_ROUTES_STORAGE_KEY,
        JSON.stringify(Array.from(visited))
      );
    }
  }, [pathname]);

  return null;
};

import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/signup"];
const PROTECTED_PATHS = ["/inbox", "/create-workspace", "/get-started", "/knowledge-sources", "/automations"];

function isPublicPath(path: string) {
  return PUBLIC_PATHS.includes(path);
}

function isProtectedPath(path: string) {
  return PROTECTED_PATHS.some((protectedPath) => path.startsWith(protectedPath));
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const hasWorkspace = req.cookies.get("hasWorkspace")?.value === "true";
  const hasSubscription = req.cookies.get("hasSubscription")?.value === "true";

  if (isProtectedPath(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!hasWorkspace && pathname !== "/create-workspace") {
      return NextResponse.redirect(new URL("/create-workspace", req.url));
    }
    if (hasWorkspace && pathname === "/create-workspace") {
      return NextResponse.redirect(new URL("/inbox", req.url));
    }
    if (hasWorkspace && !hasSubscription && pathname !== "/pricing") {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
    return NextResponse.next();
  }

  if (isPublicPath(pathname) && token) {
    if (!hasWorkspace) {
      if (pathname !== "/") {
        return NextResponse.redirect(new URL("/create-workspace", req.url));
      }
    } else {
      if (pathname !== "/") {
        return NextResponse.redirect(new URL("/inbox", req.url));
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};

import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/signup"];

function isPublicPath(path: string) {
  return PUBLIC_PATHS.includes(path);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const hasWorkspace = req.cookies.get("hasWorkspace")?.value === "true";

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!hasWorkspace) {
      return NextResponse.redirect(new URL("/create-workspace", req.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/create-workspace") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (hasWorkspace) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (isPublicPath(pathname) && token && pathname !== "/") {
    if (!hasWorkspace) {
      return NextResponse.redirect(new URL("/create-workspace", req.url));
    }

    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};

import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/pricing",
  "/billing/success",
  "/billing/cancel",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  const hasSubscription = req.cookies.get("hasSubscription")?.value === "true";
  const hasWorkspace = req.cookies.get("hasWorkspace")?.value === "true";

  if (pathname === "/get-started") {
    if (!token) {
      return NextResponse.redirect(new URL("/signup", req.url));
    }

    if (!hasSubscription) {
      return NextResponse.redirect(new URL("/payment", req.url));
    }

    return NextResponse.redirect(new URL("/inbox", req.url));
  }

  if (token && hasSubscription) {
    if (pathname.startsWith("/billing")) {
      return NextResponse.redirect(new URL("/create-workspace", req.url));
    }
  }

  if (pathname === "/payment" && token && hasSubscription) {
    return NextResponse.redirect(new URL("/inbox", req.url));
  }

  if (isPublicPath(pathname)) {
    if (token && (pathname === "/login" || pathname === "/signup")) {
      return NextResponse.redirect(
        new URL(hasSubscription ? "/inbox" : "/payment", req.url),
      );
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!hasSubscription) {
    if (pathname !== "/payment") {
      return NextResponse.redirect(new URL("/payment", req.url));
    }
    return NextResponse.next();
  }

  if (!hasWorkspace) {
    if (pathname !== "/create-workspace") {
      return NextResponse.redirect(new URL("/create-workspace", req.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/create-workspace") {
    return NextResponse.redirect(new URL("/inbox", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/pricing",
  "/login",
  "/signup",
  "/billing/success",
  "/billing/cancel",
];

const AUTH_PAGES = ["/login", "/signup"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}

function isAuthPage(pathname: string) {
  return AUTH_PAGES.includes(pathname);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  const hasSubscription =
    req.cookies.get("hasSubscription")?.value === "true";
  const hasWorkspace =
    req.cookies.get("hasWorkspace")?.value === "true";

  const isLoggedIn = !!token;

  /**
   * -----------------------------------
   * 1. PUBLIC ROUTES
   * Home, Pricing always public
   * Login/Signup public only if not logged in
   * -----------------------------------
   */
  if (isPublicPath(pathname)) {
    if (isLoggedIn && isAuthPage(pathname)) {
      if (!hasSubscription) {
        return NextResponse.redirect(new URL("/payment", req.url));
      }

      if (!hasWorkspace) {
        return NextResponse.redirect(
          new URL("/create-workspace", req.url)
        );
      }

      return NextResponse.redirect(new URL("/inbox", req.url));
    }

    return NextResponse.next();
  }

  /**
   * -----------------------------------
   * 2. PAYMENT PAGE
   * Only logged in users without subscription
   * -----------------------------------
   */
  if (pathname === "/payment") {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (hasSubscription) {
      if (hasWorkspace) {
        return NextResponse.redirect(new URL("/inbox", req.url));
      }

      return NextResponse.redirect(
        new URL("/create-workspace", req.url)
      );
    }

    return NextResponse.next();
  }

  /**
   * -----------------------------------
   * 3. CREATE WORKSPACE PAGE
   * Only logged in + subscribed users
   * without workspace
   * -----------------------------------
   */
  if (pathname === "/create-workspace") {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!hasSubscription) {
      return NextResponse.redirect(new URL("/payment", req.url));
    }

    if (hasWorkspace) {
      return NextResponse.redirect(new URL("/inbox", req.url));
    }

    return NextResponse.next();
  }

  /**
   * -----------------------------------
   * 4. ALL DASHBOARD / PRIVATE ROUTES
   * Need login + subscription + workspace
   * -----------------------------------
   */
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!hasSubscription) {
    return NextResponse.redirect(new URL("/payment", req.url));
  }

  if (!hasWorkspace) {
    return NextResponse.redirect(
      new URL("/create-workspace", req.url)
    );
  }

  /**
   * If fully onboarded and tries random route,
   * allow access
   */
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};

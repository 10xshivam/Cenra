import type { CookieOptions } from "express";

export function getAuthCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
  const sameSiteEnv = process.env.COOKIE_SAME_SITE;

  const sameSite: CookieOptions["sameSite"] =
    sameSiteEnv === "strict" ||
    sameSiteEnv === "none" ||
    sameSiteEnv === "lax"
      ? sameSiteEnv
      : "lax";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    domain: cookieDomain,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

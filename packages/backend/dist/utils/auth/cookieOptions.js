"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthCookieOptions = getAuthCookieOptions;
function getAuthCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";
    const cookieDomain = isProduction ? ".10xshivam.dev" : undefined;
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        domain: cookieDomain,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
}

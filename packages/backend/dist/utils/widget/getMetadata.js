"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadata = void 0;
const ua_parser_js_1 = require("ua-parser-js");
const formatTimeWithUTC_1 = require("./formatTimeWithUTC");
const getMetadata = async (req, metadata) => {
    try {
        const forwarded = req.headers["x-forwarded-for"];
        const ip = typeof forwarded === "string"
            ? forwarded.split(",")[0]
            : (req.socket.remoteAddress ?? null);
        const ua = (0, ua_parser_js_1.UAParser)(req.headers["user-agent"]);
        const browser = ua.browser.name
            ? `${ua.browser.name} ${ua.browser.version ? ua.browser.version.split(".")[0] : ""}`.trim()
            : null;
        const os = ua.os.name ?? null;
        const localTime = (0, formatTimeWithUTC_1.formatTimeWithUTC)(Date.now(), metadata.timezoneOffset ?? 0);
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const geo = await geoRes.json();
        return {
            ip,
            browser,
            os,
            localTime,
            language: metadata.language ?? null,
            currentUrl: metadata.currentUrl ?? null,
            city: geo.city ?? null,
            country: geo.country_name ?? null,
            timezone: geo.timezone ?? null,
            isp: geo.org ?? null,
        };
    }
    catch (error) {
        console.error("Error fetching metadata:", error);
        return {
            ip: null,
            browser: null,
            os: null,
            city: null,
            localTime: null,
            country: null,
            timezone: null,
            isp: null,
        };
    }
};
exports.getMetadata = getMetadata;

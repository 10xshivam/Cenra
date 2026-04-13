"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadata = void 0;
const ua_parser_js_1 = require("ua-parser-js");
const getMetadata = async (req) => {
    try {
        const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
            req.socket.remoteAddress ||
            null;
        const ua = (0, ua_parser_js_1.UAParser)(req.headers["user-agent"]);
        const browser = `${ua.browser.name} ${ua.browser.version}`;
        const os = `${ua.os.name} ${ua.os.version}`;
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const geo = await geoRes.json();
        const city = geo.city;
        const country = geo.country_name;
        const timezone = geo.timezone;
        const isp = geo.org;
        return { ip, browser, os, city, country, timezone, isp };
    }
    catch (error) {
        console.error("Error fetching metadata:", error);
        return {
            ip: null,
            browser: null,
            os: null,
            city: null,
            country: null,
            timezone: null,
            isp: null,
        };
    }
};
exports.getMetadata = getMetadata;
const getMetadata = async (req) => {
    try {
        const forwarded = req.headers["x-forwarded-for"];
        const rawIp = typeof forwarded === "string"
            ? forwarded.split(",")[0]
            : req.socket.remoteAddress ?? null;
        const ip = rawIp === "::1" || rawIp === "127.0.0.1" ? null : rawIp;
        const ua = (0, ua_parser_js_1.UAParser)(req.headers["user-agent"]);
        const browser = ua.browser.name
            ? `${ua.browser.name} ${ua.browser.version}`
            : null;
        const os = ua.os.name ?? null;
        if (!ip) {
            return {
                ip: null,
                browser,
                os,
                city: null,
                country: null,
                timezone: null,
                isp: null,
            };
        }
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const geo = await geoRes.json();
        return {
            ip,
            browser,
            os,
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
            country: null,
            timezone: null,
            isp: null,
        };
    }
};
exports.getMetadata = getMetadata;

import type { Request } from "express";
import { UAParser } from "ua-parser-js";
import { formatTimeWithUTC } from "./formatTimeWithUTC";

type AdditionalMetadata = {
  language: string | null;
  timezone: string | null;
  currentUrl: string | null;
  timezoneOffset: number | null;
};

export const getMetadata = async (
  req: Request,
  metadata: AdditionalMetadata
) => {
  try {
    const forwarded = req.headers["x-forwarded-for"];
    const ip =
      typeof forwarded === "string"
        ? forwarded.split(",")[0]
        : (req.socket.remoteAddress ?? null);

    const ua = UAParser(req.headers["user-agent"]);

    const browser = ua.browser.name
      ? `${ua.browser.name} ${
        ua.browser.version ? ua.browser.version.split(".")[0] : ""
      }`.trim()
      : null;

    const os = ua.os.name ?? null;

    const localTime = formatTimeWithUTC(
      Date.now(),
      metadata.timezoneOffset ?? 0
    );

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
  } catch (error) {
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

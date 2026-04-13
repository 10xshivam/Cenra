import type { Request } from "express";
type AdditionalMetadata = {
    language: string | null;
    timezone: string | null;
    currentUrl: string | null;
    timezoneOffset: number | null;
};
export declare const getMetadata: (req: Request, metadata: AdditionalMetadata) => Promise<{
    ip: string | null | undefined;
    browser: string | null;
    os: string | null;
    localTime: string;
    language: string | null;
    currentUrl: string | null;
    city: any;
    country: any;
    timezone: any;
    isp: any;
} | {
    ip: null;
    browser: null;
    os: null;
    city: null;
    localTime: null;
    country: null;
    timezone: null;
    isp: null;
    language?: undefined;
    currentUrl?: undefined;
}>;
export {};
//# sourceMappingURL=getMetadata.d.ts.map
import type { Request } from "express";
export type RequestMetadata = {
    ip: string | null;
    browser: string | null;
    os: string | null;
    city: string | null;
    country: string | null;
    timezone: string | null;
    isp: string | null;
};
export declare const getMetadata: (req: Request) => Promise<RequestMetadata>;
export declare const getMetadata: (req: Request) => Promise<{
    ip: null;
    browser: string | null;
    os: string | null;
    city: null;
    country: null;
    timezone: null;
    isp: null;
} | {
    ip: string;
    browser: string | null;
    os: string | null;
    city: any;
    country: any;
    timezone: any;
    isp: any;
}>;
//# sourceMappingURL=getMetadata.d.ts.map
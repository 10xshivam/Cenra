export declare const crawlPage: (url: string) => Promise<string | null>;
type CrawlResultItem = {
    page: string;
    content: string;
};
type CrawlResult = CrawlResultItem[];
export declare const crawlWebsitePages: (domain: string, paths?: string[]) => Promise<CrawlResult>;
export {};
//# sourceMappingURL=crawlPage.d.ts.map
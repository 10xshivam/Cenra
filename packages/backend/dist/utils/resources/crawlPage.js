"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlWebsitePages = exports.crawlPage = void 0;
const crawlPage = async (url) => {
    try {
        const headers = {
            "X-Engine": "cf-browser-rendering",
            "X-Return-Format": "markdown",
        };
        if (process.env.JINA_API_KEY) {
            headers.Authorization = `Bearer ${process.env.JINA_API_KEY}`;
        }
        const encodedUrl = encodeURIComponent(url);
        const response = await fetch(`https://r.jina.ai/${encodedUrl}`, { headers });
        const markdown = await response.text();
        return markdown;
    }
    catch (error) {
        console.error("Error crawling page:", error);
        return null;
    }
};
exports.crawlPage = crawlPage;
//   domain: string,
//   paths?: string[]
// ): Promise<CrawlResult> => {
//   const results: CrawlResult = {};
//   const hasProtocol = domain.startsWith("http://") || domain.startsWith("https://");
//   const baseUrl = hasProtocol ? domain : `https://${domain}`;
//   const trimmedBaseUrl = baseUrl.replace(/\/+$/, ""); // remove trailing slash
//   const effectivePaths =
//     paths && paths.length > 0 ? paths : ["/"];
//   const uniquePaths = Array.from(new Set(effectivePaths));
//   for (const path of uniquePaths) {
//     const normalizedPath =
//       path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
//     const fullUrl =
//       normalizedPath === "/"
//         ? trimmedBaseUrl
//         : `${trimmedBaseUrl}${normalizedPath}`;
//     const content = await crawlPage(fullUrl);
//     if (content) {
//       results[normalizedPath] = content;
//     }
//   }
//   return results;
// };
const crawlWebsitePages = async (domain, paths) => {
    const pageContentMap = {};
    const hasProtocol = domain.startsWith("http://") || domain.startsWith("https://");
    const baseUrl = hasProtocol ? domain : `https://${domain}`;
    const trimmedBaseUrl = baseUrl.replace(/\/+$/, "");
    const allPaths = (paths && paths.length > 0 ? paths : []).concat("/");
    const uniquePaths = Array.from(new Set(allPaths));
    for (const path of uniquePaths) {
        const normalizedPath = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
        const fullUrl = normalizedPath === "/"
            ? trimmedBaseUrl
            : `${trimmedBaseUrl}${normalizedPath}`;
        const content = await (0, exports.crawlPage)(fullUrl);
        if (content) {
            pageContentMap[normalizedPath] = content;
        }
    }
    const result = Object.entries(pageContentMap).map(([page, content]) => ({ page, content }));
    return result;
};
exports.crawlWebsitePages = crawlWebsitePages;

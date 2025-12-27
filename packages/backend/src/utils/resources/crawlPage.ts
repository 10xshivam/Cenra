export const crawlPage = async (url: string) => {
  try {
    const headers: Record<string, string> = {
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
  } catch (error) {
    console.error("Error crawling page:", error);
    return null;
  }
};

type CrawlResultItem = {
  page: string;
  content: string;
};

type CrawlResult = CrawlResultItem[];
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

export const crawlWebsitePages = async (
  domain: string,
  paths?: string[]
): Promise<CrawlResult> => {
  const pageContentMap: Record<string, string> = {};

  const hasProtocol =
    domain.startsWith("http://") || domain.startsWith("https://");
  const baseUrl = hasProtocol ? domain : `https://${domain}`;
  const trimmedBaseUrl = baseUrl.replace(/\/+$/, "");

  const allPaths = (paths && paths.length > 0 ? paths : []).concat("/");
  const uniquePaths = Array.from(new Set(allPaths));

  for (const path of uniquePaths) {
    const normalizedPath =
      path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;

    const fullUrl =
      normalizedPath === "/"
        ? trimmedBaseUrl
        : `${trimmedBaseUrl}${normalizedPath}`;

    const content = await crawlPage(fullUrl);

    if (content) {
      pageContentMap[normalizedPath] = content;
    }
  }

  const result: CrawlResult = Object.entries(pageContentMap).map(
    ([page, content]) => ({ page, content })
  );

  return result;
};

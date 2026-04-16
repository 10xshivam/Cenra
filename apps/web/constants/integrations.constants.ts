import { IconBrandHtml5, IconBrandReact, IconBrandNextjs, IconCodeCircle } from "@tabler/icons-react";

const widgetBaseUrl = (process.env.NEXT_PUBLIC_WIDGET_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");

export const integrations = [
    {
        id: "html",
        name: "HTML/Vanilla JS",
        description: "Embed Cenra in any plain HTML website.",
        icon: IconBrandHtml5,
        lang: "html",
        getCode: (workspaceId: string) => `<!-- Add this before the closing </body> tag -->\n<script src="${widgetBaseUrl}/widget.js" data-workspace-id="${workspaceId}"></script>`,
    },
    {
        id: "react",
        name: "React",
        description: "Add the widget to your React application.",
        icon: IconBrandReact,
        lang: "html",
        getCode: (workspaceId: string) => `<!-- In your index.html or public/index.html, add this before the closing </body> tag: -->\n<script src="${widgetBaseUrl}/widget.js" data-workspace-id="${workspaceId}"></script>`,
    },
    {
        id: "nextjs",
        name: "Next.js",
        description: "Integrate seamlessly with Next.js App or Pages router.",
        icon: IconBrandNextjs,
        lang: "tsx",
        getCode: (workspaceId: string) => `// In app/layout.tsx (App Router) or pages/_document.tsx (Pages Router):\nimport Script from 'next/script';\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="en">\n      <body>\n        {children}\n        <Script src="${widgetBaseUrl}/widget.js" data-workspace-id="${workspaceId}" strategy="lazyOnload" />\n      </body>\n    </html>\n  );\n}`,
    },
    {
        id: "other",
        name: "Other Stacks",
        description: "Works with WordPress, Webflow, Shopify, and more.",
        icon: IconCodeCircle,
        lang: "html",
        getCode: (workspaceId: string) => `<!-- Just paste this snippet in the custom HTML/Footer section of your platform -->\n<script src="${widgetBaseUrl}/widget.js" data-workspace-id="${workspaceId}"></script>`,
    },
];

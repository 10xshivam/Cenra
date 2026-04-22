import "@workspace/ui/globals.css";
import { Inter, PT_Serif } from "next/font/google";
import type { Viewport } from "next";
import { Providers } from "@/providers/providers";
import { DisableZoom } from "@/components/disable-zoom";
import { ViewTransitions } from "next-view-transitions";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const fontSerif = PT_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cenra.10xshivam.dev";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: "/cenra.png",
  },
  openGraph: {
    title: "Cenra - AI Agent for Customer Support",
    description: "AI Agent that actually understands your business",
    url: BASE_URL,
    siteName: "Cenra",
    images: [
      {
        url: `/opengraph.png`,
        width: 1200,
        height: 630,
        alt: "Cenra",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cenra - AI Agent for Customer Support",
    description: "AI Agent that actually understands your business",
    images: ["/opengraph.png"],
    creator: "@cenra",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning className="light no-scrollbar" style={{ colorScheme: "light" }}>
        <body
          className={`${fontSans.variable} ${fontSerif.variable} no-scrollbar font-sans antialiased bg-amber-50 selection:bg-emerald-800/5 box-border`}
        >
          <Providers>
            <DisableZoom />
            {children}
          </Providers>
          <Toaster position="top-center" />
          <Analytics />
        </body>
      </html>
    </ViewTransitions>
  );
}


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

export const metadata = {
  icons: {
    icon: "/favicon.svg",
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


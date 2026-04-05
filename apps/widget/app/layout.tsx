import { Geist, Geist_Mono } from "next/font/google";
import type { Viewport } from "next";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { DisableZoom } from "@/components/disable-zoom";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light" style={{ colorScheme: "light" }}>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased w-screen h-screen overflow-hidden bg-transparent`}
      >
        <Providers>
          <DisableZoom />
          <div className="w-full h-full overflow-hidden">{children}</div>
        </Providers>
      </body>
    </html>
  );
}


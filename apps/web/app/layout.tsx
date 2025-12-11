import "@workspace/ui/globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/providers/providers";
import { ViewTransitions } from "next-view-transitions";
import { Toaster } from "sonner";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${fontSans.variable} font-sans antialiased bg-white selection:bg-emerald-900/20  box-border`}
        >
          <Providers>{children}</Providers>
          <Toaster position="top-center" />
        </body>
      </html>
    </ViewTransitions>
  );
}

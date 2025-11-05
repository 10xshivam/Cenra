import { Geist, Geist_Mono,Inter } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/providers/providers"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900"
  ],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} font-sans antialiased bg-neutral-50 `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

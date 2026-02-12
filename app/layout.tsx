import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "Dallas AI Direct",
  description:
    "See who is in the room. Real-time attendee directory for Dallas AI events.",
}

export const viewport: Viewport = {
  themeColor: "#0f0f11",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <SharedHeader />
        <main>{children}</main>
        <SharedFooter />
      </body>
    </html>
  )
}

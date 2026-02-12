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
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col font-sans">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SharedHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SharedFooter />
      </body>
    </html>
  )
}

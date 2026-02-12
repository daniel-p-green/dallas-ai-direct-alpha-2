import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { EnvironmentBanner } from "@/components/environment-banner"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "Room Board - Dallas AI Events",
  description:
    "Real-time attendee visibility for Dallas AI events. See who is in the room with privacy-first design.",
}

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`${GeistSans.className} min-h-screen bg-background text-foreground`}>
        <EnvironmentBanner />
        <SharedHeader />
        <main className="mx-auto w-full max-w-5xl px-4 pb-8 md:px-6">
          {children}
        </main>
        <SharedFooter />
      </body>
    </html>
  )
}

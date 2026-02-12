import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { EnvironmentBanner } from "@/components/environment-banner"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "Dallas AI Direct Alpha",
  description:
    "Live attendee room board for Dallas AI meetups. See who is in the room with privacy-first attendee signals.",
}

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`${GeistSans.className} min-h-screen`}>
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

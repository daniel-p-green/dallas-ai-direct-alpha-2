import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "Room Board / Dallas AI",
  description:
    "Real-time attendee visibility for Dallas AI events. Privacy-first design.",
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <SharedHeader />
        <main className="mx-auto w-full max-w-[960px] px-6 py-8 md:py-12">
          {children}
        </main>
        <SharedFooter />
      </body>
    </html>
  )
}

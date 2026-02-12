"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export function SharedHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/dallas-ai-logo-white.png"
            alt="Dallas AI Direct"
            width={100}
            height={28}
            priority
            className="h-5 w-auto"
          />
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/signup"
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              pathname === "/signup"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Join
          </Link>
          <Link
            href="/room"
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              pathname === "/room"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Directory
          </Link>
        </nav>
      </div>
    </header>
  )
}

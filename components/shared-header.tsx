"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SharedHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav
        className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-3"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="focus-ring flex items-center gap-2.5 rounded-md"
        >
          <Image
            src="/brand/dallas-ai-logo-white.png"
            alt=""
            width={120}
            height={32}
            priority
            className="h-7 w-auto"
          />
          <span className="sr-only">Dallas AI Direct</span>
        </Link>

        <div className="flex items-center gap-1" role="list">
          <NavLink href="/signup" active={pathname === "/signup"}>
            Join
          </NavLink>
          <NavLink href="/room" active={pathname === "/room"}>
            Directory
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`focus-ring rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  )
}

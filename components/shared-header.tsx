import Link from "next/link"
import Image from "next/image"

export function SharedHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[960px] items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/dallas-ai-logo-white.png"
            alt="Dallas AI"
            width={120}
            height={32}
            priority
            className="h-6 w-auto"
          />
          <span className="text-xs text-muted-foreground" aria-hidden="true">/</span>
          <span className="text-sm font-medium tracking-tight">Room Board</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/signup"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign Up
          </Link>
          <Link
            href="/room"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Board
          </Link>
        </nav>
      </div>
    </header>
  )
}

import Link from "next/link"

export function SharedHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="font-bold tracking-tight">
          Room Board
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/signup"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign Up
          </Link>
          <Link
            href="/room"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Room Board
          </Link>
        </nav>
      </div>
    </header>
  )
}

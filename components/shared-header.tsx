import Image from "next/image"
import Link from "next/link"

export function SharedHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 pt-6 pb-4 md:px-6">
      <Link href="/" className="flex shrink-0 items-center gap-3">
        <Image
          src="/brand/dallas-ai-logo-color.png"
          alt="Dallas AI"
          width={148}
          height={40}
          priority
          className="h-auto w-[120px] md:w-[148px]"
        />
      </Link>
      <nav className="ml-auto flex items-center gap-4">
        <Link
          href="/signup"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign Up
        </Link>
        <Link
          href="/room"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Room Board
        </Link>
      </nav>
    </header>
  )
}

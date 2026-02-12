import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-8 py-12 text-center md:py-20">
      <Image
        src="/brand/dallas-ai-logo-color.png"
        alt="Dallas AI"
        width={200}
        height={54}
        priority
        className="h-auto w-[160px] md:w-[200px]"
      />
      <div className="flex max-w-2xl flex-col gap-4">
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl">
          See who is in the room
        </h1>
        <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Dallas AI Direct Alpha shows a public-safe attendee board with
          database-boundary access control and consent-first profile visibility.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/signup"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius)] bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Join via QR
        </Link>
        <Link
          href="/room"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius)] border border-border bg-card px-6 text-sm font-semibold text-card-foreground transition-colors hover:bg-accent"
        >
          View Room Board
        </Link>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Email stays private and never appears on the public board.</span>
      </div>
    </section>
  )
}

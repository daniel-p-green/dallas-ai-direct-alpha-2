import Link from "next/link"

export function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-8 py-20 text-center md:py-32">
      <div className="flex max-w-2xl flex-col gap-4">
        <h1 className="text-balance text-4xl font-bold leading-tight md:text-6xl">
          See who is in the room
        </h1>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Real-time attendee visibility for Dallas AI events. Privacy-first design with database-boundary access control.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/signup"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Join Event
        </Link>
        <Link
          href="/room"
          className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-secondary"
        >
          View Room Board
        </Link>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
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

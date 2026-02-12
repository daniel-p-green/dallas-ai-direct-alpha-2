import Link from "next/link"

export function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-10 py-16 text-center md:py-28">
      <div className="inline-flex items-center rounded-full border border-border px-3 py-1">
        <span className="font-mono text-xs text-muted-foreground">alpha preview</span>
      </div>

      <div className="flex max-w-xl flex-col gap-5">
        <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
          See who is in the room.
        </h1>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground">
          Real-time attendee board for Dallas AI events. Scan the QR, join the room, connect with intent.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/signup"
          className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          Join Event
        </Link>
        <Link
          href="/room"
          className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          View Board
        </Link>
      </div>

      <div className="grid w-full max-w-lg grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
        <div className="flex flex-col items-center gap-1 bg-background px-4 py-5">
          <span className="font-mono text-2xl font-semibold tracking-tight">5s</span>
          <span className="text-xs text-muted-foreground">Polling interval</span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-background px-4 py-5">
          <span className="font-mono text-2xl font-semibold tracking-tight">0</span>
          <span className="text-xs text-muted-foreground">Emails exposed</span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-background px-4 py-5">
          <span className="font-mono text-2xl font-semibold tracking-tight">RLS</span>
          <span className="text-xs text-muted-foreground">Privacy boundary</span>
        </div>
      </div>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Privacy-first. Email never leaves the database boundary.
      </p>
    </section>
  )
}

import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center overflow-hidden px-5 pb-20 pt-24 text-center md:pb-28 md:pt-36">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2"
        style={{
          background: "radial-gradient(ellipse at center, hsl(217 91% 60% / 0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <p className="mb-6 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
        Dallas AI Events
      </p>

      <h1 className="max-w-[14ch] text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
        See who is in the room.
      </h1>

      <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
        Scan the QR code at the event, share your signal, and discover who you should be talking to.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/signup"
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 active:scale-[0.98]"
        >
          Join the Event
        </Link>
        <Link
          href="/room"
          className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-semibold text-card-foreground transition-all hover:bg-secondary active:scale-[0.98]"
        >
          View Directory
        </Link>
      </div>

      {/* Feature pills */}
      <div className="mt-14 flex flex-wrap justify-center gap-2">
        {[
          { label: "Real-time", desc: "5s refresh" },
          { label: "Privacy-first", desc: "Email stays hidden" },
          { label: "Intent signals", desc: "Help offered & needed" },
        ].map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2"
          >
            <span className="text-xs font-medium text-foreground">{f.label}</span>
            <span className="text-xs text-muted-foreground">{f.desc}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

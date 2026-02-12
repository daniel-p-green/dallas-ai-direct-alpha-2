import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center overflow-hidden px-5 pb-24 pt-28 text-center md:pb-32 md:pt-40">
      {/* Ambient glow -- purely decorative */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[600px] opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, hsl(217 91% 60% / 0.15), transparent)",
        }}
        aria-hidden="true"
      />

      <h1 className="max-w-[640px] text-balance text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-tight">
        See who is in the room.
      </h1>

      <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg md:leading-relaxed">
        Real-time attendee directory for Dallas AI events.
        Scan the QR, share your signal, find your people.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/signup"
          className="focus-ring inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 active:scale-[0.98]"
        >
          Join the Event
        </Link>
        <Link
          href="/room"
          className="focus-ring inline-flex h-12 items-center justify-center rounded-full border border-border px-8 text-sm font-semibold transition-colors hover:bg-secondary active:scale-[0.98]"
        >
          View Directory
        </Link>
      </div>

      {/* Value propositions */}
      <dl className="mt-16 grid w-full max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
        {[
          { term: "Real-time", def: "5 s refresh" },
          { term: "Privacy-first", def: "Email hidden" },
          { term: "Intent signals", def: "Help offered" },
        ].map((item) => (
          <div
            key={item.term}
            className="flex flex-col items-center gap-1 bg-card px-3 py-4"
          >
            <dt className="text-xs font-semibold">{item.term}</dt>
            <dd className="text-[11px] text-muted-foreground">{item.def}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

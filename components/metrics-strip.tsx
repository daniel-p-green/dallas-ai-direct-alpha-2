import type { Attendee } from "@/components/attendee-card"

export function MetricsStrip({ attendees }: { attendees: Attendee[] }) {
  const count = attendees.length
  const avgComfort =
    count > 0
      ? (
          attendees.reduce((sum, a) => sum + a.ai_comfort_level, 0) / count
        ).toFixed(1)
      : "0.0"
  const highPct =
    count > 0
      ? Math.round(
          (attendees.filter((a) => a.ai_comfort_level >= 4).length / count) *
            100
        )
      : 0

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-[var(--radius)] border border-border bg-card p-3">
        <p className="text-xs text-muted-foreground">Total Attendees</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-card-foreground">
          {count}
        </p>
      </div>
      <div className="rounded-[var(--radius)] border border-border bg-card p-3">
        <p className="text-xs text-muted-foreground">Avg Comfort</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-card-foreground">
          {avgComfort}
        </p>
      </div>
      <div className="rounded-[var(--radius)] border border-border bg-card p-3">
        <p className="text-xs text-muted-foreground">Comfort 4-5</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-card-foreground">
          {highPct}%
        </p>
      </div>
    </div>
  )
}

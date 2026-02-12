import type { Attendee } from "@/components/attendee-card"

export function MetricsStrip({ attendees }: { attendees: Attendee[] }) {
  const count = attendees.length
  const avgComfort =
    count > 0
      ? (attendees.reduce((sum, a) => sum + a.ai_comfort_level, 0) / count).toFixed(1)
      : "0.0"
  const highPct =
    count > 0
      ? Math.round(
          (attendees.filter((a) => a.ai_comfort_level >= 4).length / count) * 100
        )
      : 0

  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
      <div className="flex flex-col gap-0.5 bg-background px-4 py-3">
        <span className="font-mono text-xl font-semibold tracking-tight">{count}</span>
        <span className="text-[11px] text-muted-foreground">Attendees</span>
      </div>
      <div className="flex flex-col gap-0.5 bg-background px-4 py-3">
        <span className="font-mono text-xl font-semibold tracking-tight">{avgComfort}</span>
        <span className="text-[11px] text-muted-foreground">Avg Comfort</span>
      </div>
      <div className="flex flex-col gap-0.5 bg-background px-4 py-3">
        <span className="font-mono text-xl font-semibold tracking-tight">{highPct}%</span>
        <span className="text-[11px] text-muted-foreground">{"Comfort 4+"}</span>
      </div>
    </div>
  )
}

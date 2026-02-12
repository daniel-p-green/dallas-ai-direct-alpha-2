import type { Attendee } from "@/components/attendee-card"

export function MetricsStrip({ attendees }: { attendees: Attendee[] }) {
  const count = attendees.length
  const avgComfort =
    count > 0
      ? (
          attendees.reduce((sum, a) => sum + a.ai_comfort_level, 0) / count
        ).toFixed(1)
      : "0"
  const highPct =
    count > 0
      ? Math.round(
          (attendees.filter((a) => a.ai_comfort_level >= 4).length / count) *
            100
        )
      : 0

  return (
    <div
      className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border"
      role="region"
      aria-label="Attendee statistics"
    >
      <Metric value={String(count)} label="Attendees" />
      <Metric value={avgComfort} label="Avg Comfort" />
      <Metric value={`${highPct}%`} label="Advanced" />
    </div>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-card py-4">
      <span className="text-xl font-bold tabular-nums tracking-tight md:text-2xl">
        {value}
      </span>
      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

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
    <div className="flex gap-2 overflow-x-auto pb-1">
      <MetricCard value={String(count)} label="Attendees" />
      <MetricCard value={avgComfort} label="Avg Comfort" />
      <MetricCard value={`${highPct}%`} label="Advanced (4+)" />
    </div>
  )
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-[120px] flex-1 flex-col gap-1 rounded-2xl border border-border bg-card p-4">
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

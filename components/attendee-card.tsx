import { ComfortDots } from "@/components/comfort-dots"
import { LinkedinIcon } from "@/components/linkedin-icon"

export type Attendee = {
  name: string
  title?: string
  company?: string
  linkedin_url?: string
  ai_comfort_level: number
  help_offered: string[]
  created_at: string
}

const COMFORT_LABELS: Record<number, string> = {
  1: "Exploring",
  2: "Learning",
  3: "Building",
  4: "Shipping",
  5: "Leading",
}

export function AttendeeCard({
  attendee,
  isNew,
}: {
  attendee: Attendee
  isNew: boolean
}) {
  const subtitle = [attendee.title, attendee.company].filter(Boolean).join(" at ") || null
  const initials = attendee.name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={`group rounded-2xl border border-border bg-card p-4 transition-all hover:border-border hover:bg-secondary/50 ${isNew ? "just-joined card-enter" : ""}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          {initials}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="truncate text-[15px] font-semibold leading-tight">{attendee.name}</span>
            {attendee.linkedin_url && (
              <a
                href={attendee.linkedin_url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${attendee.name} on LinkedIn`}
                className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
              >
                <LinkedinIcon size={14} />
              </a>
            )}
          </div>
          {subtitle && (
            <span className="truncate text-sm text-muted-foreground">{subtitle}</span>
          )}

          {/* Comfort bar inline */}
          <div className="mt-1.5 flex items-center gap-2">
            <ComfortDots level={attendee.ai_comfort_level} />
            <span className="text-xs text-muted-foreground">
              {COMFORT_LABELS[attendee.ai_comfort_level] ?? `Level ${attendee.ai_comfort_level}`}
            </span>
          </div>
        </div>
      </div>

      {/* Help tags */}
      {attendee.help_offered.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 pl-[54px]">
          {attendee.help_offered.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-accent-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

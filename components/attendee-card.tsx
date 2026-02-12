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

export function AttendeeCard({
  attendee,
  isNew,
}: {
  attendee: Attendee
  isNew: boolean
}) {
  const subtitle =
    [attendee.title, attendee.company].filter(Boolean).join(" · ") ||
    "Profile private"

  return (
    <article
      className={`flex items-center gap-3 rounded-[var(--radius)] border border-border bg-card p-3 md:gap-4 md:p-4 ${isNew ? "just-joined" : ""}`}
    >
      {/* Name block */}
      <div className="flex min-w-0 flex-1 flex-col">
        <strong className="truncate text-sm font-semibold text-card-foreground">
          {attendee.name}
        </strong>
        <span className="truncate text-xs text-muted-foreground">
          {subtitle}
        </span>
      </div>

      {/* Comfort */}
      <div className="hidden shrink-0 sm:block">
        <ComfortDots level={attendee.ai_comfort_level} />
      </div>

      {/* Help offered */}
      <span className="hidden shrink-0 text-xs text-muted-foreground md:block">
        {attendee.help_offered.join(", ") || "--"}
      </span>

      {/* LinkedIn */}
      {attendee.linkedin_url ? (
        <a
          href={attendee.linkedin_url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${attendee.name} LinkedIn profile`}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
        >
          <LinkedinIcon size={14} />
        </a>
      ) : (
        <div className="h-8 w-8 shrink-0" aria-hidden="true" />
      )}
    </article>
  )
}

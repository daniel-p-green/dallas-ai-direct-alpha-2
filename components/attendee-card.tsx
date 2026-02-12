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
  const subtitle = [attendee.title, attendee.company].filter(Boolean).join(" at ") || null

  return (
    <div
      className={`flex items-center gap-4 border-b border-border px-1 py-3 last:border-b-0 ${isNew ? "just-joined" : ""}`}
    >
      {/* Avatar initial */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
        {attendee.name.charAt(0).toUpperCase()}
      </div>

      {/* Name block */}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{attendee.name}</span>
        {subtitle && (
          <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
        )}
      </div>

      {/* Help tags */}
      <div className="hidden items-center gap-1 sm:flex">
        {attendee.help_offered.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="inline-flex rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {attendee.help_offered.length > 2 && (
          <span className="font-mono text-[10px] text-muted-foreground">
            +{attendee.help_offered.length - 2}
          </span>
        )}
      </div>

      {/* Comfort */}
      <div className="hidden shrink-0 md:block">
        <ComfortDots level={attendee.ai_comfort_level} />
      </div>

      {/* LinkedIn */}
      {attendee.linkedin_url ? (
        <a
          href={attendee.linkedin_url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${attendee.name} on LinkedIn`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
        >
          <LinkedinIcon size={14} />
        </a>
      ) : (
        <div className="h-7 w-7 shrink-0" aria-hidden="true" />
      )}
    </div>
  )
}

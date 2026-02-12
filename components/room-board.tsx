"use client"

import { useEffect, useMemo, useState } from "react"
import {
  getSupabaseBrowserClient,
  hasSupabaseBrowserEnv,
} from "@/lib/supabase/browser"
import { AttendeeCard, type Attendee } from "@/components/attendee-card"
import { MetricsStrip } from "@/components/metrics-strip"

const SEED_ATTENDEES: Attendee[] = [
  {
    name: "Attendee One",
    title: "Engineering Lead",
    company: "Community Co",
    linkedin_url: "https://linkedin.com",
    ai_comfort_level: 4,
    help_offered: ["Mentoring"],
    created_at: new Date(Date.now() - 10_000).toISOString(),
  },
  {
    name: "Attendee Two",
    linkedin_url: "https://linkedin.com",
    ai_comfort_level: 3,
    help_offered: ["Hiring"],
    created_at: new Date(Date.now() - 3_000).toISOString(),
  },
]

export function RoomBoard() {
  const fallback = useMemo(
    () =>
      [...SEED_ATTENDEES].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    []
  )

  const [attendees, setAttendees] = useState<Attendee[]>(fallback)
  const [dataMode, setDataMode] = useState<"live" | "fallback">(
    hasSupabaseBrowserEnv() ? "live" : "fallback"
  )
  const [loadMessage, setLoadMessage] = useState<string | null>(null)
  const [lastPollAt, setLastPollAt] = useState(Date.now())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      if (!hasSupabaseBrowserEnv()) {
        if (active) {
          setDataMode("fallback")
          setLoadMessage(
            "Showing demo seed data. Configure public Supabase variables for live room data."
          )
          setAttendees(fallback)
          setLastPollAt(Date.now())
        }
        return
      }

      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase
          .from("attendees_public")
          .select(
            "name,title,company,linkedin_url,ai_comfort_level,help_offered,created_at"
          )
          .order("created_at", { ascending: false })
          .limit(200)

        if (error) {
          if (active) {
            setDataMode("fallback")
            setLoadMessage(
              "Live room data is unavailable. Showing demo seed data."
            )
            setAttendees(fallback)
            setLastPollAt(Date.now())
          }
          return
        }

        const mapped: Attendee[] = (data ?? []).map((row) => ({
          name:
            typeof row.name === "string" && row.name.trim().length > 0
              ? row.name
              : "Attendee",
          title: typeof row.title === "string" ? row.title : undefined,
          company: typeof row.company === "string" ? row.company : undefined,
          linkedin_url:
            typeof row.linkedin_url === "string"
              ? row.linkedin_url
              : undefined,
          ai_comfort_level:
            typeof row.ai_comfort_level === "number"
              ? row.ai_comfort_level
              : 1,
          help_offered: Array.isArray(row.help_offered)
            ? row.help_offered.filter(
                (v): v is string => typeof v === "string"
              )
            : [],
          created_at:
            typeof row.created_at === "string"
              ? row.created_at
              : new Date().toISOString(),
        }))

        if (active) {
          setDataMode("live")
          setLoadMessage(null)
          setAttendees(mapped)
          setLastPollAt(Date.now())
        }
      } catch {
        if (active) {
          setDataMode("fallback")
          setLoadMessage(
            "Live room data is unavailable. Showing demo seed data."
          )
          setAttendees(fallback)
          setLastPollAt(Date.now())
        }
      }
    }

    setMounted(true)
    load()
    const timer = setInterval(load, 5000)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [fallback])

  const elapsed = Math.max(1, Math.floor((Date.now() - lastPollAt) / 1000))

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
            Who is in the room?
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              Public view -- emails excluded
            </span>
            <span className="text-xs text-muted-foreground">
              Data:{" "}
              {dataMode === "live"
                ? "Live attendees_public feed"
                : "Fallback demo seed"}
            </span>
          </div>
        </div>
        <span className="mt-1 text-xs text-muted-foreground">
          Updated {mounted ? `${elapsed}s ago` : "..."}
        </span>
      </div>

      {/* Load message */}
      {loadMessage && (
        <p className="text-sm text-muted-foreground">{loadMessage}</p>
      )}

      {/* Metrics */}
      <MetricsStrip attendees={attendees} />

      {/* Attendee list */}
      <div className="flex flex-col gap-2">
        {attendees.map((a) => {
          const isNew =
            mounted &&
            Date.now() - new Date(a.created_at).getTime() <= 5000
          return (
            <AttendeeCard
              key={`${a.name}-${a.created_at}`}
              attendee={a}
              isNew={isNew}
            />
          )
        })}
        {attendees.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No attendees yet. Be the first to sign up.
          </p>
        )}
      </div>
    </div>
  )
}

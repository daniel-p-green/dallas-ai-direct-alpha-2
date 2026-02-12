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
    name: "Jordan Chen",
    title: "ML Engineer",
    company: "Vertex Labs",
    linkedin_url: "https://linkedin.com",
    ai_comfort_level: 4,
    help_offered: ["Mentoring", "Hiring"],
    created_at: new Date(Date.now() - 120_000).toISOString(),
  },
  {
    name: "Priya Sharma",
    title: "Product Lead",
    company: "Nexus AI",
    linkedin_url: "https://linkedin.com",
    ai_comfort_level: 5,
    help_offered: ["Partnering"],
    created_at: new Date(Date.now() - 60_000).toISOString(),
  },
  {
    name: "Marcus Rivera",
    linkedin_url: "https://linkedin.com",
    ai_comfort_level: 2,
    help_offered: ["Learning"],
    created_at: new Date(Date.now() - 30_000).toISOString(),
  },
  {
    name: "Sarah Kim",
    title: "CTO",
    company: "DataFlow",
    ai_comfort_level: 5,
    help_offered: ["Investing", "Mentoring"],
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      if (!hasSupabaseBrowserEnv()) {
        if (active) {
          setDataMode("fallback")
          setLoadMessage(
            "Showing seed data. Connect Supabase for live attendees."
          )
          setAttendees(fallback)
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
            setLoadMessage("Live data unavailable. Showing seed data.")
            setAttendees(fallback)
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
            typeof row.linkedin_url === "string" ? row.linkedin_url : undefined,
          ai_comfort_level:
            typeof row.ai_comfort_level === "number" ? row.ai_comfort_level : 1,
          help_offered: Array.isArray(row.help_offered)
            ? row.help_offered.filter((v): v is string => typeof v === "string")
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
        }
      } catch {
        if (active) {
          setDataMode("fallback")
          setLoadMessage("Live data unavailable. Showing seed data.")
          setAttendees(fallback)
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Room Board</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mounted ? `${attendees.length} attendee${attendees.length !== 1 ? "s" : ""}` : "Loading..."}{" "}
            <span className="font-mono text-[11px]">
              {dataMode === "live" ? "LIVE" : "SEED"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${dataMode === "live" ? "bg-[hsl(var(--success))]" : "bg-muted-foreground"}`} />
          <span className="font-mono text-[11px] text-muted-foreground">
            {dataMode === "live" ? "attendees_public" : "seed_data"}
          </span>
        </div>
      </div>

      {/* Load message */}
      {loadMessage && (
        <div className="rounded-md border border-border bg-secondary px-3 py-2 text-xs text-muted-foreground">
          {loadMessage}
        </div>
      )}

      {/* Metrics */}
      <MetricsStrip attendees={attendees} />

      {/* Attendee list */}
      <div className="rounded-lg border border-border bg-card px-4">
        {attendees.map((a) => {
          const isNew = mounted && Date.now() - new Date(a.created_at).getTime() <= 5000
          return (
            <AttendeeCard
              key={`${a.name}-${a.created_at}`}
              attendee={a}
              isNew={isNew}
            />
          )
        })}
        {attendees.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No attendees yet. Be the first to sign up.
          </p>
        )}
      </div>
    </div>
  )
}

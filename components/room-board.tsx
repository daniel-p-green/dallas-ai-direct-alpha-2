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
  {
    name: "Alex Thompson",
    title: "Founder",
    company: "AI Studio",
    linkedin_url: "https://linkedin.com",
    ai_comfort_level: 3,
    help_offered: ["Hiring", "Partnering"],
    created_at: new Date(Date.now() - 180_000).toISOString(),
  },
  {
    name: "Lisa Wong",
    title: "Data Scientist",
    company: "TechCorp",
    ai_comfort_level: 4,
    help_offered: ["Mentoring", "Learning"],
    created_at: new Date(Date.now() - 240_000).toISOString(),
  },
]

const ALL_FILTERS = ["All", "Hiring", "Mentoring", "Partnering", "Investing", "Learning", "Selling"] as const

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
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("All")

  const filtered = useMemo(() => {
    let result = attendees
    if (activeFilter !== "All") {
      result = result.filter((a) => a.help_offered.includes(activeFilter))
    }
    if (search.trim().length > 0) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.title && a.title.toLowerCase().includes(q)) ||
          (a.company && a.company.toLowerCase().includes(q))
      )
    }
    return result
  }, [attendees, activeFilter, search])

  useEffect(() => {
    let active = true

    async function load() {
      if (!hasSupabaseBrowserEnv()) {
        if (active) {
          setDataMode("fallback")
          setLoadMessage(
            "Showing sample data. Connect Supabase to see live attendees."
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
            setLoadMessage("Live data unavailable. Showing sample data.")
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
          setLoadMessage("Live data unavailable. Showing sample data.")
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
    <div className="mx-auto w-full max-w-3xl px-5 py-8 md:py-12">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Directory</h1>
          <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${dataMode === "live" ? "bg-[hsl(var(--success))]" : "bg-muted-foreground"}`} />
            <span className="text-[11px] font-medium text-muted-foreground">
              {dataMode === "live" ? "Live" : "Sample"}
            </span>
          </span>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {mounted ? `${attendees.length} attendee${attendees.length !== 1 ? "s" : ""} in the room` : "Loading attendees..."}
        </p>
      </div>

      {/* Load message */}
      {loadMessage && (
        <div className="mb-5 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          {loadMessage}
        </div>
      )}

      {/* Metrics */}
      <div className="mb-6">
        <MetricsStrip attendees={attendees} />
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          placeholder="Search by name, title, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
        />
      </div>

      {/* Filter chips */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {ALL_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-all active:scale-95 ${
              activeFilter === filter
                ? "border-primary/40 bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Attendee cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((a) => {
          const isNew = mounted && Date.now() - new Date(a.created_at).getTime() <= 5000
          return (
            <AttendeeCard
              key={`${a.name}-${a.created_at}`}
              attendee={a}
              isNew={isNew}
            />
          )
        })}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              {search || activeFilter !== "All"
                ? "No attendees match your filters."
                : "No attendees yet. Be the first to join."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

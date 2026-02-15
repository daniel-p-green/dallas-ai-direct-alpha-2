"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

/* ---------- Types ---------- */
interface AdminAttendee {
  id: string
  name: string
  email: string
  title: string | null
  company: string | null
  linkedin_url: string | null
  display_title_company: boolean
  ai_comfort_level: number
  help_needed: string[]
  help_offered: string[]
  honeypot: string | null
  created_at: string
}

interface Stats {
  total: number
  avgComfort: number
  today: number
  spam: number
}

/* ---------- Component ---------- */
export default function AdminPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [attendees, setAttendees] = useState<AdminAttendee[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)

  /* Auth check */
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((json) => {
        if (!json.user) {
          router.push("/login")
        } else {
          setAuthed(true)
        }
      })
      .catch(() => router.push("/login"))
  }, [router])

  /* Data loading */
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [attRes, statsRes] = await Promise.all([
        fetch("/api/admin/attendees"),
        fetch("/api/admin/stats"),
      ])
      const attJson = await attRes.json()
      const statsJson = await statsRes.json()
      if (attJson.data) setAttendees(attJson.data)
      if (!statsJson.error) setStats(statsJson)
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authed) loadData()
  }, [authed, loadData])

  /* Actions */
  async function handleDelete(ids: string[]) {
    if (!confirm(`Delete ${ids.length} attendee(s)? This cannot be undone.`)) return
    for (const id of ids) {
      await fetch("/api/admin/attendees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
    }
    setSelected(new Set())
    loadData()
  }

  async function handleUpdate(id: string, fields: Partial<AdminAttendee>) {
    await fetch("/api/admin/attendees", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...fields }),
    })
    setEditingId(null)
    loadData()
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((a) => a.id)))
    }
  }

  /* Filter */
  const filtered = attendees.filter((a) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.company || "").toLowerCase().includes(q) ||
      (a.title || "").toLowerCase().includes(q)
    )
  })

  if (!authed) return null

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/dallas-ai-logo-white.png"
            alt=""
            width={100}
            height={27}
            className="h-6 w-auto"
          />
          <span className="h-5 w-px bg-border" aria-hidden="true" />
          <h1 className="text-lg font-semibold">Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/room"
            className="focus-ring rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-secondary"
          >
            View Public Board
          </a>
          <button
            onClick={handleLogout}
            className="focus-ring rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total Attendees" value={String(stats.total)} />
          <StatCard label="Joined Today" value={String(stats.today)} />
          <StatCard label="Avg Comfort" value={String(stats.avgComfort)} />
          <StatCard label="Spam Caught" value={String(stats.spam)} />
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <label htmlFor="admin-search" className="sr-only">Search attendees</label>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="admin-search"
            type="search"
            placeholder="Search by name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input h-10 rounded-xl pl-10 text-[13px]"
          />
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button
              onClick={() => handleDelete(Array.from(selected))}
              className="focus-ring inline-flex h-10 items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
            >
              Delete {selected.size}
            </button>
          )}
          <button
            onClick={loadData}
            className="focus-ring inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-4 text-xs font-medium transition-colors hover:bg-secondary"
          >
            Refresh
          </button>
          <span className="text-xs text-muted-foreground">
            {filtered.length} of {attendees.length}
          </span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
          Loading attendees...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-center text-sm text-muted-foreground">
          <p>No attendees found.</p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-primary underline underline-offset-2"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile: card layout */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                checked={selected.size === filtered.length && filtered.length > 0}
                onChange={toggleSelectAll}
                className="focus-ring rounded"
                aria-label="Select all attendees"
              />
              <span className="text-xs text-muted-foreground">Select all</span>
            </div>
            {filtered.map((a) => (
              <MobileAttendeeCard
                key={a.id}
                attendee={a}
                selected={selected.has(a.id)}
                onToggleSelect={() => toggleSelect(a.id)}
                onDelete={() => handleDelete([a.id])}
              />
            ))}
          </div>

          {/* Desktop: table layout */}
          <div className="hidden overflow-x-auto rounded-2xl border border-border md:block">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-border bg-card text-xs text-muted-foreground">
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="focus-ring rounded"
                    aria-label="Select all attendees"
                  />
                </th>
                <th className="px-3 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Email</th>
                <th className="px-3 py-3 font-medium">Title / Company</th>
                <th className="px-3 py-3 font-medium">Comfort</th>
                <th className="hidden px-3 py-3 font-medium lg:table-cell">Joined</th>
                <th className="px-3 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <AttendeeRow
                  key={a.id}
                  attendee={a}
                  selected={selected.has(a.id)}
                  editing={editingId === a.id}
                  onToggleSelect={() => toggleSelect(a.id)}
                  onEdit={() => setEditingId(a.id)}
                  onCancelEdit={() => setEditingId(null)}
                  onSave={(fields) => handleUpdate(a.id, fields)}
                  onDelete={() => handleDelete([a.id])}
                />
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  )
}

/* ---------- Sub-components ---------- */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card px-4 py-4">
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function AttendeeRow({
  attendee: a,
  selected,
  editing,
  onToggleSelect,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: {
  attendee: AdminAttendee
  selected: boolean
  editing: boolean
  onToggleSelect: () => void
  onEdit: () => void
  onCancelEdit: () => void
  onSave: (fields: Partial<AdminAttendee>) => void
  onDelete: () => void
}) {
  const [name, setName] = useState(a.name)
  const [email, setEmail] = useState(a.email)
  const [title, setTitle] = useState(a.title || "")
  const [company, setCompany] = useState(a.company || "")

  useEffect(() => {
    setName(a.name)
    setEmail(a.email)
    setTitle(a.title || "")
    setCompany(a.company || "")
  }, [a])

  const isSpam = a.honeypot && a.honeypot.length > 0
  const joinDate = new Date(a.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <tr
      className={`border-b border-border/50 transition-colors hover:bg-card/60 ${
        isSpam ? "opacity-50" : ""
      } ${selected ? "bg-primary/5" : ""}`}
    >
      <td className="px-3 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="focus-ring rounded"
          aria-label={`Select ${a.name}`}
        />
      </td>
      <td className="px-3 py-3">
        {editing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-2 py-1 text-[13px]"
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-medium">{a.name}</span>
            {isSpam && (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                SPAM
              </span>
            )}
          </div>
        )}
      </td>
      <td className="px-3 py-3">
        {editing ? (
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-2 py-1 text-[13px]"
          />
        ) : (
          <span className="text-muted-foreground">{a.email}</span>
        )}
      </td>
      <td className="px-3 py-3">
        {editing ? (
          <div className="flex gap-1">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-24 rounded-lg border border-border bg-background px-2 py-1 text-[13px]"
            />
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company"
              className="w-24 rounded-lg border border-border bg-background px-2 py-1 text-[13px]"
            />
          </div>
        ) : (
          <span className="text-muted-foreground">
            {[a.title, a.company].filter(Boolean).join(" at ") || "\u2014"}
          </span>
        )}
      </td>
      <td className="px-3 py-3">
        <span className="tabular-nums">{a.ai_comfort_level}/5</span>
      </td>
      <td className="hidden px-3 py-3 lg:table-cell">
        <span className="text-muted-foreground">{joinDate}</span>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <button
                onClick={() =>
                  onSave({
                    name,
                    email,
                    title: title || null,
                    company: company || null,
                  })
                }
                className="focus-ring rounded-lg px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/10"
              >
                Save
              </button>
              <button
                onClick={onCancelEdit}
                className="focus-ring rounded-lg px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="focus-ring rounded-lg px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="focus-ring rounded-lg px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

function MobileAttendeeCard({
  attendee: a,
  selected,
  onToggleSelect,
  onDelete,
}: {
  attendee: AdminAttendee
  selected: boolean
  onToggleSelect: () => void
  onDelete: () => void
}) {
  const isSpam = a.honeypot && a.honeypot.length > 0
  const joinDate = new Date(a.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  return (
    <div
      className={`rounded-2xl border bg-card p-4 ${
        selected ? "border-primary/40 bg-primary/5" : "border-border"
      } ${isSpam ? "opacity-50" : ""}`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="focus-ring mt-1 rounded"
          aria-label={`Select ${a.name}`}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">{a.name}</span>
            {isSpam && (
              <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                SPAM
              </span>
            )}
          </div>
          <span className="truncate text-xs text-muted-foreground">{a.email}</span>
          {(a.title || a.company) && (
            <span className="truncate text-xs text-muted-foreground">
              {[a.title, a.company].filter(Boolean).join(" at ")}
            </span>
          )}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs tabular-nums text-muted-foreground">
              Comfort: {a.ai_comfort_level}/5
            </span>
            <span className="text-xs text-muted-foreground">{joinDate}</span>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="focus-ring shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Delete ${a.name}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

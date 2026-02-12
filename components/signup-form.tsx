"use client"

import Link from "next/link"
import { type FormEvent, useState } from "react"
import {
  getSupabaseBrowserClient,
  hasSupabaseBrowserEnv,
} from "@/lib/supabase/browser"

const HELP_OPTIONS = [
  "Hiring",
  "Mentoring",
  "Partnering",
  "Investing",
  "Learning",
  "Selling",
  "Other",
] as const

function normalizeOptionalText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function toStringArray(values: FormDataEntryValue[]) {
  return values.filter((v): v is string => typeof v === "string")
}

type Status = {
  type: "idle" | "submitting" | "success" | "error"
  message?: string
}

export function SignupForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" })
  const [helpNeeded, setHelpNeeded] = useState<string[]>([])
  const [helpOffered, setHelpOffered] = useState<string[]>([])

  function toggleChip(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!hasSupabaseBrowserEnv()) {
      setStatus({
        type: "error",
        message:
          "Signup is temporarily unavailable. Environment not configured.",
      })
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    const honeypot =
      typeof formData.get("honeypot") === "string"
        ? String(formData.get("honeypot")).trim()
        : ""

    if (honeypot.length > 0) {
      setStatus({
        type: "success",
        message: "Thanks for joining! You should appear on the directory shortly.",
      })
      form.reset()
      return
    }

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      linkedin_url: normalizeOptionalText(formData.get("linkedin_url")),
      title: normalizeOptionalText(formData.get("title")),
      company: normalizeOptionalText(formData.get("company")),
      display_title_company: formData.get("display_title_company") === "on",
      ai_comfort_level: Number(formData.get("ai_comfort_level") ?? 3),
      help_needed: helpNeeded,
      help_offered: helpOffered,
      honeypot: "",
      other_help_needed: null,
      other_help_offered: null,
    }

    setStatus({ type: "submitting" })

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.from("attendees").insert(payload)

      if (error) {
        if (error.code === "23505") {
          setStatus({
            type: "error",
            message: "This email has already been used to sign up.",
          })
          return
        }
        setStatus({
          type: "error",
          message: "Something went wrong. Please try again.",
        })
        return
      }

      setStatus({
        type: "success",
        message: "You're in! You should appear on the directory shortly.",
      })
      form.reset()
      setHelpNeeded([])
      setHelpOffered([])
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      })
    }
  }

  if (status.type === "success") {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center md:py-24">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">{"You're in!"}</h2>
        <p className="mt-2 text-muted-foreground">{status.message}</p>
        <Link
          href="/room"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          View Directory
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Join the room</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Share your signal so others know who to connect with. Your email stays private.
        </p>
      </div>

      <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
        {/* Honeypot */}
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label htmlFor="website">Website</label>
          <input id="website" name="honeypot" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Name */}
        <FormField label="Name" required>
          <input id="name" name="name" type="text" placeholder="Your full name" required className="form-input" />
        </FormField>

        {/* Email */}
        <FormField label="Email" hint="Never displayed publicly" required>
          <input id="email" name="email" type="email" placeholder="you@company.com" required className="form-input" />
        </FormField>

        {/* AI Comfort Level */}
        <FormField label="AI Comfort Level" required>
          <div className="grid grid-cols-5 gap-2">
            {[
              { v: 1, l: "1", sub: "Exploring" },
              { v: 2, l: "2", sub: "Learning" },
              { v: 3, l: "3", sub: "Building" },
              { v: 4, l: "4", sub: "Shipping" },
              { v: 5, l: "5", sub: "Leading" },
            ].map((opt) => (
              <label key={opt.v} className="group cursor-pointer">
                <input type="radio" name="ai_comfort_level" value={opt.v} defaultChecked={opt.v === 3} className="peer sr-only" />
                <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3 text-center transition-all peer-checked:border-primary/40 peer-checked:bg-accent peer-checked:text-accent-foreground hover:bg-secondary active:scale-95">
                  <span className="text-lg font-bold">{opt.l}</span>
                  <span className="text-[10px] text-muted-foreground peer-checked:text-accent-foreground">{opt.sub}</span>
                </div>
              </label>
            ))}
          </div>
        </FormField>

        {/* Help needed - pill chips */}
        <FormField label="What help do you need?">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Help needed options">
            {HELP_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                aria-pressed={helpNeeded.includes(opt)}
                onClick={() => toggleChip(helpNeeded, setHelpNeeded, opt)}
                data-active={helpNeeded.includes(opt) ? "true" : "false"}
                className="filter-chip"
              >
                {opt}
              </button>
            ))}
          </div>
        </FormField>

        {/* Help offered - pill chips */}
        <FormField label="What help can you offer?">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Help offered options">
            {HELP_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                aria-pressed={helpOffered.includes(opt)}
                onClick={() => toggleChip(helpOffered, setHelpOffered, opt)}
                data-active={helpOffered.includes(opt) ? "true" : "false"}
                className="filter-chip"
              >
                {opt}
              </button>
            ))}
          </div>
        </FormField>

        <div className="h-px bg-border" />

        {/* Optional fields */}
        <div className="flex flex-col gap-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Optional</p>

          <FormField label="LinkedIn">
            <input id="linkedin" name="linkedin_url" type="url" placeholder="https://linkedin.com/in/..." className="form-input" />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Title">
              <input id="title" name="title" type="text" placeholder="Your role" className="form-input" />
            </FormField>
            <FormField label="Company">
              <input id="company" name="company" type="text" placeholder="Your company" className="form-input" />
            </FormField>
          </div>

          {/* Display consent */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input id="displayTitleCompany" name="display_title_company" type="checkbox" defaultChecked={false} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full border border-border bg-secondary transition-colors peer-checked:border-primary/40 peer-checked:bg-primary" />
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-foreground shadow transition-transform peer-checked:translate-x-5 peer-checked:bg-primary-foreground" />
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Show title & company on directory</span>
          </label>
        </div>

        {/* Status message */}
        {status.type === "error" && (
          <div
            role="alert"
            className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {status.message}
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={status.type === "submitting"}
            className="focus-ring inline-flex h-12 flex-1 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 disabled:opacity-50 active:scale-[0.98]"
          >
            {status.type === "submitting" ? "Joining..." : "Join Event"}
          </button>
          <Link
            href="/room"
            className="focus-ring inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-semibold text-card-foreground transition-all hover:bg-secondary active:scale-[0.98]"
          >
            View Directory
          </Link>
        </div>
      </form>
    </div>
  )
}

function FormField({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-1.5">
        <label className="text-sm font-medium">{label}</label>
        {!required && <span className="text-xs text-muted-foreground">optional</span>}
      </div>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

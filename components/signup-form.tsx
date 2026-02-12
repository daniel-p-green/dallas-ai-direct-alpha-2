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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!hasSupabaseBrowserEnv()) {
      setStatus({
        type: "error",
        message:
          "Signup is temporarily unavailable. Public environment variables are missing.",
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
        message: "Thanks for joining. Your signup has been received.",
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
      help_needed: toStringArray(formData.getAll("help_needed")),
      help_offered: toStringArray(formData.getAll("help_offered")),
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
            message: "This email has already been used for signup.",
          })
          return
        }
        setStatus({
          type: "error",
          message: "Signup failed. Please try again in a moment.",
        })
        return
      }

      setStatus({
        type: "success",
        message: "Signup complete. You should appear on the room board shortly.",
      })
      form.reset()
    } catch {
      setStatus({
        type: "error",
        message: "Signup failed. Please try again in a moment.",
      })
    }
  }

  const inputBase =
    "w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"

  const selectBase =
    "w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Join the room</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill in your details to appear on the public board. Email is required but never displayed.
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Honeypot */}
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label htmlFor="website">Website</label>
          <input id="website" name="honeypot" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Name + Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input id="name" name="name" type="text" placeholder="Your name" required className={inputBase} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" name="email" type="email" placeholder="you@company.com" required className={inputBase} />
            <p className="text-[11px] text-muted-foreground">Never displayed publicly.</p>
          </div>
        </div>

        {/* Comfort + LinkedIn */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="comfort" className="text-sm font-medium">AI Comfort Level</label>
            <select id="comfort" name="ai_comfort_level" defaultValue="3" required className={selectBase}>
              <option value="1">1 -- Just starting</option>
              <option value="2">2 -- Exploring</option>
              <option value="3">3 -- Building</option>
              <option value="4">4 -- Shipping</option>
              <option value="5">5 -- Leading</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="linkedin" className="text-sm font-medium">
              LinkedIn <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input id="linkedin" name="linkedin_url" type="url" placeholder="https://linkedin.com/in/..." className={inputBase} />
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Help needed + Help offered */}
        <div className="grid gap-6 sm:grid-cols-2">
          <fieldset className="flex flex-col gap-2.5">
            <legend className="text-sm font-medium">What help do you need?</legend>
            <div className="flex flex-col gap-2">
              {HELP_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <input type="checkbox" name="help_needed" value={opt} className="h-3.5 w-3.5 rounded border-input accent-foreground" />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2.5">
            <legend className="text-sm font-medium">What help can you offer?</legend>
            <div className="flex flex-col gap-2">
              {HELP_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <input type="checkbox" name="help_offered" value={opt} className="h-3.5 w-3.5 rounded border-input accent-foreground" />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="h-px bg-border" />

        {/* Title + Company */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input id="title" name="title" type="text" placeholder="Your job title" className={inputBase} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company" className="text-sm font-medium">
              Company <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input id="company" name="company" type="text" placeholder="Your company" className={inputBase} />
          </div>
        </div>

        {/* Display consent */}
        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
          <input id="displayTitleCompany" name="display_title_company" type="checkbox" defaultChecked={false} className="h-3.5 w-3.5 rounded border-input accent-foreground" />
          <span className="text-muted-foreground">Display my title and company on the public board</span>
        </label>

        {/* Status message */}
        {status.type !== "idle" && (
          <div
            role={status.type === "error" ? "alert" : "status"}
            className={`rounded-md border px-3 py-2 text-sm ${
              status.type === "error"
                ? "border-destructive/50 bg-destructive/10 text-destructive"
                : status.type === "success"
                  ? "border-[hsl(var(--success))]/50 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
                  : "border-border bg-muted text-muted-foreground"
            }`}
          >
            {status.type === "submitting" ? "Submitting..." : status.message}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={status.type === "submitting"}
            className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {status.type === "submitting" ? "Submitting..." : "Submit"}
          </button>
          <Link
            href="/room"
            className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            View Board
          </Link>
        </div>
      </form>
    </div>
  )
}

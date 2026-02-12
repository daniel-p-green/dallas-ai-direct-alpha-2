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

  const inputClasses =
    "w-full min-h-[44px] rounded-[var(--radius)] border border-input bg-card px-3 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"

  const selectClasses =
    "w-full min-h-[44px] rounded-[var(--radius)] border border-input bg-card px-3 py-2.5 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
          Attendee Signup
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Complete this form to appear on the room board with public-safe
          fields.
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Honeypot field */}
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="honeypot"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Name + Email */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              required
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              className={inputClasses}
            />
            <p className="text-xs text-muted-foreground">
              Email stays private and is never displayed publicly.
            </p>
          </div>
        </div>

        {/* Comfort + LinkedIn */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="comfort" className="text-sm font-medium">
              AI Comfort Level (1-5)
            </label>
            <select
              id="comfort"
              name="ai_comfort_level"
              defaultValue="3"
              required
              className={selectClasses}
            >
              <option value="1">1 -- Just starting</option>
              <option value="2">2 -- Exploring</option>
              <option value="3">3 -- Building</option>
              <option value="4">4 -- Shipping</option>
              <option value="5">5 -- Leading</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="linkedin" className="text-sm font-medium">
              LinkedIn URL{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <input
              id="linkedin"
              name="linkedin_url"
              type="url"
              placeholder="https://linkedin.com/in/..."
              className={inputClasses}
            />
          </div>
        </div>

        {/* Help needed + Help offered */}
        <div className="grid gap-5 md:grid-cols-2">
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium">
              What help do you need?
            </legend>
            <div className="flex flex-col gap-2">
              {HELP_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 text-sm text-card-foreground"
                >
                  <input
                    type="checkbox"
                    name="help_needed"
                    value={opt}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium">
              What help can you offer?
            </legend>
            <div className="flex flex-col gap-2">
              {HELP_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 text-sm text-card-foreground"
                >
                  <input
                    type="checkbox"
                    name="help_offered"
                    value={opt}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Title + Company */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Your job title"
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="company" className="text-sm font-medium">
              Company{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              placeholder="Your company"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Display consent */}
        <label className="flex items-start gap-3 text-sm">
          <input
            id="displayTitleCompany"
            name="display_title_company"
            type="checkbox"
            defaultChecked={false}
            className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
          />
          <span className="text-card-foreground">
            Display my title and company on the public room board.
          </span>
        </label>

        {/* Status message */}
        {status.type !== "idle" && (
          <p
            role={status.type === "error" ? "alert" : "status"}
            className={`text-sm font-medium ${
              status.type === "error"
                ? "text-destructive"
                : status.type === "success"
                  ? "text-[hsl(var(--success))]"
                  : "text-muted-foreground"
            }`}
          >
            {status.type === "submitting" ? "Submitting..." : status.message}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={status.type === "submitting"}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius)] bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status.type === "submitting" ? "Submitting..." : "Submit Signup"}
          </button>
          <Link
            href="/room"
            className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius)] border border-border bg-card px-6 text-sm font-semibold text-card-foreground transition-colors hover:bg-accent"
          >
            View the Room
          </Link>
        </div>
      </form>
    </div>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { type FormEvent, useState } from "react"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("email") ?? "").trim()
    const password = String(fd.get("password") ?? "")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error || "Invalid credentials.")
        setLoading(false)
        return
      }

      window.location.href = "/admin"
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4">
          <Image
            src="/brand/dallas-ai-logo-white.png"
            alt=""
            width={120}
            height={32}
            className="h-8 w-auto"
          />
          <div className="text-center">
            <h1 className="text-xl font-semibold">Admin Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to manage Dallas AI Direct.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="form-input"
              placeholder="admin@dallas-ai.org"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="form-input"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-2 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-[13px] font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "Signing in\u2026" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="focus-ring rounded-sm underline underline-offset-2 hover:text-foreground">
            Back to Dallas AI Direct
          </Link>
        </p>
      </div>
    </div>
  )
}

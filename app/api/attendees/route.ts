import { NextResponse } from "next/server"
import { getDb, hasDbEnv } from "@/lib/db"

/* ------------------------------------------------------------------ */
/* GET /api/attendees — read from attendees_public view                */
/* ------------------------------------------------------------------ */
export async function GET() {
  if (!hasDbEnv()) {
    return NextResponse.json({ data: null, error: "not_configured" })
  }

  try {
    const sql = getDb()
    const rows = await sql`
      SELECT name, ai_comfort_level, help_needed, help_offered,
             title, company, linkedin_url, created_at
      FROM attendees_public
      ORDER BY created_at DESC
      LIMIT 200
    `
    return NextResponse.json({ data: rows, error: null })
  } catch (err) {
    console.error("[attendees GET]", err)
    return NextResponse.json(
      { data: null, error: "query_failed" },
      { status: 500 }
    )
  }
}

/* ------------------------------------------------------------------ */
/* POST /api/attendees — insert into attendees table                   */
/* ------------------------------------------------------------------ */
const ALLOWED_HELP = [
  "Hiring",
  "Mentoring",
  "Partnering",
  "Investing",
  "Learning",
  "Selling",
  "Other",
]

export async function POST(request: Request) {
  if (!hasDbEnv()) {
    return NextResponse.json(
      { error: "not_configured" },
      { status: 503 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  /* Validate required fields */
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const email = typeof body.email === "string" ? body.email.trim() : ""
  const aiComfort = typeof body.ai_comfort_level === "number" ? body.ai_comfort_level : 0

  if (!name || !email || aiComfort < 1 || aiComfort > 5) {
    return NextResponse.json(
      { error: "Name, valid email, and comfort level (1-5) are required." },
      { status: 400 }
    )
  }

  /* Sanitize optional fields */
  const linkedinUrl =
    typeof body.linkedin_url === "string" && body.linkedin_url.trim()
      ? body.linkedin_url.trim()
      : null
  const title =
    typeof body.title === "string" && body.title.trim()
      ? body.title.trim()
      : null
  const company =
    typeof body.company === "string" && body.company.trim()
      ? body.company.trim()
      : null
  const displayTitleCompany = body.display_title_company === true
  const helpNeeded = Array.isArray(body.help_needed)
    ? body.help_needed.filter((v: unknown): v is string => typeof v === "string" && ALLOWED_HELP.includes(v))
    : []
  const helpOffered = Array.isArray(body.help_offered)
    ? body.help_offered.filter((v: unknown): v is string => typeof v === "string" && ALLOWED_HELP.includes(v))
    : []
  const honeypot =
    typeof body.honeypot === "string" ? body.honeypot.trim() : ""

  try {
    const sql = getDb()
    await sql`
      INSERT INTO attendees (
        name, email, linkedin_url, title, company,
        display_title_company, ai_comfort_level,
        help_needed, help_offered, honeypot
      ) VALUES (
        ${name}, ${email}, ${linkedinUrl}, ${title}, ${company},
        ${displayTitleCompany}, ${aiComfort},
        ${helpNeeded}, ${helpOffered}, ${honeypot}
      )
    `
    return NextResponse.json({ error: null }, { status: 201 })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : ""
    /* Unique constraint violation on email */
    if (message.includes("23505") || message.includes("unique")) {
      return NextResponse.json(
        { error: "This email has already been used to sign up." },
        { status: 409 }
      )
    }
    console.error("[attendees POST]", err)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}

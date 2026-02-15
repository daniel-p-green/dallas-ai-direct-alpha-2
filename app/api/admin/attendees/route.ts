import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import { getDb } from "@/lib/db"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

/**
 * GET /api/admin/attendees
 * Returns ALL attendee data (including email) for admin management.
 */
export async function GET() {
  const user = await getSessionUser()
  if (!user) return unauthorized()

  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  const rows = await sql`
    SELECT id, name, email, title, company, linkedin_url,
           display_title_company, ai_comfort_level,
           help_needed, help_offered, honeypot, created_at
    FROM attendees
    ORDER BY created_at DESC
  `

  return NextResponse.json({ data: rows })
}

/**
 * DELETE /api/admin/attendees
 * Deletes an attendee by id.
 */
export async function DELETE(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return unauthorized()

  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 })
  }

  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  await sql`DELETE FROM attendees WHERE id = ${id}`

  return NextResponse.json({ ok: true })
}

/**
 * PATCH /api/admin/attendees
 * Updates an attendee by id. Only the provided fields are updated.
 */
export async function PATCH(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return unauthorized()

  const body = await req.json()
  const { id, ...fields } = body
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 })
  }

  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  // Build update fields -- only update what's provided
  const updates: Record<string, unknown> = {}
  const allowedFields = [
    "name", "email", "title", "company", "linkedin_url",
    "display_title_company", "ai_comfort_level",
    "help_needed", "help_offered",
  ]
  for (const key of allowedFields) {
    if (key in fields) updates[key] = fields[key]
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 })
  }

  // Use parameterized update for each field
  if ("name" in updates) await sql`UPDATE attendees SET name = ${String(updates.name)} WHERE id = ${id}`
  if ("email" in updates) await sql`UPDATE attendees SET email = ${String(updates.email)} WHERE id = ${id}`
  if ("title" in updates) await sql`UPDATE attendees SET title = ${updates.title === null ? null : String(updates.title)} WHERE id = ${id}`
  if ("company" in updates) await sql`UPDATE attendees SET company = ${updates.company === null ? null : String(updates.company)} WHERE id = ${id}`
  if ("linkedin_url" in updates) await sql`UPDATE attendees SET linkedin_url = ${updates.linkedin_url === null ? null : String(updates.linkedin_url)} WHERE id = ${id}`
  if ("display_title_company" in updates) await sql`UPDATE attendees SET display_title_company = ${Boolean(updates.display_title_company)} WHERE id = ${id}`
  if ("ai_comfort_level" in updates) await sql`UPDATE attendees SET ai_comfort_level = ${Number(updates.ai_comfort_level)} WHERE id = ${id}`
  if ("help_needed" in updates) await sql`UPDATE attendees SET help_needed = ${updates.help_needed as string[]} WHERE id = ${id}`
  if ("help_offered" in updates) await sql`UPDATE attendees SET help_offered = ${updates.help_offered as string[]} WHERE id = ${id}`

  return NextResponse.json({ ok: true })
}

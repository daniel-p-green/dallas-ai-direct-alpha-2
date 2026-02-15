import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import { getDb } from "@/lib/db"

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  const [countResult] = await sql`SELECT count(*)::int AS total FROM attendees`
  const [avgResult] = await sql`SELECT coalesce(round(avg(ai_comfort_level), 1), 0) AS avg_comfort FROM attendees`
  const [todayResult] = await sql`SELECT count(*)::int AS today FROM attendees WHERE created_at >= now() - interval '24 hours'`
  const [spamResult] = await sql`SELECT count(*)::int AS spam FROM attendees WHERE honeypot IS NOT NULL AND honeypot != ''`

  return NextResponse.json({
    total: countResult.total,
    avgComfort: Number(avgResult.avg_comfort),
    today: todayResult.today,
    spam: spamResult.spam,
  })
}

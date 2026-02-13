import crypto from "crypto"
import { cookies } from "next/headers"
import { getDb } from "@/lib/db"
import bcrypt from "bcryptjs"

const SESSION_COOKIE = "dai_session"
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours

export interface AdminUser {
  id: string
  email: string
  role: string
}

/**
 * Verify email + password against admin_users table.
 * Returns the user on success, null on failure.
 */
export async function verifyAdmin(
  email: string,
  password: string
): Promise<AdminUser | null> {
  const sql = getDb()
  if (!sql) return null

  const rows = await sql`
    SELECT id, email, password_hash, role
    FROM admin_users
    WHERE email = ${email.toLowerCase().trim()}
    LIMIT 1
  `

  if (rows.length === 0) return null

  const row = rows[0]
  const valid = await bcrypt.compare(password, String(row.password_hash))
  if (!valid) return null

  return { id: String(row.id), email: String(row.email), role: String(row.role) }
}

/**
 * Create a signed session token (base64-encoded JSON with HMAC).
 * In production you'd use a proper JWT library, but for alpha
 * this is simple and secure enough with a server-side secret.
 */
function getSecret(): string {
  return process.env.SESSION_SECRET || process.env.DATABASE_URL || "dallas-ai-direct-alpha-fallback"
}

export function createSessionToken(user: AdminUser): string {
  const payload = JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  })
  // Simple encode -- not tamper-proof without HMAC, but sufficient for alpha
  // In production, use jose or similar
  const token = Buffer.from(payload + "|" + sign(payload)).toString("base64")
  return token
}

function sign(data: string): string {
  return crypto.createHmac("sha256", getSecret()).update(data).digest("hex")
}

export function parseSessionToken(token: string): AdminUser | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const pipeIdx = decoded.lastIndexOf("|")
    if (pipeIdx === -1) return null

    const payload = decoded.slice(0, pipeIdx)
    const sig = decoded.slice(pipeIdx + 1)

    if (sign(payload) !== sig) return null

    const parsed = JSON.parse(payload)
    if (typeof parsed.exp === "number" && parsed.exp < Date.now()) return null

    return {
      id: parsed.id,
      email: parsed.email,
      role: parsed.role,
    }
  } catch {
    return null
  }
}

/**
 * Set session cookie (call from API route).
 */
export async function setSessionCookie(user: AdminUser) {
  const token = createSessionToken(user)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
}

/**
 * Clear session cookie (call from API route).
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
}

/**
 * Get current admin user from session cookie.
 * Returns null if not logged in or session expired.
 */
export async function getSessionUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  return parseSessionToken(token)
}

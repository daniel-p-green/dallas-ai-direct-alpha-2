import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error("DATABASE_URL is required")
  process.exit(1)
}

const email = process.env.ADMIN_EMAIL || "admin@dallas-ai.org"
const password = process.env.ADMIN_PASSWORD || "DallasAI2026!"

const sql = neon(DATABASE_URL)
const hash = await bcrypt.hash(password, 12)

try {
  await sql`
    INSERT INTO admin_users (email, password_hash, role)
    VALUES (${email}, ${hash}, 'admin')
    ON CONFLICT (email) DO UPDATE SET password_hash = ${hash}
  `
  console.log(`Admin user seeded: ${email}`)
} catch (err) {
  console.error("Failed to seed admin:", err)
  process.exit(1)
}

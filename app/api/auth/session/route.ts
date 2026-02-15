import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ user: null })
  }
  return NextResponse.json({ user: { email: user.email, role: user.role } })
}

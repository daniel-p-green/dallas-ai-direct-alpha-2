import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin, setSessionCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body.email ?? "").trim()
    const password = String(body.password ?? "")

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      )
    }

    const user = await verifyAdmin(email, password)
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      )
    }

    await setSessionCookie(user)

    return NextResponse.json({ ok: true, user: { email: user.email, role: user.role } })
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    )
  }
}

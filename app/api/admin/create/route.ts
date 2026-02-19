import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { verifyAdmin } from "@/lib/admin-auth"

const PRINCIPAL_PASSWORD = process.env.PRINCIPAL_PASSWORD || "MWPM"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, name, email, phone, principalPassword } = body

    let isAdmin = false
    let isPrincipal = false

    const authHeader = request.headers.get("Authorization")
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const authResult = await verifyAdmin(request)
      isAdmin = !(authResult instanceof NextResponse)
    }

    if (principalPassword === PRINCIPAL_PASSWORD) {
      isPrincipal = true
    }

    if (!isAdmin && !isPrincipal) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!username || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: existingAdmin } = await supabase
      .from("admin_accounts")
      .select("id")
      .eq("username", username)
      .single()

    if (existingAdmin) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const { error } = await supabase.from("admin_accounts").insert({
      username,
      password_hash: passwordHash,
      name,
      email: email || null,
      phone: phone || null,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("[v0] Admin create error:", err.message)
    return NextResponse.json({ error: "Failed to create admin account" }, { status: 500 })
  }
}

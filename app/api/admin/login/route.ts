import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { generateAdminToken } from "@/lib/admin-auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: adminAccount, error: queryError } = await supabase
      .from("admin_accounts")
      .select("id, username, password_hash, name, email, is_active")
      .eq("username", username)
      .single()

    if (queryError || !adminAccount) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    if (!adminAccount.is_active) {
      return NextResponse.json({ error: "Account is deactivated" }, { status: 403 })
    }

    const storedPasswordHash = adminAccount.password_hash

    // Check if it's bcrypt hash (starts with $2a$, $2b$, or $2y$)
    let isValidPassword = false
    if (storedPasswordHash.startsWith("$2")) {
      isValidPassword = await bcrypt.compare(password, storedPasswordHash)
    } else {
      // Fallback for legacy Base64 encoded passwords
      const decodedPassword = Buffer.from(storedPasswordHash, "base64").toString("utf-8")
      isValidPassword = decodedPassword === password

      // Migrate to bcrypt on successful login
      if (isValidPassword) {
        const newHash = await bcrypt.hash(password, 10)
        await supabase
          .from("admin_accounts")
          .update({ password_hash: newHash })
          .eq("id", adminAccount.id)
      }
    }

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Generate auth token
    const token = generateAdminToken(adminAccount.id)

    return NextResponse.json({
      success: true,
      admin: {
        id: adminAccount.id,
        username: adminAccount.username,
        name: adminAccount.name,
      },
      token,
    })
  } catch (err: any) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

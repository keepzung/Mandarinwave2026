import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const ADMIN_SECRET = process.env.ADMIN_SECRET || "mandarinwave-admin-secret-2024"
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

export async function verifyAdmin(request: Request): Promise<{ success: true; adminId: string } | NextResponse> {
  const authHeader = request.headers.get("Authorization")
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = authHeader.replace("Bearer ", "")
  
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Decode the token
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const parts = decoded.split(":")
    
    if (parts.length !== 3) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 401 })
    }
    
    const [adminId, timestamp, hash] = parts
    
    // Validate timestamp
    const tokenTime = parseInt(timestamp, 10)
    if (isNaN(tokenTime)) {
      return NextResponse.json({ error: "Invalid token timestamp" }, { status: 401 })
    }
    
    // Check if token is expired
    if (Date.now() - tokenTime > TOKEN_EXPIRY_MS) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 })
    }
    
    // Verify hash signature
    const expectedHash = Buffer.from(`${adminId}:${timestamp}:${ADMIN_SECRET}`).toString("base64")
    if (hash !== expectedHash) {
      return NextResponse.json({ error: "Invalid token signature" }, { status: 401 })
    }
    
    // Verify admin exists and is active
    const { data: admin, error } = await supabase
      .from("admin_accounts")
      .select("id, is_active")
      .eq("id", adminId)
      .single()
    
    if (error || !admin || !admin.is_active) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    return { success: true, adminId }
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export function generateAdminToken(adminId: string): string {
  const timestamp = Date.now().toString()
  const hash = Buffer.from(`${adminId}:${timestamp}:${ADMIN_SECRET}`).toString("base64")
  return Buffer.from(`${adminId}:${timestamp}:${hash}`).toString("base64")
}

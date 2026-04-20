import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [totalResult, uvResult, pagesResult, dailyResult] = await Promise.all([
      supabase.from("page_visits").select("id", { count: "exact", head: true }),
      supabase.from("page_visits").select("ip"),
      supabase.from("page_visits").select("path").order("created_at", { ascending: false }).limit(1000),
      supabase.from("page_visits").select("created_at").gte("created_at", sevenDaysAgo),
    ])

    const totalPV = totalResult.count || 0
    const uniqueIPs = new Set(uvResult.data?.map((r) => r.ip).filter(Boolean))
    const totalUV = uniqueIPs.size

    const pageCounts: Record<string, number> = {}
    pagesResult.data?.forEach((r) => {
      pageCounts[r.path] = (pageCounts[r.path] || 0) + 1
    })
    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }))

    const dailyData: Record<string, { pv: number; ips: Set<string> }> = {}
    dailyResult.data?.forEach((r) => {
      const day = new Date(r.created_at).toISOString().slice(0, 10)
      if (!dailyData[day]) dailyData[day] = { pv: 0, ips: new Set() }
      dailyData[day].pv += 1
      const ip = (r as any).ip
      if (ip) dailyData[day].ips.add(ip)
    })
    const dailyTrend = Object.entries(dailyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, pv: data.pv, uv: data.ips.size }))

    return NextResponse.json({
      totalPV,
      totalUV,
      topPages,
      dailyTrend,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { BookOpen, Calendar, LogOut, Clock, CalendarCheck, User, Loader2, CreditCard } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { useAuth } from "@/lib/auth-context"
import { format, parseISO } from "date-fns"

export default function StudentDashboard() {
  const { language } = useLanguage()
  const t = useTranslation(language)
  const router = useRouter()
  const { user, loading: authLoading, initialized, logout } = useAuth()
  const [studentEmail, setStudentEmail] = useState("")
  const [remainingClasses, setRemainingClasses] = useState(0)
  const [todayClasses, setTodayClasses] = useState(0)
  const [usedClasses, setUsedClasses] = useState(0)
  const [dataLoading, setDataLoading] = useState(true)
  const [todaySchedules, setTodaySchedules] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    if (initialized && !user) {
      console.log("[v0] No user after initialization, redirecting to login")
      router.push("/student-login")
    } else if (initialized && user) {
      console.log("[v0] User authenticated, loading dashboard data")
      setStudentEmail(user.email || "")
      loadDashboardData()
    }
  }, [initialized, user, router])

  const loadDashboardData = useCallback(async () => {
    if (!user) return

    const supabase = createBrowserClient()
    console.log("[Dashboard] Loading data for user:", user.id)

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle()

      if (profileError) {
        console.error("[Dashboard] Profile error:", profileError)
        return
      }

      if (!profileData) {
        console.error("[Dashboard] No profile found")
        setDataLoading(false)
        return
      }

      const studentId = profileData.id
      console.log("[Dashboard] Student ID:", studentId)

      const now = new Date()
      const beijingOffset = 8 * 60
      const localOffset = now.getTimezoneOffset()
      const beijingTime = new Date(now.getTime() + (beijingOffset + localOffset) * 60 * 1000)
      const today = beijingTime.toISOString().split("T")[0]

      const [balanceResult, schedulesResult, ordersResult] = await Promise.all([
        supabase
          .from("student_class_balance")
          .select("total_classes, used_classes, remaining_classes")
          .eq("student_id", studentId)
          .maybeSingle(),
        supabase
          .from("class_schedules")
          .select("id, scheduled_date, start_time, end_time, status, timezone, teacher_name, course_id")
          .eq("student_id", studentId)
          .eq("scheduled_date", today)
          .order("start_time", { ascending: true }),
        supabase
          .from("student_orders")
          .select("*")
          .eq("student_id", studentId)
          .order("created_at", { ascending: false })
          .limit(5)
      ])

      if (balanceResult.error) {
        console.error("[Dashboard] Balance error:", balanceResult.error)
      }
      if (balanceResult.data) {
        const remaining = balanceResult.data.remaining_classes ?? balanceResult.data.total_classes - balanceResult.data.used_classes
        setRemainingClasses(remaining)
        setUsedClasses(balanceResult.data.used_classes || 0)
      } else {
        setRemainingClasses(0)
        setUsedClasses(0)
      }

      if (schedulesResult.error) {
        console.error("[Dashboard] Schedules error:", schedulesResult.error)
        setTodaySchedules([])
        setTodayClasses(0)
      } else if (schedulesResult.data && schedulesResult.data.length > 0) {
        const courseIds = [...new Set(schedulesResult.data.map(s => s.course_id).filter(Boolean))]

        if (courseIds.length > 0) {
          const { data: coursesData } = await supabase
            .from("courses")
            .select("id, title_zh, title_en, color")
            .in("id", courseIds)

          const coursesMap = coursesData ? Object.fromEntries(coursesData.map(c => [c.id, c])) : {}
          const enrichedSchedules = schedulesResult.data.map(s => ({
            ...s,
            courses: s.course_id ? coursesMap[s.course_id] : null
          }))
          setTodaySchedules(enrichedSchedules)
          setTodayClasses(enrichedSchedules.length)
        } else {
          setTodaySchedules(schedulesResult.data)
          setTodayClasses(schedulesResult.data.length)
        }
      } else {
        setTodaySchedules([])
        setTodayClasses(0)
      }

      if (ordersResult.error) {
        if (ordersResult.error.message.includes("does not exist") || ordersResult.error.message.includes("schema cache")) {
          console.log("[Dashboard] Orders table not found")
        } else {
          console.error("[Dashboard] Orders error:", ordersResult.error)
        }
        setOrders([])
      } else {
        console.log("[Dashboard] Orders loaded:", ordersResult.data?.length || 0)
        setOrders(ordersResult.data || [])
      }
    } catch (err) {
      console.error("[Dashboard] Exception:", err)
    } finally {
      setDataLoading(false)
    }
  }, [user])

  const handleContinuePayment = (order: any) => {
    const paymentUrl = new URL("/payment", window.location.origin)
    paymentUrl.searchParams.set("courseId", order.course_id || "")
    paymentUrl.searchParams.set("courseName", order.course_id ? "" : order.package_name)
    paymentUrl.searchParams.set("packageId", order.package_id || "")
    paymentUrl.searchParams.set("packageName", order.package_name || "")
    paymentUrl.searchParams.set("classCount", order.classes_purchased?.toString() || "0")
    paymentUrl.searchParams.set("price", order.amount?.toString() || "0")
    paymentUrl.searchParams.set("validityDays", order.validity_days?.toString() || "365")
    paymentUrl.searchParams.set("orderNumber", order.order_number)
    router.push(paymentUrl.toString())
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = "/student-login"
  }

  if (authLoading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue/5 via-white to-orange/5">
        <Loader2 className="w-8 h-8 animate-spin text-blue" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/5 via-white to-orange/5">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === "zh" ? "学员中心" : "Student Dashboard"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{studentEmail}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="gap-2 bg-orange text-white hover:bg-orange/90"
                onClick={() => router.push("/student-dashboard/purchase")}
              >
                <BookOpen className="w-4 h-4" />
                {language === "zh" ? "购买课程" : "Purchase Classes"}
              </Button>
              <Button
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={() => router.push("/student-dashboard/schedule")}
              >
                <CalendarCheck className="w-4 h-4" />
                {language === "zh" ? "完整课程表" : "Full Schedule"}
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                {language === "zh" ? "返回首页" : "Home"}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                {language === "zh" ? "退出" : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{language === "zh" ? "剩余课时" : "Remaining Classes"}</p>
                  <p className="text-3xl font-bold text-blue">{dataLoading ? "..." : remainingClasses}</p>
                </div>
                <div className="w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{language === "zh" ? "已完成课时" : "Completed Classes"}</p>
                  <p className="text-3xl font-bold text-orange">{dataLoading ? "..." : usedClasses}</p>
                </div>
                <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{language === "zh" ? "今日课程" : "Today's Classes"}</p>
                  <p className="text-3xl font-bold text-green-600">{dataLoading ? "..." : todayClasses}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue" />
              {language === "zh" ? "今日课程安排" : "Today's Schedule"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <div className="text-center py-8">{language === "zh" ? "加载中..." : "Loading..."}</div>
            ) : todaySchedules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {language === "zh" ? "今天没有课程安排" : "No classes scheduled for today"}
              </div>
            ) : (
              <div className="space-y-4">
                {todaySchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                    style={{ borderLeftWidth: "4px", borderLeftColor: schedule.courses?.color || "#3b82f6" }}
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">
                        {language === "zh" ? schedule.courses?.title_zh : schedule.courses?.title_en}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            {schedule.start_time} - {schedule.end_time}
                          </span>
                          {schedule.timezone && <span className="text-xs text-gray-500">({schedule.timezone})</span>}
                        </div>
                        {schedule.teacher_name && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>
                              {language === "zh" ? "教师：" : "Teacher: "}
                              {schedule.teacher_name}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            schedule.status === "scheduled"
                              ? "bg-blue/10 text-blue"
                              : schedule.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {schedule.status === "scheduled"
                            ? language === "zh"
                              ? "待上课"
                              : "Scheduled"
                            : schedule.status === "completed"
                              ? language === "zh"
                                ? "已完成"
                                : "Completed"
                              : schedule.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Orders Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange" />
              {language === "zh" ? "我的订单" : "My Orders"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <div className="text-center py-8">{language === "zh" ? "加载中..." : "Loading..."}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>{language === "zh" ? "暂无订单记录" : "No orders yet"}</p>
                <Button
                  className="mt-4 bg-orange hover:bg-orange/90"
                  onClick={() => router.push("/student-dashboard/purchase")}
                >
                  {language === "zh" ? "购买课程" : "Purchase Classes"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  let formattedDate = language === "zh" ? "日期未知" : "Date unknown"
                  try {
                    if (order.created_at) {
                      formattedDate = format(
                        parseISO(order.created_at),
                        language === "zh" ? "yyyy年MM月dd日" : "MMM d, yyyy",
                      )
                    }
                  } catch (err) {
                    console.error("[v0] Error formatting date for order:", order.id, err)
                  }

                  return (
                    <div key={order.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{order.package_name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {language === "zh" ? "订单号：" : "Order #"}
                            {order.order_number}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange">¥{Number(order.amount || 0).toLocaleString()}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {order.classes_purchased} {language === "zh" ? "课时" : "classes"}
                          </p>
                          <span
                            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : order.status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status === "paid"
                              ? language === "zh"
                                ? "已支付"
                                : "Paid"
                              : order.status === "pending"
                                ? language === "zh"
                                  ? "待支付"
                                  : "Pending"
                                : order.status === "cancelled"
                                  ? language === "zh"
                                    ? "已取消"
                                    : "Cancelled"
                                  : order.status}
                          </span>
                        </div>
                      </div>
                      {order.status === "pending" && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <Button
                            className="w-full bg-orange hover:bg-orange/90 text-white gap-2"
                            onClick={() => handleContinuePayment(order)}
                          >
                            <CreditCard className="w-4 h-4" />
                            {language === "zh" ? "继续支付" : "Continue Payment"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

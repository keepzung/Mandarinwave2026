"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Calendar, Clock, User, MapPin, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from "date-fns"
import { zhCN, enUS } from "date-fns/locale"
import { formatInTimeZone, toZonedTime } from "date-fns-tz"

interface Schedule {
  id: string
  course_id: string
  teacher_name: string
  scheduled_date: string
  start_time: string
  end_time: string
  timezone: string
  status: string
  notes?: string
  courses?: {
    title_zh: string
    title_en: string
    color: string
  }
}

export default function StudentSchedulePage() {
  const { language } = useLanguage()
  const router = useRouter()

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [userTimezone, setUserTimezone] = useState("Asia/Shanghai")

  useEffect(() => {
    // Detect user's timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    setUserTimezone(tz)
  }, [])

  useEffect(() => {
    loadSchedules()
  }, [currentMonth])

  const loadSchedules = async () => {
    setLoading(true)
    const supabase = createBrowserClient()
    try {
      const startDate = startOfMonth(currentMonth)
      const endDate = endOfMonth(addMonths(currentMonth, 2))

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        console.error("[v0] No user found, redirecting to login")
        router.push("/student-login")
        return
      }

      console.log("[v0] Loading schedules for auth user:", user.id)

      // Get user_profiles.id first
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()

      const studentId = profile?.id
      if (!studentId) {
        console.error("[v0] No profile found for user")
        setSchedules([])
        setLoading(false)
        return
      }

      console.log("[v0] Using profile ID for query:", studentId)

      // Fetch schedules using user_profiles.id
      const { data, error } = await supabase
        .from("class_schedules")
        .select("*, courses(title_zh, title_en, color)")
        .gte("scheduled_date", format(startDate, "yyyy-MM-dd"))
        .lte("scheduled_date", format(endDate, "yyyy-MM-dd"))
        .eq("student_id", studentId)
        .order("scheduled_date", { ascending: true })
        .order("start_time", { ascending: true })

      if (error) {
        console.error("[v0] Error loading schedules:", error)
        throw error
      }

      console.log("[v0] Schedules loaded:", data?.length || 0, "schedule(s)")
      setSchedules(data || [])
    } catch (error) {
      console.error("[v0] Error loading schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  const convertToUserTimezone = (date: string, time: string, fromTz: string) => {
    try {
      const dateTimeStr = `${date}T${time}`
      const zonedDate = toZonedTime(dateTimeStr, fromTz)
      return formatInTimeZone(zonedDate, userTimezone, "HH:mm")
    } catch {
      return time
    }
  }

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }

  const getSchedulesForDate = (date: Date) => {
    return schedules.filter((s) => isSameDay(parseISO(s.scheduled_date), date))
  }

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, -1))
  }

  const goToNextMonth = () => {
    const threeMonthsLater = addMonths(new Date(), 3)
    if (currentMonth < threeMonthsLater) {
      setCurrentMonth((prev) => addMonths(prev, 1))
    }
  }

  const days = getDaysInMonth()
  const locale = language === "zh" ? zhCN : enUS

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/5 via-white to-orange/5">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{language === "zh" ? "我的课程表" : "My Schedule"}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {language === "zh" ? `时区：${userTimezone}` : `Timezone: ${userTimezone}`}
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push("/student-dashboard")}>
              {language === "zh" ? "返回" : "Back"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue" />
                {format(currentMonth, "yyyy年MM月", { locale })}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextMonth}
                  disabled={currentMonth >= addMonths(new Date(), 2)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">{language === "zh" ? "加载中..." : "Loading..."}</div>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {/* Week days header */}
                {[
                  language === "zh" ? "日" : "Sun",
                  language === "zh" ? "一" : "Mon",
                  language === "zh" ? "二" : "Tue",
                  language === "zh" ? "三" : "Wed",
                  language === "zh" ? "四" : "Thu",
                  language === "zh" ? "五" : "Fri",
                  language === "zh" ? "六" : "Sat",
                ].map((day) => (
                  <div key={day} className="text-center font-bold text-gray-700 py-2">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {days.map((day, idx) => {
                  const daySchedules = getSchedulesForDate(day)
                  const isToday = isSameDay(day, new Date())
                  const isSelected = selectedDate && isSameDay(day, selectedDate)

                  return (
                    <div
                      key={idx}
                      className={`min-h-[100px] border rounded-lg p-2 cursor-pointer transition-colors ${
                        isToday
                          ? "bg-blue/10 border-blue"
                          : isSelected
                            ? "bg-orange/10 border-orange"
                            : "border-gray-200 hover:border-gray-400"
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="text-sm font-medium text-gray-700 mb-1">{format(day, "d")}</div>
                      <div className="space-y-1">
                        {daySchedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className="text-xs p-1 rounded truncate"
                            style={{ backgroundColor: `${schedule.courses?.color || "#3b82f6"}20` }}
                          >
                            <div className="font-medium truncate">
                              {convertToUserTimezone(schedule.scheduled_date, schedule.start_time, schedule.timezone)}
                            </div>
                            <div className="text-gray-600 truncate">
                              {language === "zh" ? schedule.courses?.title_zh : schedule.courses?.title_en}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule list for selected date */}
        {selectedDate && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                {format(selectedDate, language === "zh" ? "yyyy年MM月dd日" : "MMMM d, yyyy", { locale })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getSchedulesForDate(selectedDate).length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  {language === "zh" ? "当天没有课程安排" : "No classes scheduled for this day"}
                </p>
              ) : (
                <div className="space-y-4">
                  {getSchedulesForDate(selectedDate).map((schedule) => {
                    const startTime = convertToUserTimezone(
                      schedule.scheduled_date,
                      schedule.start_time,
                      schedule.timezone,
                    )
                    const endTime = convertToUserTimezone(schedule.scheduled_date, schedule.end_time, schedule.timezone)

                    return (
                      <div
                        key={schedule.id}
                        className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-1 h-full rounded"
                            style={{ backgroundColor: schedule.courses?.color || "#3b82f6" }}
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">
                              {language === "zh" ? schedule.courses?.title_zh : schedule.courses?.title_en}
                            </h3>

                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {startTime} - {endTime}
                                </span>
                                {schedule.timezone !== userTimezone && (
                                  <span className="text-xs text-gray-500">
                                    ({language === "zh" ? "原始时间" : "Original"}: {schedule.start_time} -{" "}
                                    {schedule.end_time} {schedule.timezone})
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>
                                  {language === "zh" ? "教师：" : "Teacher: "}
                                  {schedule.teacher_name}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  {language === "zh" ? "时区：" : "Timezone: "}
                                  {userTimezone}
                                </span>
                              </div>

                              {schedule.notes && (
                                <div className="flex items-start gap-2 text-sm text-gray-600 mt-2 pt-2 border-t">
                                  <BookOpen className="w-4 h-4 mt-0.5" />
                                  <span>{schedule.notes}</span>
                                </div>
                              )}
                            </div>

                            <div className="mt-3">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  schedule.status === "scheduled"
                                    ? "bg-blue/10 text-blue"
                                    : schedule.status === "completed"
                                      ? "bg-green-100 text-green-700"
                                      : schedule.status === "cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {schedule.status === "scheduled"
                                  ? language === "zh"
                                    ? "已安排"
                                    : "Scheduled"
                                  : schedule.status === "completed"
                                    ? language === "zh"
                                      ? "已完成"
                                      : "Completed"
                                    : schedule.status === "cancelled"
                                      ? language === "zh"
                                        ? "已取消"
                                        : "Cancelled"
                                      : schedule.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

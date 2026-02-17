"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Calendar, Plus, Edit2, Trash2, Users, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
  isSameDay,
  parseISO,
} from "date-fns"
import { zhCN, enUS } from "date-fns/locale"

interface Schedule {
  id: string
  course_id: string
  teacher_name: string
  scheduled_date: string
  start_time: string
  end_time: string
  timezone: string
  student_id?: string
  student_name?: string
  status: string
  notes?: string
  courses?: {
    title_zh: string
    title_en: string
    color: string
  }
}

interface Course {
  id: string
  title_zh: string
  title_en: string
  course_key: string
}

interface Teacher {
  id: string
  name: string
  email: string
  username: string
}

interface Student {
  id: string
  user_id: string
  name: string
  email: string
  role: string
}

export default function AdminSchedulePage() {
  const { language } = useLanguage()
  const router = useRouter()

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    course_id: "",
    teacher_name: "",
    scheduled_date: "",
    start_time: "10:00",
    end_time: "11:00",
    student_id: "",
    student_name: "",
    notes: "",
  })

  const loadData = useCallback(async () => {
    if (typeof window === "undefined") return

    const supabase = createBrowserClient()
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"

    if (!adminLoggedIn) {
      window.location.href = "/admin-login"
      return
    }

    try {
      console.log("[v0] Loading schedule data...")

      // Load schedules for current month and next 6 months
      const startDate = startOfMonth(currentMonth)
      const endDate = endOfMonth(addMonths(currentMonth, 5))

      const { data: schedulesData, error: schedError } = await supabase
        .from("class_schedules")
        .select("*, courses(title_zh, title_en, color)")
        .gte("scheduled_date", format(startDate, "yyyy-MM-dd"))
        .lte("scheduled_date", format(endDate, "yyyy-MM-dd"))
        .order("scheduled_date", { ascending: true })
        .order("start_time", { ascending: true })

      if (schedError) throw schedError
      setSchedules(schedulesData || [])

      // Load courses
      const { data: coursesData, error: courseError } = await supabase
        .from("courses")
        .select("id, title_zh, title_en, course_key")
        .eq("is_active", true)

      if (courseError) throw courseError
      setCourses(coursesData || [])

      console.log("[v0] Loading teachers from admin_accounts")
      const { data: teachersData, error: teacherError } = await supabase
        .from("admin_accounts")
        .select("id, name, email, username")
        .eq("is_active", true)
        .order("name", { ascending: true })

      console.log("[v0] Teachers query result:", teachersData)
      console.log("[v0] Teachers query error:", teacherError)

      if (teacherError) {
        console.error("[v0] Error loading teachers:", teacherError)
        // Don't throw, just log and continue with empty list
      }

      const validTeachers = (teachersData || []).filter((t) => t.name)
      console.log("[v0] Valid teachers with names:", validTeachers)
      setTeachers(validTeachers)

      const { data: studentsData, error: studentsError } = await supabase
        .from("user_profiles")
        .select("id, user_id, name, email")
        .eq("role", "student")

      if (studentsError) {
        console.error("[v0] Students error:", studentsError)
      } else {
        console.log("[v0] Students loaded:", studentsData?.length || 0)
        setStudents(studentsData || [])
      }

      setLoading(false)
    } catch (error) {
      alert(language === "zh" ? "加载数据失败，请重试" : "Failed to load data, please try again")
      setLoading(false)
    }
  }, [language, currentMonth])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddSchedule = async () => {
    if (!formData.course_id || !formData.scheduled_date) {
      alert(language === "zh" ? "请填写必填项" : "Please fill in required fields")
      return
    }

    const supabase = createBrowserClient()
    try {
      const adminUsername = localStorage.getItem("adminUsername")
      console.log("[v0] Attempting to save schedule as admin:", adminUsername)

      const scheduleData = {
        course_id: formData.course_id,
        teacher_name: formData.teacher_name || null,
        scheduled_date: formData.scheduled_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        student_id: formData.student_id || null,  // Use user_profiles.id directly
        student_name: formData.student_name || null,
        notes: formData.notes || null,
        timezone: "Asia/Shanghai",
        status: "scheduled",
      }

      console.log("[v0] Schedule data to save:", scheduleData)

      if (editingSchedule) {
        const { error } = await supabase.from("class_schedules").update(scheduleData).eq("id", editingSchedule.id)

        if (error) {
          console.error("[v0] Update error:", error)
          throw error
        }
      } else {
        const { error } = await supabase.from("class_schedules").insert([scheduleData])

        if (error) {
          console.error("[v0] Insert error:", error)
          throw error
        }
      }

      setShowAddModal(false)
      setEditingSchedule(null)
      setFormData({
        course_id: "",
        teacher_name: "",
        scheduled_date: "",
        start_time: "10:00",
        end_time: "11:00",
        student_id: "",
        student_name: "",
        notes: "",
      })
      loadData()
      alert(language === "zh" ? "保存成功" : "Saved successfully")
    } catch (error) {
      console.error("[v0] Error saving schedule:", error)
      alert(language === "zh" ? "保存失败" : "Failed to save")
    }
  }

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm(language === "zh" ? "确认删除此课程安排？" : "Confirm delete this schedule?")) {
      return
    }

    const supabase = createBrowserClient()
    try {
      const { error } = await supabase.from("class_schedules").delete().eq("id", id)

      if (error) throw error
      loadData()
      alert(language === "zh" ? "删除成功" : "Deleted successfully")
    } catch (error) {
      console.error("[v0] Error deleting schedule:", error)
      alert(language === "zh" ? "删除失败" : "Failed to delete")
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
    setCurrentMonth((prev) => subMonths(prev, 1))
  }

  const goToNextMonth = () => {
    const sixMonthsLater = addMonths(new Date(), 6)
    if (currentMonth < sixMonthsLater) {
      setCurrentMonth((prev) => addMonths(prev, 1))
    }
  }

  const days = getDaysInMonth()
  const locale = language === "zh" ? zhCN : enUS

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange/5 via-white to-blue/5">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === "zh" ? "课程表管理" : "Schedule Management"}
              </h1>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/admin")}>
                {language === "zh" ? "返回" : "Back"}
              </Button>
              <Button
                className="bg-orange hover:bg-orange/90 gap-2"
                onClick={() => {
                  setShowAddModal(true)
                  setEditingSchedule(null)
                  setFormData({
                    course_id: "",
                    teacher_name: "",
                    scheduled_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
                    start_time: "10:00",
                    end_time: "11:00",
                    student_id: "",
                    student_name: "",
                    notes: "",
                  })
                }}
              >
                <Plus className="w-4 h-4" />
                {language === "zh" ? "添加课程" : "Add Schedule"}
              </Button>
            </div>
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
                  disabled={currentMonth >= addMonths(new Date(), 5)}
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
                              {schedule.start_time} {schedule.teacher_name}
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
                {language === "zh" ? " 的课程安排" : " Schedule"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getSchedulesForDate(selectedDate).length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  {language === "zh" ? "当天没有课程安排" : "No schedules for this day"}
                </p>
              ) : (
                <div className="space-y-3">
                  {getSchedulesForDate(selectedDate).map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">
                            {schedule.start_time} - {schedule.end_time}
                          </span>
                          <span className="px-2 py-1 bg-blue/10 text-blue text-xs rounded">
                            {schedule.teacher_name}
                          </span>
                        </div>
                        <p className="mt-2 text-sm">
                          {language === "zh" ? schedule.courses?.title_zh : schedule.courses?.title_en}
                        </p>
                        {schedule.student_name && (
                          <p className="mt-1 text-xs text-gray-600">
                            <Users className="w-3 h-3 inline mr-1" />
                            {schedule.student_name}
                          </p>
                        )}
                        {schedule.notes && <p className="mt-1 text-xs text-gray-500">{schedule.notes}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingSchedule(schedule)
                            setFormData({
                              course_id: schedule.course_id,
                              teacher_name: schedule.teacher_name,
                              scheduled_date: schedule.scheduled_date,
                              start_time: schedule.start_time,
                              end_time: schedule.end_time,
                              student_id: schedule.student_id || "",
                              student_name: schedule.student_name || "",
                              notes: schedule.notes || "",
                            })
                            setShowAddModal(true)
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingSchedule
                  ? language === "zh"
                    ? "编辑课程"
                    : "Edit Schedule"
                  : language === "zh"
                    ? "添加课程"
                    : "Add Schedule"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">{language === "zh" ? "课程" : "Course"} *</label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  >
                    <option value="">{language === "zh" ? "选择课程" : "Select course"}</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {language === "zh" ? course.title_zh : course.title_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    {language === "zh" ? "教师（可选）" : "Teacher (Optional)"}
                  </label>
                  <input
                    type="text"
                    list="teachers-list"
                    value={formData.teacher_name}
                    onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                    placeholder={language === "zh" ? "输入或选择教师" : "Enter or select teacher"}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                  <datalist id="teachers-list">
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.name} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">{language === "zh" ? "日期" : "Date"} *</label>
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    min={format(new Date(), "yyyy-MM-dd")}
                    max={format(addMonths(new Date(), 6), "yyyy-MM-dd")}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      {language === "zh" ? "开始时间" : "Start Time"} *
                    </label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      {language === "zh" ? "结束时间" : "End Time"} *
                    </label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">{language === "zh" ? "学员（可选）" : "Student (Optional)"}</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      list="students-list"
                      value={formData.student_name}
                      onChange={(e) => {
                        const value = e.target.value
                        const matchedStudent = students.find((s) => s.name === value)
                        setFormData({
                          ...formData,
                          student_name: value,
                          student_id: matchedStudent?.id || "",
                        })
                      }}
                      placeholder={language === "zh" ? "输入或选择学员" : "Enter or select student"}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                    <datalist id="students-list">
                      {students.map((student) => (
                        <option key={student.id} value={student.name} />
                      ))}
                    </datalist>
                    <p className="text-xs text-gray-500">
                      {language === "zh" ? "可从列表选择或手动输入学员姓名" : "Select from list or enter student name manually"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">{language === "zh" ? "备注" : "Notes"}</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingSchedule(null)
                    }}
                  >
                    {language === "zh" ? "取消" : "Cancel"}
                  </Button>
                  <Button className="flex-1 bg-orange hover:bg-orange/90" onClick={handleAddSchedule}>
                    {language === "zh" ? "保存" : "Save"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

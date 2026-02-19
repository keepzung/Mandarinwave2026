"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createBrowserClient } from "@/lib/supabase/client"
import { CourseSelector } from "@/components/course-selector"
import { format, addDays, startOfDay } from "date-fns"
import { Calendar, Clock } from "lucide-react"

export function CTA() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredDate: "",
    preferredTime: "",
  })
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [availableTimes] = useState([
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ])

  useEffect(() => {
    const dates: Date[] = []
    const today = startOfDay(new Date())
    for (let i = 0; i < 30; i++) {
      dates.push(addDays(today, i))
    }
    setAvailableDates(dates)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createBrowserClient()

      const { error } = await supabase.from("booking_inquiries").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          course_id: selectedCourses.length > 0 ? selectedCourses[0] : null,
          preferred_date: formData.preferredDate || null,
          preferred_time: formData.preferredTime || null,
          timezone: "Asia/Shanghai",
          created_at: new Date().toISOString(),
        },
      ])

      if (error) {
        console.error("[v0] Booking submission error:", error)
        throw error
      }

      console.log("[v0] Booking form submitted successfully:", formData, "courses:", selectedCourses)
      alert(language === "zh" ? "提交成功！我们会尽快联系您。" : "Submitted successfully! We will contact you soon.")
      setFormData({ name: "", email: "", phone: "", message: "", preferredDate: "", preferredTime: "" })
      setSelectedCourses([])
    } catch (err) {
      console.error("[v0] Error submitting booking:", err)
      alert(language === "zh" ? "提交失败，请重试。" : "Submission failed, please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-blue">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">{t.cta.title}</h2>
          <p className="text-xl text-white/95 max-w-2xl mx-auto leading-relaxed">{t.cta.subtitle}</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
          <h3 className="text-2xl font-bold text-black mb-6 text-center">
            {language === "zh" ? "立即预约" : "Book Now"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {language === "zh" ? "姓名" : "Name"}
              </label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={language === "zh" ? "请输入您的姓名" : "Enter your name"}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {language === "zh" ? "邮箱" : "Email"}
              </label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder={language === "zh" ? "请输入您的邮箱" : "Enter your email"}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {language === "zh" ? "电话" : "Phone"}
              </label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder={language === "zh" ? "请输入您的电话" : "Enter your phone number"}
                className="w-full"
              />
            </div>

            <CourseSelector
              selectedCourses={selectedCourses}
              onSelectionChange={setSelectedCourses}
              multiple={false}
              label={language === "zh" ? "选择试课课程" : "Select Trial Course"}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                {language === "zh" ? "选择试课日期" : "Select Trial Date"}
              </label>
              <div className="grid grid-cols-7 gap-2 p-4 border rounded-lg bg-gray-50">
                {availableDates.map((date, idx) => {
                  const isSelected = formData.preferredDate === format(date, "yyyy-MM-dd")
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredDate: format(date, "yyyy-MM-dd") })}
                      className={`p-2 text-center rounded-lg transition-colors ${
                        isSelected ? "bg-orange text-white" : "bg-white hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <div className="text-xs text-gray-500">{format(date, "MM/dd")}</div>
                      <div className="text-sm font-medium">{format(date, "d")}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                {language === "zh" ? "选择试课时间 (北京时间)" : "Select Trial Time (Beijing Time)"}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.map((time) => {
                  const isSelected = formData.preferredTime === time
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredTime: time })}
                      className={`p-2 text-sm rounded-lg transition-colors ${
                        isSelected ? "bg-orange text-white" : "bg-white hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                {language === "zh" ? "留言（选填）" : "Message (Optional)"}
              </label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                placeholder={
                  language === "zh" ? "请告诉我们您的学习需求或问题" : "Tell us about your learning needs or questions"
                }
                className="w-full min-h-[120px]"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full bg-orange hover:bg-orange/90 text-white text-lg py-6 shadow-lg"
            >
              {loading
                ? language === "zh"
                  ? "提交中..."
                  : "Submitting..."
                : language === "zh"
                  ? "提交预约"
                  : "Submit Booking"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

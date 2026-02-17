"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format, addDays, startOfDay } from "date-fns"
import { zhCN } from "date-fns/locale"

function BookingContent() {
  const { language } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const course = searchParams.get("course")
  const packageId = searchParams.get("package")

  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    email: "",
    phone: "",
    level: "",
  })

  const generateAvailableDates = () => {
    const dates = []
    const today = startOfDay(new Date())

    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i)
      const dateStr = format(date, "yyyy-MM-dd")

      let label
      if (language === "zh") {
        // Format: "12月28日 周六"
        label = format(date, "M月d日 EEEE", { locale: zhCN })
      } else {
        // Format: "Dec 28, Saturday"
        label = format(date, "MMM d, EEEE")
      }

      dates.push({ date: dateStr, label })
    }

    return dates
  }

  const availableDates = generateAvailableDates()

  const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]

  const levels = [
    { value: "beginner", label: language === "zh" ? "零基础" : "Beginner" },
    { value: "elementary", label: language === "zh" ? "初级 (HSK 1-2)" : "Elementary (HSK 1-2)" },
    { value: "intermediate", label: language === "zh" ? "中级 (HSK 3-4)" : "Intermediate (HSK 3-4)" },
    { value: "advanced", label: language === "zh" ? "高级 (HSK 5-6)" : "Advanced (HSK 5-6)" },
  ]

  const handleSubmit = () => {
    // In a real app, this would submit to a backend
    alert(
      language === "zh"
        ? "预约成功！我们会尽快与您联系确认。"
        : "Booking successful! We will contact you soon to confirm.",
    )
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/courses/${course}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === "zh" ? "返回课程" : "Back to Course"}
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            {language === "zh" ? "预约课程" : "Book Your Course"}
          </h1>
          <p className="text-gray-600">
            {language === "zh" ? "请选择上课时间并填写您的信息" : "Select your class time and fill in your information"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? "bg-orange text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-16 h-1 mx-2 ${step > s ? "bg-orange" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Step 1: Select Date */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-6 h-6 text-orange" />
                <h2 className="text-2xl font-bold text-black">{language === "zh" ? "选择上课日期" : "Select Date"}</h2>
              </div>
              <div className="max-h-96 overflow-y-auto mb-8 pr-2">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {availableDates.map((date) => (
                    <button
                      key={date.date}
                      onClick={() => setSelectedDate(date.date)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedDate === date.date
                          ? "border-orange bg-orange/5"
                          : "border-gray-200 hover:border-orange/50"
                      }`}
                    >
                      <div className="font-bold text-black">{date.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedDate}
                className="w-full bg-orange hover:bg-orange/90 text-white"
              >
                {language === "zh" ? "下一步" : "Next"}
              </Button>
            </div>
          )}

          {/* Step 2: Select Time */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-6 h-6 text-orange" />
                <h2 className="text-2xl font-bold text-black">{language === "zh" ? "选择上课时间" : "Select Time"}</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {language === "zh" ? "时区：北京时间 (UTC+8)" : "Timezone: Beijing Time (UTC+8)"}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-8">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTime === time ? "border-orange bg-orange/5" : "border-gray-200 hover:border-orange/50"
                    }`}
                  >
                    <div className="font-bold text-black">{time}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  {language === "zh" ? "上一步" : "Previous"}
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedTime}
                  className="flex-1 bg-orange hover:bg-orange/90 text-white"
                >
                  {language === "zh" ? "下一步" : "Next"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Student Information */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <User className="w-6 h-6 text-orange" />
                <h2 className="text-2xl font-bold text-black">
                  {language === "zh" ? "填写您的信息" : "Your Information"}
                </h2>
              </div>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold mb-2 text-black">
                    {language === "zh" ? "姓名" : "Name"} *
                  </label>
                  <input
                    type="text"
                    value={studentInfo.name}
                    onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-orange focus:outline-none"
                    placeholder={language === "zh" ? "请输入您的姓名" : "Enter your name"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-black">
                    {language === "zh" ? "电子邮箱" : "Email"} *
                  </label>
                  <input
                    type="email"
                    value={studentInfo.email}
                    onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-orange focus:outline-none"
                    placeholder={language === "zh" ? "请输入您的邮箱" : "Enter your email"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-black">
                    {language === "zh" ? "手机号码" : "Phone"} *
                  </label>
                  <input
                    type="tel"
                    value={studentInfo.phone}
                    onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-orange focus:outline-none"
                    placeholder={language === "zh" ? "请输入您的手机号" : "Enter your phone"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-black">
                    {language === "zh" ? "当前中文水平" : "Current Chinese Level"} *
                  </label>
                  <select
                    value={studentInfo.level}
                    onChange={(e) => setStudentInfo({ ...studentInfo, level: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-orange focus:outline-none"
                  >
                    <option value="">{language === "zh" ? "请选择" : "Please select"}</option>
                    {levels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-4 text-black">
                  {language === "zh" ? "预约信息确认" : "Booking Summary"}
                </h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>{language === "zh" ? "日期：" : "Date:"}</span>
                    <span className="font-bold">{availableDates.find((d) => d.date === selectedDate)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === "zh" ? "时间：" : "Time:"}</span>
                    <span className="font-bold">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === "zh" ? "课程：" : "Course:"}</span>
                    <span className="font-bold">{language === "zh" ? "在线一对一" : "One-on-One Online"}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  {language === "zh" ? "上一步" : "Previous"}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!studentInfo.name || !studentInfo.email || !studentInfo.phone || !studentInfo.level}
                  className="flex-1 bg-orange hover:bg-orange/90 text-white"
                >
                  {packageId === "trial"
                    ? language === "zh"
                      ? "确认预约"
                      : "Confirm Booking"
                    : language === "zh"
                      ? "去支付"
                      : "Proceed to Payment"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingContent />
    </Suspense>
  )
}

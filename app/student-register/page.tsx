"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"
import { CourseSelector } from "@/components/course-selector"

export default function StudentRegisterPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError(language === "zh" ? "两次输入的密码不一致" : "Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError(language === "zh" ? "密码至少需要6位" : "Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const supabase = createBrowserClient()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: undefined,
          data: {
            name: formData.name,
            phone: formData.phone,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        const { data: sessionData } = await supabase.auth.getSession()
        console.log("[v0] Session after signup:", sessionData.session ? "exists" : "null")

        const { error: profileError } = await supabase.from("user_profiles").insert([
          {
            user_id: authData.user.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: "student",
            created_at: new Date().toISOString(),
          },
        ])

        if (profileError) {
          console.error("[v0] Profile creation error:", profileError.message)
          throw profileError
        }

        if (selectedCourses.length > 0) {
          const enrollments = selectedCourses.map((courseId) => ({
            user_id: authData.user.id,
            course_id: courseId,
            enrollment_status: "interested",
            enrolled_at: new Date().toISOString(),
          }))

          console.log("[v0] Attempting to insert enrollments:", enrollments.length)
          const { error: enrollmentError } = await supabase.from("user_course_enrollments").insert(enrollments)

          if (enrollmentError) {
            console.error("[v0] Course enrollment error:", enrollmentError.message)
            console.log("[v0] Note: Course enrollments failed but profile created successfully")
          } else {
            console.log("[v0] Course enrollments successful")
          }
        }
      }

      alert(language === "zh" ? "注册成功！现在可以直接登录。" : "Registration successful! You can now login directly.")
      router.push("/student-login")
    } catch (err: any) {
      console.error("[v0] Registration error:", err.message)
      setError(err.message || (language === "zh" ? "注册失败，请重试" : "Registration failed, please try again"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/5 via-white to-orange/5">
      {/* Back to Home */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {language === "zh" ? "返回首页" : "Back to Home"}
        </Link>
      </div>

      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image src="/logo.png" alt="MandarinWave Logo" width={64} height={64} className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === "zh" ? "学员注册" : "Student Registration"}
            </h1>
            <p className="text-gray-600">
              {language === "zh"
                ? "创建账号开始您的中文学习之旅"
                : "Create an account to start your Chinese learning journey"}
            </p>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "zh" ? "姓名" : "Name"}
                </label>
                <Input
                  type="text"
                  placeholder={language === "zh" ? "请输入您的姓名" : "Enter your name"}
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "zh" ? "邮箱" : "Email"}
                </label>
                <Input
                  type="email"
                  placeholder={language === "zh" ? "请输入邮箱" : "Enter your email"}
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "zh" ? "电话" : "Phone"}
                </label>
                <Input
                  type="tel"
                  placeholder={language === "zh" ? "请输入电话" : "Enter your phone number"}
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "zh" ? "密码" : "Password"}
                </label>
                <Input
                  type="password"
                  placeholder={language === "zh" ? "至少6位密码" : "At least 6 characters"}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "zh" ? "确认密码" : "Confirm Password"}
                </label>
                <Input
                  type="password"
                  placeholder={language === "zh" ? "再次输入密码" : "Enter password again"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className="w-full"
                />
              </div>

              <CourseSelector
                selectedCourses={selectedCourses}
                onSelectionChange={setSelectedCourses}
                multiple={true}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange hover:bg-orange/90 text-white h-12 text-lg"
              >
                {loading
                  ? language === "zh"
                    ? "注册中..."
                    : "Registering..."
                  : language === "zh"
                    ? "注册"
                    : "Register"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              {language === "zh" ? "已有账号？" : "Already have an account?"}{" "}
              <Link href="/student-login" className="text-orange hover:text-orange/80 font-medium">
                {language === "zh" ? "立即登录" : "Login now"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

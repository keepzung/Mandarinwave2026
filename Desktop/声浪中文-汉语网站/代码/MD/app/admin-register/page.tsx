"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"
import { Mail, Lock, User, Phone } from "lucide-react"

export default function AdminRegisterPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })
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
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
          data: {
            name: formData.name,
            phone: formData.phone,
            role: "admin",
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase.from("user_profiles").insert([
          {
            user_id: authData.user.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: "admin",
            created_at: new Date().toISOString(),
          },
        ])

        if (profileError) {
          console.error("[v0] Profile creation error:", profileError.message)
          throw profileError
        }
      }

      alert(
        language === "zh"
          ? "管理员账号注册成功！请检查邮箱确认后登录。"
          : "Admin account registered! Please check your email to confirm before logging in.",
      )
      router.push("/admin-login")
    } catch (err: any) {
      console.error("[v0] Registration error:", err.message)
      setError(err.message || (language === "zh" ? "注册失败，请重试" : "Registration failed, please try again"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange/10 via-white to-blue/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            {language === "zh" ? "管理员注册" : "Admin Registration"}
          </CardTitle>
          <p className="text-gray-600 mt-2">{language === "zh" ? "申请管理员账号" : "Apply for admin account"}</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {language === "zh" ? "姓名" : "Name"}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder={language === "zh" ? "请输入您的姓名" : "Enter your name"}
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {language === "zh" ? "邮箱" : "Email"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder={language === "zh" ? "请输入邮箱" : "Enter your email"}
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {language === "zh" ? "电话" : "Phone"}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="tel"
                  placeholder={language === "zh" ? "请输入电话" : "Enter your phone number"}
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {language === "zh" ? "密码" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder={language === "zh" ? "至少6位密码" : "At least 6 characters"}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {language === "zh" ? "确认密码" : "Confirm Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder={language === "zh" ? "再次输入密码" : "Enter password again"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-orange hover:bg-orange/90 text-white h-12">
              {loading ? (language === "zh" ? "注册中..." : "Registering...") : language === "zh" ? "注册" : "Register"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 bg-transparent"
              onClick={() => router.push("/admin-login")}
            >
              {language === "zh" ? "返回登录" : "Back to Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {language === "zh" ? "已有账号？" : "Already have an account?"}{" "}
            <Link href="/admin-login" className="text-orange hover:text-orange/80 font-medium">
              {language === "zh" ? "立即登录" : "Login now"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

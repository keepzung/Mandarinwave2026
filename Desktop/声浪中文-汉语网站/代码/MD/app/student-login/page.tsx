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

export default function StudentLoginPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showResendConfirmation, setShowResendConfirmation] = useState(false)

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  setShowResendConfirmation(false)
  setLoading(true)

  try {
    const supabase = createBrowserClient()

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (loginError) {
      if (
        loginError.message.includes("Email not confirmed") ||
        loginError.message.includes("not confirmed")
      ) {
        setShowResendConfirmation(true)

        throw new Error(
          language === "zh"
            ? "邮箱未验证，请先查看邮箱中的验证链接。如未收到验证邮件，请点击下方重新发送。"
            : "Email not verified. Please check your inbox.",
        )
      }

      throw loginError
    }

    if (data.session) {
      await new Promise(resolve => setTimeout(resolve, 100))
      window.location.href = "/student-dashboard"
    } else {
      throw new Error("Login session not ready")
    }

  } catch (err: any) {
    setError(
      err.message ||
        (language === "zh"
          ? "登录失败，请检查邮箱和密码"
          : "Login failed, please check your email and password")
    )
  } finally {
    setLoading(false)
  }
}

  const handleResendConfirmation = async () => {
    if (!email) {
      setError(language === "zh" ? "请先输入邮箱地址" : "Please enter your email address first")
      return
    }

    setLoading(true)
    try {
      const supabase = createBrowserClient()

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (error) throw error

      setError("")
      alert(
        language === "zh" ? "验证邮件已重新发送，请查收邮箱！" : "Verification email sent! Please check your inbox.",
      )
      setShowResendConfirmation(false)
    } catch (err: any) {
      setError(err.message || (language === "zh" ? "发送失败，请重试" : "Failed to send, please try again"))
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
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image src="/logo.png" alt="MandarinWave Logo" width={64} height={64} className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === "zh" ? "学员登录" : "Student Login"}
            </h1>
            <p className="text-gray-600">
              {language === "zh" ? "登录查看您的学习进度" : "Login to view your learning progress"}
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
                {showResendConfirmation && (
                  <button
                    onClick={handleResendConfirmation}
                    className="mt-2 text-blue hover:text-blue/80 font-medium underline block"
                    disabled={loading}
                  >
                    {language === "zh" ? "重新发送验证邮件" : "Resend verification email"}
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "zh" ? "邮箱" : "Email"}
                </label>
                <Input
                  type="email"
                  placeholder={language === "zh" ? "请输入邮箱" : "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder={language === "zh" ? "请输入密码" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue focus:ring-blue" />
                  <span className="text-gray-600">{language === "zh" ? "记住我" : "Remember me"}</span>
                </label>
                <a href="#" className="text-blue hover:text-blue/80">
                  {language === "zh" ? "忘记密码？" : "Forgot password?"}
                </a>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue hover:bg-blue/90 text-white h-12 text-lg"
              >
                {loading ? (language === "zh" ? "登录中..." : "Logging in...") : language === "zh" ? "登录" : "Login"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              {language === "zh" ? "还没有账号？" : "Don't have an account?"}{" "}
              <Link href="/student-register" className="text-orange hover:text-orange/80 font-medium">
                {language === "zh" ? "立即注册" : "Register now"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

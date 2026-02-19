"use client"

import type React from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Lock, User } from "lucide-react"

export default function AdminLogin() {
  const { language } = useLanguage()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    localStorage.removeItem("adminLoggedIn")
    localStorage.removeItem("adminUser")
    localStorage.removeItem("adminUsername")
    localStorage.removeItem("adminName")
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === "Account is deactivated") {
          throw new Error(language === "zh" ? "该账户已被停用" : "This account has been deactivated")
        }
        throw new Error(language === "zh" ? "用户名或密码错误" : "Invalid username or password")
      }

      localStorage.setItem("adminLoggedIn", "true")
      localStorage.setItem("adminUsername", username)
      localStorage.setItem("adminName", data.admin?.name || username)
      localStorage.setItem("adminToken", data.token)
      router.push("/admin")
    } catch (err: any) {
      setError(
        err.message || (language === "zh" ? "登录失败，请检查用户名和密码" : "Login failed, please check credentials"),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange/10 via-white to-blue/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md flex flex-col">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            {language === "zh" ? "教务人员登录" : "Admin Login"}
          </CardTitle>
          <p className="text-gray-600 mt-2 min-h-[3rem] flex items-center justify-center">
            {language === "zh" ? "使用管理员分配的账号登录" : "Login with assigned credentials"}
          </p>
        </CardHeader>
        <CardContent className="mt-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {language === "zh" ? "用户名" : "Username"}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  placeholder={language === "zh" ? "输入用户名" : "Enter username"}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {language === "zh" ? "密码" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-orange hover:bg-orange/90 h-12">
              {loading ? (language === "zh" ? "登录中..." : "Logging in...") : language === "zh" ? "登录" : "Login"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 bg-transparent"
              onClick={() => router.push("/")}
            >
              {language === "zh" ? "返回首页" : "Back to Home"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {language === "zh" ? "如需管理员账号，请联系校长" : "Contact principal for admin account"}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

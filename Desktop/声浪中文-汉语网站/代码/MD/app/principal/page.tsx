"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { UserPlus, Trash2, Eye, EyeOff, Home, Lock, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminAccount {
  id: string
  username: string
  name: string
  email: string
  phone: string
  is_active: boolean
  created_at: string
}

const PRINCIPAL_PASSWORD = "MWPM"

export default function PrincipalPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessPassword, setAccessPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showAccessPassword, setShowAccessPassword] = useState(false)
  const [admins, setAdmins] = useState<AdminAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
  })

  const loadAdmins = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/list")
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to load admins")
      }

      setAdmins(result.data || [])
    } catch (err: any) {
      setError(language === "zh" ? `加载管理员列表失败: ${err.message}` : `Failed to load admin list: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadAdmins()
    }
  }, [isAuthenticated])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (accessPassword === PRINCIPAL_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordError("")
    } else {
      setPasswordError(language === "zh" ? "密码错误，请重试" : "Incorrect password, please try again")
    }
  }

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange/10 via-white to-blue/10 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-orange" />
            </div>
            <CardTitle className="text-2xl">
              {language === "zh" ? "校长管理系统" : "Principal Management System"}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {language === "zh" ? "请输入访问密码" : "Please enter access password"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {language === "zh" ? "访问密码" : "Access Password"}
                </label>
                <div className="relative">
                  <input
                    type={showAccessPassword ? "text" : "password"}
                    value={accessPassword}
                    onChange={(e) => setAccessPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                    placeholder="••••••••"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccessPassword(!showAccessPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showAccessPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-orange hover:bg-orange/90">
                <Lock className="w-4 h-4 mr-2" />
                {language === "zh" ? "进入系统" : "Enter System"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => router.push("/")}
              >
                <Home className="w-4 h-4 mr-2" />
                {language === "zh" ? "返回首页" : "Back to Home"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.username || !formData.password || !formData.name) {
      setError(language === "zh" ? "请填写所有必填字段" : "Please fill in all required fields")
      return
    }

    try {
      const response = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          principalPassword: PRINCIPAL_PASSWORD,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create admin")
      }

      setSuccess(language === "zh" ? "管理员账户创建成功！" : "Admin account created successfully!")
      setFormData({ username: "", password: "", name: "", email: "", phone: "" })
      loadAdmins()
    } catch (err: any) {
      setError(
        language === "zh" ? `创建管理员账户失败: ${err.message}` : `Failed to create admin account: ${err.message}`,
      )
    }
  }

  const handleDeleteAdmin = async (id: string) => {
    if (
      !confirm(
        language === "zh" ? "确定要删除这个管理员账户吗？" : "Are you sure you want to delete this admin account?",
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/admin/delete?id=${id}`, { method: "DELETE" })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete admin")
      }

      setSuccess(language === "zh" ? "管理员账户已删除" : "Admin account deleted")
      loadAdmins()
    } catch (err: any) {
      setError(err.message || (language === "zh" ? "删除管理员账户失败" : "Failed to delete admin account"))
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/toggle-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update status")
      }

      setSuccess(language === "zh" ? "状态已更新" : "Status updated")
      loadAdmins()
    } catch (err: any) {
      setError(err.message || (language === "zh" ? "更新状态失败" : "Failed to update status"))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange/10 via-white to-blue/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {language === "zh" ? "校长管理系统" : "Principal Management System"}
            </h1>
            <p className="text-gray-600 mt-2">{language === "zh" ? "管理教务管理员账户" : "Manage admin accounts"}</p>
          </div>
          <Button onClick={() => router.push("/")} variant="outline" className="gap-2">
            <Home className="w-4 h-4" />
            {language === "zh" ? "返回首页" : "Home"}
          </Button>
        </div>

        {/* Alerts */}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Admin Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                {language === "zh" ? "创建管理员账户" : "Create Admin Account"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {language === "zh" ? "用户名" : "Username"} *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                    placeholder={language === "zh" ? "输入用户名" : "Enter username"}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {language === "zh" ? "密码" : "Password"} *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {language === "zh" ? "姓名" : "Name"} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                    placeholder={language === "zh" ? "输入姓名" : "Enter name"}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {language === "zh" ? "邮箱" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {language === "zh" ? "电话" : "Phone"}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                    placeholder="+86 138 0000 0000"
                  />
                </div>

                <Button type="submit" className="w-full bg-orange hover:bg-orange/90">
                  {language === "zh" ? "创建账户" : "Create Account"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Admin List */}
          <Card>
            <CardHeader>
              <CardTitle>{language === "zh" ? "管理员列表" : "Admin List"}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-600 text-center py-8">{language === "zh" ? "加载中..." : "Loading..."}</p>
              ) : admins.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  {language === "zh" ? "暂无管理员账户" : "No admin accounts yet"}
                </p>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-orange/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                          <p className="text-sm text-gray-600">@{admin.username}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            admin.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {admin.is_active
                            ? language === "zh"
                              ? "激活"
                              : "Active"
                            : language === "zh"
                              ? "停用"
                              : "Inactive"}
                        </span>
                      </div>
                      {admin.email && <p className="text-sm text-gray-600 mb-1">{admin.email}</p>}
                      {admin.phone && <p className="text-sm text-gray-600 mb-3">{admin.phone}</p>}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(admin.id, admin.is_active)}
                          className="flex-1"
                        >
                          {admin.is_active
                            ? language === "zh"
                              ? "停用"
                              : "Deactivate"
                            : language === "zh"
                              ? "激活"
                              : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
        </div>
      </div>
    </div>
  )
}

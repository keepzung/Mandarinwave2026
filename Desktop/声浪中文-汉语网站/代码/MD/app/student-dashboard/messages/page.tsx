"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Send, MessageSquare, User, AlertTriangle } from "lucide-react"

interface Message {
  id: string
  from_user_id: string
  to_user_id: string
  subject: string
  content: string
  is_read: boolean
  created_at: string
  from_name?: string
  to_name?: string
}

interface Teacher {
  id: string
  name: string
  username: string
}

export default function MessagesPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [currentUserId, setCurrentUserId] = useState("")
  const [dbError, setDbError] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const supabase = createBrowserClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/student-login")
      return
    }

    setCurrentUserId(user.id)

    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order("created_at", { ascending: false })

      if (messagesError) {
        if (messagesError.message?.includes("schema cache")) {
          console.log("[v0] messages table not found, showing empty state")
          setDbError(true)
          setMessages([])
        } else {
          console.error("[v0] Error loading messages:", messagesError)
        }
      } else {
        const userIds = new Set<string>()
        messagesData?.forEach((msg) => {
          userIds.add(msg.from_user_id)
          userIds.add(msg.to_user_id)
        })

        const { data: profilesData } = await supabase
          .from("user_profiles")
          .select("user_id, name")
          .in("user_id", Array.from(userIds))

        const nameMap = new Map()
        profilesData?.forEach((profile) => {
          nameMap.set(profile.user_id, profile.name)
        })

        const enrichedMessages =
          messagesData?.map((msg) => ({
            ...msg,
            from_name: nameMap.get(msg.from_user_id) || "Unknown",
            to_name: nameMap.get(msg.to_user_id) || "Unknown",
          })) || []

        setMessages(enrichedMessages)
      }
    } catch (error: any) {
      if (error.message?.includes("schema cache")) {
        console.log("[v0] messages table not found, showing empty state")
        setDbError(true)
        setMessages([])
      } else {
        console.error("[v0] Error loading messages:", error)
      }
    }

    const { data: adminsData, error: adminsError } = await supabase
      .from("admin_accounts")
      .select("*")
      .eq("is_active", true)

    if (adminsError) {
      console.error("[v0] Error loading teachers:", adminsError)
    } else {
      setTeachers(
        adminsData?.map((admin) => ({
          id: admin.id,
          name: admin.name || admin.username,
          username: admin.username,
        })) || [],
      )
    }

    setLoading(false)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (dbError) {
      alert(
        language === "zh"
          ? "数据库表尚未创建，请先运行SQL设置脚本"
          : "Database tables not created yet. Please run the SQL setup script first.",
      )
      return
    }

    if (!selectedTeacher || !content.trim()) {
      alert(language === "zh" ? "请选择教师并输入消息内容" : "Please select a teacher and enter message content")
      return
    }

    setSending(true)

    try {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert(language === "zh" ? "请先登录" : "Please login first")
        router.push("/student-login")
        return
      }

      const { error } = await supabase.from("messages").insert([
        {
          from_user_id: user.id,
          to_user_id: selectedTeacher,
          subject: subject || (language === "zh" ? "无主题" : "No subject"),
          content: content,
        },
      ])

      if (error) throw error

      alert(language === "zh" ? "消息发送成功！" : "Message sent successfully!")
      setSubject("")
      setContent("")
      setSelectedTeacher("")
      loadData()
    } catch (error: any) {
      if (error.message?.includes("schema cache")) {
        console.log("[v0] messages table not found during send")
        alert(
          language === "zh"
            ? "数据库表尚未创建，请先运行SQL设置脚本"
            : "Database tables not created yet. Please run the SQL setup script first.",
        )
      } else {
        console.error("[v0] Send message error:", error)
        alert(language === "zh" ? "发送失败，请重试" : "Failed to send, please try again")
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/5 via-white to-orange/5">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{language === "zh" ? "消息中心" : "Messages"}</h1>
            <Button variant="outline" onClick={() => router.push("/student-dashboard")}>
              {language === "zh" ? "返回" : "Back"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {dbError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-yellow-900">
                {language === "zh" ? "数据库表尚未设置" : "Database Tables Not Set Up"}
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                {language === "zh"
                  ? "消息功能需要在Supabase控制台中运行 scripts/create_student_system_tables.sql 脚本来创建必要的数据库表。"
                  : "The messaging feature requires running the scripts/create_student_system_tables.sql script in your Supabase console to create the necessary database tables."}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue" />
                {language === "zh" ? "发送消息" : "Send Message"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "zh" ? "选择教师" : "Select Teacher"}
                  </label>
                  <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                    required
                  >
                    <option value="">{language === "zh" ? "请选择教师" : "Please select a teacher"}</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} (@{teacher.username})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "zh" ? "主题（可选）" : "Subject (Optional)"}
                  </label>
                  <Input
                    type="text"
                    placeholder={language === "zh" ? "消息主题" : "Message subject"}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "zh" ? "消息内容" : "Message Content"}
                  </label>
                  <textarea
                    placeholder={language === "zh" ? "输入消息内容..." : "Enter message content..."}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue"
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-blue hover:bg-blue/90" disabled={sending}>
                  {sending
                    ? language === "zh"
                      ? "发送中..."
                      : "Sending..."
                    : language === "zh"
                      ? "发送消息"
                      : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange" />
                {language === "zh" ? "消息记录" : "Message History"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {language === "zh" ? "暂无消息" : "No messages yet"}
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border ${
                        message.from_user_id === currentUserId
                          ? "bg-blue/5 border-blue/20"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-sm">
                            {message.from_user_id === currentUserId
                              ? language === "zh"
                                ? "我"
                                : "Me"
                              : message.from_name}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="text-sm text-gray-600">
                            {message.to_user_id === currentUserId ? (language === "zh" ? "我" : "Me") : message.to_name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {message.subject && <div className="font-medium text-gray-900 mb-1">{message.subject}</div>}
                      <p className="text-sm text-gray-700">{message.content}</p>
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

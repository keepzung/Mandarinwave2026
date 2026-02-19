"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Users,
  Calendar,
  LogOut,
  Plus,
  CalendarCheck,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  Edit2,
  Save,
  X,
  Trash2,
} from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Student {
  id: string
  user_id: string
  name: string
  email: string
  phone?: string
  total_classes?: number
  used_classes?: number
  remaining_classes?: number
  total_orders?: number
  total_spent?: number
  student_class_balance?: {
    total_classes: number
    used_classes: number
    remaining_classes: number
  } | null
}

interface TodayClass {
  id: string
  scheduled_date: string
  start_time: string
  end_time: string
  student_name: string
  teacher_name: string
  course_id: string
  status: string
  courses?: {
    title_zh: string
    title_en: string
    color: string
  }
}

interface BookingInquiry {
  id: string
  name: string
  email: string
  phone: string
  message?: string
  course_id?: string
  status: string
  created_at: string
  courses?: {
    title_zh: string
    title_en: string
  }
}

export default function AdminDashboard() {
  const { language } = useLanguage()
  const t = useTranslation(language)
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [todayClasses, setTodayClasses] = useState<any[]>([])
  const [bookingInquiries, setBookingInquiries] = useState<any[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [editingStudent, setEditingStudent] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    total_classes: "",
    used_classes: "",
  })
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalOrders: 0,
    monthlyRevenue: 0,
    todayClassesCount: 0,
    activeClasses: 0,
  })
  const [allRegisteredUsers, setAllRegisteredUsers] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [viewingOrders, setViewingOrders] = useState<string | null>(null)
  const [studentOrders, setStudentOrders] = useState<any[]>([])
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [orderEditStatus, setOrderEditStatus] = useState("")
  const [orderEditStudentId, setOrderEditStudentId] = useState("")
  const [savingOrder, setSavingOrder] = useState(false)

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!adminLoggedIn) {
      // Ensure all admin data is cleared
      localStorage.removeItem("adminLoggedIn")
      localStorage.removeItem("adminUser")
      localStorage.removeItem("adminUsername")
      localStorage.removeItem("adminName")
      router.push("/admin-login")
    } else {
      loadDashboardData()
    }
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    const supabase = createBrowserClient()
    try {
      console.log("[v0] Loading admin dashboard data...")

      const { data: studentsData, error: studentsError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("role", "student")
        .order("created_at", { ascending: false })

      console.log("[v0] Students query result:", { 
        studentsCount: studentsData?.length || 0, 
        error: studentsError,
        firstStudent: studentsData?.[0]
      })

      if (studentsError) {
        console.error("[v0] Error loading students:", studentsError.message)
      } else {
        // Load balance data for each student
        const studentsWithBalance = await Promise.all(
          (studentsData || []).map(async (student) => {
            const { data: balance } = await supabase
              .from("student_class_balance")
              .select("total_classes, used_classes, remaining_classes")
              .eq("student_id", student.id)
              .maybeSingle()

            console.log("[v0] Balance for student", student.name, ":", balance)

            return {
              ...student,
              student_class_balance: balance,
            }
          }),
        )

        console.log("[v0] Students loaded with balance:", studentsWithBalance.length, studentsWithBalance)
        setStudents(studentsWithBalance)
      }

      const today = format(new Date(), "yyyy-MM-dd")
      const { data: classesData, error: classesError } = await supabase
        .from("class_schedules")
        .select("*, courses(title_zh, title_en, color)")
        .eq("scheduled_date", today)
        .order("start_time", { ascending: true })

      if (classesError) {
        console.log("[v0] Error loading today's classes:", classesError.message)
      } else {
        console.log("[v0] Today's classes loaded:", classesData?.length || 0)
        setTodayClasses(classesData || [])
      }

      const { data: inquiriesData, error: inquiriesError } = await supabase
        .from("booking_inquiries")
        .select("*, courses(title_zh, title_en)")
        .order("created_at", { ascending: false })
        .limit(20)

      if (inquiriesError) {
        console.error("[v0] Error loading inquiries:", inquiriesError.message)
        console.error("[v0] Full inquiry error:", inquiriesError)
      } else {
        console.log("[v0] Booking inquiries loaded:", inquiriesData?.length || 0)
        console.log("[v0] Inquiries data:", inquiriesData)
        setBookingInquiries(inquiriesData || [])
      }

      const { data: registeredUsers, error: usersError } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (usersError) {
        console.error("[v0] Error loading registered users:", usersError)
      } else {
        console.log("[v0] Registered users loaded:", registeredUsers)
        setAllRegisteredUsers(registeredUsers || [])
      }

      console.log("[v0] Starting to query student_orders table...")
      const supabaseForOrders = createBrowserClient()

      console.log("[v0] Attempting orders query without filters first...")
      const {
        data: ordersData,
        error: ordersError,
        count,
      } = await supabaseForOrders
        .from("student_orders")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(50)

      console.log("[v0] Orders query result:", {
        ordersCount: ordersData?.length || 0,
        totalCount: count,
        hasError: !!ordersError,
        errorDetails: ordersError,
        errorCode: ordersError?.code,
        errorMessage: ordersError?.message,
        firstOrder: ordersData?.[0],
        allOrderIds: ordersData?.map((o) => o.id),
      })

      if (ordersError) {
        console.error("[v0] Error loading orders:", ordersError.message)
        console.error("[v0] Full orders error:", ordersError)
      } else {
        console.log("[v0] All orders loaded successfully:", ordersData?.length || 0)

        // Load student profiles for each order
        const ordersWithProfiles = await Promise.all(
          (ordersData || []).map(async (order) => {
            console.log("[v0] Looking up profile for order:", order.order_number, "student_id:", order.student_id)
            
            // Try to find profile by id first (student_id might be user_profiles.id)
            const { data: profileById, error: errorById } = await supabase
              .from("user_profiles")
              .select("name, email")
              .eq("id", order.student_id)
              .maybeSingle()

            console.log("[v0] Profile by id result:", { profileById, errorById })

            if (profileById) {
              console.log("[v0] Found profile by id:", profileById.name)
              return {
                ...order,
                user_profiles: profileById,
              }
            }

            // If not found, try by user_id (student_id might be auth.users.id)
            const { data: profileByUserId, error: errorByUserId } = await supabase
              .from("user_profiles")
              .select("name, email")
              .eq("user_id", order.student_id)
              .maybeSingle()

            console.log("[v0] Profile by user_id result:", { profileByUserId, errorByUserId })

            if (profileByUserId) {
              console.log("[v0] Found profile by user_id:", profileByUserId.name)
              return {
                ...order,
                user_profiles: profileByUserId,
              }
            }

            console.log("[v0] No profile found for student_id:", order.student_id)
            return {
              ...order,
              user_profiles: { name: "Unknown", email: "N/A" },
            }
          }),
        )

        console.log("[v0] Orders with profiles:", ordersWithProfiles.length)
        setAllOrders(ordersWithProfiles)

        // Calculate total orders and monthly revenue
        const totalOrdersCount = ordersData?.length || 0
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()

        const monthlyOrders =
          ordersData?.filter((order) => {
            const orderDate = new Date(order.created_at)
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
          }) || []

        const monthlyRev = monthlyOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0)

        setStats({
          totalStudents: studentsData?.length || 0,
          totalOrders: totalOrdersCount,
          monthlyRevenue: monthlyRev,
          todayClassesCount: classesData?.length || 0,
          activeClasses: 0,
        })
      }
    } catch (error) {
      console.error("[v0] Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = async () => {
    if (!selectedUserId) {
      alert(language === "zh" ? "请选择一个学员" : "Please select a student")
      return
    }

    try {
      const supabase = createBrowserClient()
      const selectedUser = allRegisteredUsers.find((u) => u.id === selectedUserId)
      
      if (!selectedUser) {
        throw new Error("User not found")
      }

      if (students.some((s) => s.id === selectedUserId)) {
        alert(language === "zh" ? "该学员已添加" : "Student already added")
        return
      }

      // 1. 确保 user_profiles 中 role='student'
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({ role: "student", updated_at: new Date().toISOString() })
        .eq("id", selectedUserId)

      if (profileError) {
        console.error("[v0] Error updating user role:", profileError)
        throw profileError
      }

      // 2. 创建 student_class_balance 记录
      const { error: balanceError } = await supabase
        .from("student_class_balance")
        .upsert({
          student_id: selectedUserId,
          total_classes: 0,
          used_classes: 0,
        }, { onConflict: "student_id" })

      if (balanceError) {
        console.error("[v0] Error creating class balance:", balanceError)
        throw balanceError
      }

      alert(language === "zh" ? "学员添加成功！" : "Student added successfully!")
      setIsAddModalOpen(false)
      setSelectedUserId("")
      await loadDashboardData()
    } catch (error: any) {
      console.error("[v0] Error adding student:", error)
      alert(language === "zh" ? `添加失败：${error.message}` : `Failed to add: ${error.message}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    localStorage.removeItem("adminUser")
    localStorage.removeItem("adminUsername")
    localStorage.removeItem("adminName")
    localStorage.removeItem("adminToken")
    router.push("/admin-login")
  }

  const handleUpdateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const supabase = createBrowserClient()
      const { error } = await supabase.from("booking_inquiries").update({ status: newStatus }).eq("id", inquiryId)

      if (error) throw error

      alert(language === "zh" ? "状态更新成功！" : "Status updated successfully!")
      loadDashboardData()
    } catch (error: any) {
      console.error("[v0] Error updating inquiry status:", error)
      alert(language === "zh" ? `更新失败：${error.message}` : `Failed to update: ${error.message}`)
    }
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student.id)
    const classBalance = student.student_class_balance
    setEditForm({
      total_classes: String(classBalance?.total_classes || 0),
      used_classes: String(classBalance?.used_classes || 0),
    })
  }

  const handleSaveStudent = async (studentId: string) => {
    try {
      const supabase = createBrowserClient()

      const totalClasses = Number.parseInt(editForm.total_classes) || 0
      const usedClasses = Number.parseInt(editForm.used_classes) || 0

      console.log("[v0] Saving class balance:", {
        studentId,
        totalClasses,
        usedClasses,
      })

      // Check if record exists first
      const { data: existing, error: checkError } = await supabase
        .from("student_class_balance")
        .select("id")
        .eq("student_id", studentId)
        .maybeSingle()

      if (checkError) {
        console.error("[v0] Error checking existing balance:", checkError)
      }

      let error
      if (existing) {
        // Update existing record
        console.log("[v0] Updating existing balance record:", existing.id)
        const result = await supabase
          .from("student_class_balance")
          .update({
            total_classes: totalClasses,
            used_classes: usedClasses,
            updated_at: new Date().toISOString(),
          })
          .eq("student_id", studentId)
        error = result.error
      } else {
        // Insert new record
        console.log("[v0] Creating new balance record")
        const result = await supabase.from("student_class_balance").insert({
          student_id: studentId,
          total_classes: totalClasses,
          used_classes: usedClasses,
        })
        error = result.error
      }

      if (error) {
        console.error("[v0] Save error details:", error)
        throw error
      }

      console.log("[v0] Class balance saved successfully")

      alert(language === "zh" ? "保存成功！" : "Saved successfully!")
      setEditingStudent(null)

      await loadDashboardData()
    } catch (error: any) {
      console.error("[v0] Error saving student:", error)
      alert(language === "zh" ? `保存失败：${error.message || "未知错误"}` : `Failed to save: ${error.message || "Unknown error"}`)
    }
  }

  const handleCancelEdit = () => {
    setEditingStudent(null)
    setEditForm({ total_classes: "", used_classes: "" })
  }

  const handleViewOrders = async (studentId: string) => {
    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase
        .from("student_orders")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })

      if (error) throw error

      console.log("[v0] Student orders loaded:", data?.length)
      setStudentOrders(data || [])
      setViewingOrders(studentId)
      setIsOrderModalOpen(true) // Open the modal
    } catch (error) {
      console.error("[v0] Error loading orders:", error)
      alert(language === "zh" ? "加载订单失败" : "Failed to load orders")
    }
  }

  const handleCloseOrders = () => {
    setViewingOrders(null)
    setStudentOrders([])
    setIsOrderModalOpen(false)
  }

  const handleOpenOrderDetail = (order: any) => {
    setSelectedOrder(order)
    setOrderEditStatus(order.status || "pending")
    setOrderEditStudentId(order.student_id || "")
    setIsOrderDetailOpen(true)
  }

  const handleCloseOrderDetail = () => {
    setIsOrderDetailOpen(false)
    setSelectedOrder(null)
    setOrderEditStatus("")
    setOrderEditStudentId("")
  }

  const handleSaveOrder = async () => {
    if (!selectedOrder) return
    
    console.log("[v0] handleSaveOrder called:", {
      currentStatus: selectedOrder.status,
      newStatus: orderEditStatus,
      studentId: selectedOrder.student_id,
      orderEditStudentId
    })
    
    setSavingOrder(true)
    try {
      const supabase = createBrowserClient()
      
      const updateData: any = {
        status: orderEditStatus,
        updated_at: new Date().toISOString(),
      }
      
      let targetStudentId = orderEditStudentId || selectedOrder.student_id
      if (orderEditStudentId && orderEditStudentId !== selectedOrder.student_id) {
        updateData.student_id = orderEditStudentId
      }
      
      console.log("[v0] Updating order with data:", updateData)
      
      const { error } = await supabase
        .from("student_orders")
        .update(updateData)
        .eq("id", selectedOrder.id)
      
      if (error) throw error

      // If status changed to paid, add classes to student's balance
      const isChangingToPaid = orderEditStatus === "paid" && selectedOrder.status !== "paid"
      console.log("[v0] Is changing to paid:", isChangingToPaid, "targetStudentId:", targetStudentId)
      
      if (isChangingToPaid && targetStudentId) {
        const classesPurchased = selectedOrder.classes_purchased || 0
        console.log("[v0] Order marked as paid, adding classes:", classesPurchased, "to student:", targetStudentId)

        // Ensure we have the correct user_profiles.id
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("id")
          .or(`id.eq.${targetStudentId},user_id.eq.${targetStudentId}`)
          .maybeSingle()

        console.log("[v0] Profile lookup result:", { profile, profileError })

        const correctStudentId = profile?.id || targetStudentId
        console.log("[v0] Using student ID for balance update:", correctStudentId)

        // Check if student has existing balance record
        const { data: currentBalance, error: balanceQueryError } = await supabase
          .from("student_class_balance")
          .select("total_classes, used_classes")
          .eq("student_id", correctStudentId)
          .maybeSingle()

        console.log("[v0] Current balance:", { currentBalance, error: balanceQueryError })

        if (currentBalance) {
          const newTotal = currentBalance.total_classes + classesPurchased
          console.log("[v0] Updating balance from", currentBalance.total_classes, "to", newTotal)
          
          const { error: balanceError } = await supabase
            .from("student_class_balance")
            .update({
              total_classes: newTotal,
              updated_at: new Date().toISOString()
            })
            .eq("student_id", correctStudentId)
          
          if (balanceError) {
            console.error("[v0] Error updating balance:", balanceError)
            alert(language === "zh" ? `课时更新失败：${balanceError.message}` : `Failed to update balance: ${balanceError.message}`)
          } else {
            console.log("[v0] Balance updated successfully to", newTotal)
          }
        } else {
          console.log("[v0] No existing balance, creating new record with", classesPurchased, "classes")
          
          const { error: insertError } = await supabase
            .from("student_class_balance")
            .insert({
              student_id: correctStudentId,
              total_classes: classesPurchased,
              used_classes: 0
            })
          
          if (insertError) {
            console.error("[v0] Error creating balance:", insertError)
            alert(language === "zh" ? `课时创建失败：${insertError.message}` : `Failed to create balance: ${insertError.message}`)
          } else {
            console.log("[v0] Balance created successfully")
          }
        }
      }
      
      alert(language === "zh" ? "订单更新成功！" : "Order updated successfully!")
      handleCloseOrderDetail()
      await loadDashboardData()
    } catch (error: any) {
      console.error("[v0] Error saving order:", error)
      alert(language === "zh" ? `更新失败：${error.message}` : `Failed to update: ${error.message}`)
    } finally {
      setSavingOrder(false)
    }
  }

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (
      !confirm(
        language === "zh"
          ? `确定要删除学生 "${studentName}" 吗？这将删除该学生的所有数据。`
          : `Are you sure you want to delete student "${studentName}"? This will delete all their data.`,
      )
    ) {
      return
    }

    try {
      const supabase = createBrowserClient()

      // Delete related records first
      await supabase.from("student_class_balance").delete().eq("student_id", studentId)
      await supabase.from("student_orders").delete().eq("student_id", studentId)
      await supabase.from("user_course_enrollments").delete().eq("user_id", studentId)
      await supabase.from("class_schedules").delete().eq("student_id", studentId)

      // Delete the user profile
      const { error } = await supabase.from("user_profiles").delete().eq("id", studentId)

      if (error) throw error

      alert(language === "zh" ? "删除成功！" : "Deleted successfully!")
      await loadDashboardData()
    } catch (error) {
      console.error("[v0] Error deleting student:", error)
      alert(language === "zh" ? "删除失败" : "Failed to delete")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === "zh" ? "管理员中心" : "Admin Dashboard"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {language === "zh" ? "管理员工作台" : "Administrator Workspace"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="gap-2 bg-orange text-white hover:bg-orange/90"
                onClick={() => router.push("/admin/schedule")}
              >
                <CalendarCheck className="w-4 h-4" />
                {language === "zh" ? "排课管理" : "Schedule Management"}
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                {language === "zh" ? "返回首页" : "Home"}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                {language === "zh" ? "退出" : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{language === "zh" ? "总学员" : "Total Students"}</p>
                  <p className="text-3xl font-bold text-blue">{stats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{language === "zh" ? "总订单" : "Total Orders"}</p>
                  <p className="text-3xl font-bold text-orange">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-orange" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{language === "zh" ? "本月营收" : "Monthly Revenue"}</p>
                  <p className="text-3xl font-bold text-green-600">${stats.monthlyRevenue}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{language === "zh" ? "今日课程" : "Today's Classes"}</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.todayClassesCount}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange" />
              {language === "zh" ? "试课预约咨询" : "Trial Booking Inquiries"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 py-8">{language === "zh" ? "加载中..." : "Loading..."}</p>
            ) : bookingInquiries.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {language === "zh" ? "暂无预约咨询" : "No booking inquiries yet"}
              </p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {bookingInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-orange/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900">{inquiry.name}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              inquiry.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : inquiry.status === "contacted"
                                  ? "bg-blue/10 text-blue"
                                  : inquiry.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {inquiry.status === "pending"
                              ? language === "zh"
                                ? "待处理"
                                : "Pending"
                              : inquiry.status === "contacted"
                                ? language === "zh"
                                  ? "已联系"
                                  : "Contacted"
                                : inquiry.status === "completed"
                                  ? language === "zh"
                                    ? "已完成"
                                    : "Completed"
                                  : inquiry.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">{language === "zh" ? "邮箱：" : "Email: "}</span>
                            {inquiry.email}
                          </p>
                          <p>
                            <span className="font-medium">{language === "zh" ? "电话：" : "Phone: "}</span>
                            {inquiry.phone}
                          </p>
                          {inquiry.course_id && inquiry.courses && (
                            <p>
                              <span className="font-medium">{language === "zh" ? "课程：" : "Course: "}</span>
                              {language === "zh" ? inquiry.courses.title_zh : inquiry.courses.title_en}
                            </p>
                          )}
                          {inquiry.message && (
                            <p className="mt-2">
                              <span className="font-medium">{language === "zh" ? "留言：" : "Message: "}</span>
                              {inquiry.message}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {language === "zh" ? "提交时间：" : "Submitted: "}
                            {format(new Date(inquiry.created_at), "yyyy-MM-dd HH:mm")}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {inquiry.status === "pending" && (
                          <Button
                            size="sm"
                            className="bg-blue hover:bg-blue/90 text-white"
                            onClick={() => handleUpdateInquiryStatus(inquiry.id, "contacted")}
                          >
                            {language === "zh" ? "标记已联系" : "Mark Contacted"}
                          </Button>
                        )}
                        {inquiry.status === "contacted" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleUpdateInquiryStatus(inquiry.id, "completed")}
                          >
                            {language === "zh" ? "标记完成" : "Mark Completed"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue" />
              {language === "zh" ? "最近订单" : "Recent Orders"}
            </CardTitle>
            <p className="text-sm text-gray-500">
              {language === "zh" ? "点击订单可查看详情并修改状态" : "Click on an order to view details and edit status"}
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 py-8">{language === "zh" ? "加载中..." : "Loading..."}</p>
            ) : allOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">{language === "zh" ? "暂无订单记录" : "No orders yet"}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        {language === "zh" ? "学生姓名" : "Student Name"}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        {language === "zh" ? "订单号" : "Order Number"}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        {language === "zh" ? "套餐名称" : "Package"}
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                        {language === "zh" ? "课时数" : "Classes"}
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                        {language === "zh" ? "金额" : "Amount"}
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                        {language === "zh" ? "状态" : "Status"}
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                        {language === "zh" ? "创建时间" : "Created"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.slice(0, 10).map((order) => (
                      <tr 
                        key={order.id} 
                        className="border-b border-gray-100 hover:bg-blue/5 cursor-pointer transition-colors"
                        onClick={() => handleOpenOrderDetail(order)}
                      >
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{order.user_profiles?.name || (language === "zh" ? "未分配" : "Unassigned")}</div>
                            <div className="text-sm text-gray-500">{order.user_profiles?.email || "-"}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs text-gray-600">{order.order_number}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{order.package_name}</td>
                        <td className="py-3 px-4 text-center text-sm font-medium text-gray-900">
                          {order.classes_purchased}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900">¥{order.amount}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded ${
                              order.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : order.status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status === "paid"
                              ? language === "zh"
                                ? "已支付"
                                : "Paid"
                              : order.status === "pending"
                                ? language === "zh"
                                  ? "待支付"
                                  : "Pending"
                                : order.status === "cancelled"
                                  ? language === "zh"
                                    ? "已取消"
                                    : "Cancelled"
                                  : order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-xs text-gray-500">
                          {order.created_at ? format(new Date(order.created_at), "yyyy-MM-dd HH:mm") : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue" />
                {language === "zh" ? "学员列表" : "Student List"}
              </CardTitle>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-orange hover:bg-orange/90 text-white gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                {language === "zh" ? "添加学员" : "Add Student"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 py-8">{language === "zh" ? "加载中..." : "Loading..."}</p>
            ) : students.length === 0 ? (
              <p className="text-center text-gray-500 py-8">{language === "zh" ? "暂无学员" : "No students yet"}</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {students.map((student) => {
                  const classBalance = student.student_class_balance
                  const totalClasses = classBalance?.total_classes || 0
                  const usedClasses = classBalance?.used_classes || 0
                  const remainingClasses = classBalance?.remaining_classes || 0

                  return (
                    <div
                      key={student.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-orange/50 transition-colors"
                    >
                      {editingStudent === student.id ? (
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900">{student.name}</h3>
                              <p className="text-sm text-gray-600">{student.email}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveStudent(student.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">{language === "zh" ? "总课时" : "Total Classes"}</Label>
                              <Input
                                type="text"
                                value={editForm.total_classes}
                                onChange={(e) => {
                                  const value = e.target.value
                                  // Only allow numbers
                                  if (value === "" || /^\d+$/.test(value)) {
                                    setEditForm({ ...editForm, total_classes: value })
                                  }
                                }}
                                placeholder="0"
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">{language === "zh" ? "已用课时" : "Used Classes"}</Label>
                              <Input
                                type="text"
                                value={editForm.used_classes}
                                onChange={(e) => {
                                  const value = e.target.value
                                  // Only allow numbers
                                  if (value === "" || /^\d+$/.test(value)) {
                                    setEditForm({ ...editForm, used_classes: value })
                                  }
                                }}
                                placeholder="0"
                                className="h-8"
                              />
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {language === "zh" ? "剩余课时：" : "Remaining: "}
                            <span className="font-semibold">
                              {(Number.parseInt(editForm.total_classes) || 0) -
                                (Number.parseInt(editForm.used_classes) || 0)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900">{student.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{student.email}</p>
                              {student.phone && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {language === "zh" ? "电话：" : "Phone: "}
                                  {student.phone}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewOrders(student.id)}
                                className="gap-1"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                <span className="hidden sm:inline">{language === "zh" ? "查看订单" : "Orders"}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditStudent(student)}
                                className="gap-1"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span className="hidden sm:inline">{language === "zh" ? "编辑" : "Edit"}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteStudent(student.id, student.name)}
                                className="gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span className="hidden sm:inline">{language === "zh" ? "删除" : "Delete"}</span>
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">{language === "zh" ? "总课时：" : "Total: "}</span>
                              <span className="font-semibold">{totalClasses}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">{language === "zh" ? "已用：" : "Used: "}</span>
                              <span className="font-semibold">{usedClasses}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">{language === "zh" ? "剩余：" : "Remaining: "}</span>
                              <span className="font-semibold text-green-600">{remainingClasses}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">{language === "zh" ? "订单数：" : "Orders: "}</span>
                              <span className="font-semibold">{student.total_orders || 0}</span>
                            </div>
                          </div>
                          {student.total_spent ? (
                            <div className="mt-2 text-xs text-gray-500">
                              {language === "zh" ? "总消费：¥" : "Total Spent: ¥"}
                              {student.total_spent.toFixed(2)}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange" />
              {language === "zh" ? "今日课程" : "Today's Classes"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 py-8">{language === "zh" ? "加载中..." : "Loading..."}</p>
            ) : todayClasses.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {language === "zh" ? "今天没有课程" : "No classes today"}
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {todayClasses.map((classItem) => (
                  <div key={classItem.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-blue">
                            {classItem.start_time} - {classItem.end_time}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              classItem.status === "scheduled"
                                ? "bg-blue/10 text-blue"
                                : classItem.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {classItem.status === "scheduled"
                              ? language === "zh"
                                ? "待上课"
                                : "Scheduled"
                              : classItem.status === "completed"
                                ? language === "zh"
                                  ? "已完成"
                                  : "Completed"
                                : classItem.status === "cancelled"
                                  ? language === "zh"
                                    ? "已取消"
                                    : "Cancelled"
                                  : classItem.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900">
                          {language === "zh" ? classItem.courses?.title_zh : classItem.courses?.title_en}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {language === "zh" ? "学员：" : "Student: "}
                          {classItem.student_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {language === "zh" ? "教师：" : "Teacher: "}
                          {classItem.teacher_name || (language === "zh" ? "待分配" : "TBA")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">{language === "zh" ? "添加学员" : "Add Student"}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  {language === "zh" ? "选择已注册用户" : "Select Registered User"}
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                >
                  <option value="">{language === "zh" ? "请选择用户" : "Select a user"}</option>
                  {allRegisteredUsers
                    .filter((user) => !students.some((s) => s.id === user.id))
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email}) {user.role === 'student' ? '' : `- ${language === "zh" ? "新用户" : "New"}`}
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {language === "zh" 
                    ? "将选中的用户添加到学员列表，并设置其角色为学员" 
                    : "Add the selected user to student list and set their role as student"}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setSelectedUserId("")
                }}
                className="flex-1"
              >
                {language === "zh" ? "取消" : "Cancel"}
              </Button>
              <Button onClick={handleAddStudent} className="flex-1 bg-orange hover:bg-orange/90 text-white">
                {language === "zh" ? "添加" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isOrderModalOpen && ( // Use isOrderModalOpen
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[80vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{language === "zh" ? "学生订单" : "Student Orders"}</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleCloseOrders}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {studentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {language === "zh" ? "暂无订单记录" : "No orders found"}
                </div>
              ) : (
                <div className="space-y-4">
                  {studentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-900">{order.order_number}</div>
                          <div className="text-sm text-gray-600 mt-1">{order.package_name}</div>
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            order.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status === "paid"
                            ? language === "zh"
                              ? "已支付"
                              : "Paid"
                            : order.status === "pending"
                              ? language === "zh"
                                ? "待支付"
                                : "Pending"
                              : language === "zh"
                                ? "已取消"
                                : "Cancelled"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">{language === "zh" ? "课程数量" : "Classes"}</div>
                          <div className="font-medium">{order.classes_purchased}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">{language === "zh" ? "支付金额" : "Amount"}</div>
                          <div className="font-medium">¥{order.amount}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-gray-500">{language === "zh" ? "购买时间" : "Purchase Date"}</div>
                          <div className="font-medium">
                            {new Date(order.created_at).toLocaleString(language === "zh" ? "zh-CN" : "en-US", {
                              timeZone: "Asia/Shanghai",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {isOrderDetailOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{language === "zh" ? "订单详情" : "Order Details"}</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleCloseOrderDetail}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">{language === "zh" ? "订单号" : "Order Number"}</div>
                  <div className="font-mono font-medium">{selectedOrder.order_number}</div>
                </div>
                <div>
                  <div className="text-gray-500">{language === "zh" ? "套餐名称" : "Package"}</div>
                  <div className="font-medium">{selectedOrder.package_name}</div>
                </div>
                <div>
                  <div className="text-gray-500">{language === "zh" ? "课时数" : "Classes"}</div>
                  <div className="font-medium">{selectedOrder.classes_purchased}</div>
                </div>
                <div>
                  <div className="text-gray-500">{language === "zh" ? "金额" : "Amount"}</div>
                  <div className="font-medium text-orange">¥{Number(selectedOrder.amount || 0).toLocaleString()}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-500">{language === "zh" ? "创建时间" : "Created At"}</div>
                  <div className="font-medium">
                    {selectedOrder.created_at ? format(new Date(selectedOrder.created_at), "yyyy-MM-dd HH:mm") : "N/A"}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {language === "zh" ? "订单状态" : "Order Status"}
                  </label>
                  <select
                    value={orderEditStatus}
                    onChange={(e) => setOrderEditStatus(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  >
                    <option value="pending">{language === "zh" ? "待支付" : "Pending"}</option>
                    <option value="paid">{language === "zh" ? "已支付" : "Paid"}</option>
                    <option value="cancelled">{language === "zh" ? "已取消" : "Cancelled"}</option>
                    <option value="refunded">{language === "zh" ? "已退款" : "Refunded"}</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {language === "zh" ? "分配给学生" : "Assign to Student"}
                  </label>
                  <select
                    value={orderEditStudentId}
                    onChange={(e) => setOrderEditStudentId(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  >
                    <option value="">{language === "zh" ? "未分配" : "Unassigned"}</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCloseOrderDetail}
                  className="flex-1"
                  disabled={savingOrder}
                >
                  {language === "zh" ? "取消" : "Cancel"}
                </Button>
                <Button
                  onClick={handleSaveOrder}
                  className="flex-1 bg-orange hover:bg-orange/90 text-white"
                  disabled={savingOrder}
                >
                  {savingOrder 
                    ? (language === "zh" ? "保存中..." : "Saving...") 
                    : (language === "zh" ? "保存修改" : "Save Changes")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

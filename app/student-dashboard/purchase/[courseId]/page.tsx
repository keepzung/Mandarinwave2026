"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Check, Clock, Calendar, ShoppingCart, ArrowLeft, BookOpen } from "lucide-react"

interface Course {
  id: string
  title_zh: string
  title_en: string
  description_zh: string
  description_en: string
}

interface CoursePackage {
  id: string
  name_zh: string
  name_en: string
  description_zh: string
  description_en: string
  class_count: number
  price: number
  validity_days: number
  price_per_class: number
  discount: string
  popular?: boolean
}

export default function CoursePackagePage() {
  const { language } = useLanguage()
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [packages, setPackages] = useState<CoursePackage[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    loadCourseAndPackages()
  }, [courseId])

  const loadCourseAndPackages = async () => {
    const supabase = createBrowserClient()

    try {
      // Load course details
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single()

      if (courseError) {
        console.error("[v0] Error loading course:", courseError)
      } else {
        setCourse(courseData)
      }

      setPackages([
        {
          id: "pkg-trial",
          name_zh: "体验课",
          name_en: "Trial Lesson",
          description_zh: "1节免费试课",
          description_en: "1 free trial lesson",
          class_count: 1,
          price: 0,
          validity_days: 365,
          price_per_class: 0,
          discount: "",
        },
        {
          id: "pkg-10",
          name_zh: "10课时套餐",
          name_en: "10 Classes Package",
          description_zh: "10节课，有效期15周",
          description_en: "10 classes, valid for 15 weeks",
          class_count: 10,
          price: 2800,
          validity_days: 105,
          price_per_class: 280,
          discount: "",
        },
        {
          id: "pkg-35",
          name_zh: "35课时套餐",
          name_en: "35 Classes Package",
          description_zh: "35节课，有效期52周",
          description_en: "35 classes, valid for 52 weeks",
          class_count: 35,
          price: 8330,
          validity_days: 364,
          price_per_class: 238,
          discount: "15%",
          popular: true,
        },
        {
          id: "pkg-65",
          name_zh: "65课时套餐",
          name_en: "65 Classes Package",
          description_zh: "65节课，有效期80周",
          description_en: "65 classes, valid for 80 weeks",
          class_count: 65,
          price: 13650,
          validity_days: 560,
          price_per_class: 210,
          discount: "25%",
        },
        {
          id: "pkg-95",
          name_zh: "95课时套餐",
          name_en: "95 Classes Package",
          description_zh: "95节课，有效期104周",
          description_en: "95 classes, valid for 104 weeks",
          class_count: 95,
          price: 17290,
          validity_days: 728,
          price_per_class: 182,
          discount: "35%",
        },
        {
          id: "pkg-125",
          name_zh: "125课时套餐",
          name_en: "125 Classes Package",
          description_zh: "125节课，有效期104周",
          description_en: "125 classes, valid for 104 weeks",
          class_count: 125,
          price: 21000,
          validity_days: 728,
          price_per_class: 168,
          discount: "40%",
        },
      ])
    } catch (err) {
      console.error("[v0] Exception loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (packageId: string, classCount: number, validityDays: number, price: number) => {
    setPurchasing(packageId)

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

      const pkg = packages.find((p) => p.id === packageId)
      if (!pkg) return

      const courseName = course ? (language === "zh" ? course.title_zh : course.title_en) : ""
      const packageName = language === "zh" ? pkg.name_zh : pkg.name_en

      console.log("[v0] Creating pending order before payment...")

      const { data: userProfile, error: profileError } = await supabase
        .from("user_profiles")
        .select("id, user_id, name, email")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle()

      if (profileError || !userProfile) {
        console.error("[v0] User profile not found:", profileError)
        alert(language === "zh" ? "用户信息未找到，请重新登录" : "User profile not found, please login again")
        setPurchasing(null)
        return
      }

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

      // Create order with "pending" status
      const { data: orderData, error: orderError } = await supabase
        .from("student_orders")
        .insert({
          student_id: userProfile.id,
          order_number: orderNumber,
          package_name: packageName,
          package_id: packageId,
          course_id: courseId,
          classes_purchased: classCount,
          amount: price,
          validity_days: validityDays,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      console.log("[v0] Pending order created:", { orderData, orderError, orderNumber })

      if (orderError) {
        console.error("[v0] Order creation error:", orderError)
        alert(
          language === "zh"
            ? `购买失败：${orderError.message || "未知错误"}`
            : `Purchase failed: ${orderError.message || "Unknown error"}`,
        )
        setPurchasing(null)
        return
      }

      // Build payment URL with query parameters including orderNumber
      const paymentUrl = new URL("/payment", window.location.origin)
      paymentUrl.searchParams.set("courseId", courseId)
      paymentUrl.searchParams.set("courseName", courseName)
      paymentUrl.searchParams.set("packageId", packageId)
      paymentUrl.searchParams.set("packageName", packageName)
      paymentUrl.searchParams.set("classCount", classCount.toString())
      paymentUrl.searchParams.set("price", price.toString())
      paymentUrl.searchParams.set("validityDays", validityDays.toString())
      paymentUrl.searchParams.set("orderNumber", orderNumber) // Pass order number to payment page

      console.log("[v0] Navigating to payment:", paymentUrl.toString())
      router.push(paymentUrl.toString())
    } catch (error: any) {
      console.error("[v0] Error in purchase flow:", error)
      alert(
        language === "zh"
          ? `购买失败：${error.message || "未知错误"}`
          : `Purchase failed: ${error.message || "Unknown error"}`,
      )
    } finally {
      setPurchasing(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/5 via-white to-orange/5">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/student-dashboard/purchase")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {course
                    ? language === "zh"
                      ? course.title_zh
                      : course.title_en
                    : language === "zh"
                      ? "选择套餐"
                      : "Choose Package"}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {language === "zh" ? "选择适合您的课程套餐" : "Select the package that suits you"}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push("/student-dashboard")}>
              {language === "zh" ? "返回首页" : "Home"}
            </Button>
          </div>
        </div>
      </div>

      {/* Course Info */}
      {course && (
        <div className="bg-blue/5 border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === "zh" ? course.title_zh : course.title_en}
                </h2>
                <p className="text-sm text-gray-600">
                  {language === "zh" ? course.description_zh : course.description_en}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Packages */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`border-2 hover:border-blue transition-colors relative ${pkg.popular ? "border-orange shadow-lg" : ""}`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {language === "zh" ? "最受欢迎" : "Most Popular"}
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingCart className="w-8 h-8 text-blue flex-shrink-0" />
                  </div>
                </div>
                <CardTitle className="text-xl">{language === "zh" ? pkg.name_zh : pkg.name_en}</CardTitle>
                {pkg.discount && (
                  <div className="inline-block bg-orange/10 text-orange text-sm font-semibold px-3 py-1 rounded-full mt-2">
                    {language === "zh" ? `优惠 ${pkg.discount}` : `${pkg.discount} OFF`}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  {pkg.price === 0 ? (
                    <div className="text-4xl font-bold text-gray-900 mb-1">{language === "zh" ? "免费" : "Free"}</div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold text-gray-900 mb-1">¥{pkg.price.toLocaleString()}</div>
                      {pkg.price_per_class > 0 && (
                        <div className="text-sm text-gray-500">
                          ¥{pkg.price_per_class}/{language === "zh" ? "节" : "class"}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>
                      {pkg.class_count} {language === "zh" ? "节课" : "classes"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue flex-shrink-0" />
                    <span>{language === "zh" ? pkg.description_zh.split("，")[1] : pkg.description_en.split(", ")[1]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-orange flex-shrink-0" />
                    <span>{language === "zh" ? "每节课45分钟" : "45 min/class"}</span>
                  </div>
                </div>

                <Button
                  className={`w-full ${pkg.popular ? "bg-orange hover:bg-orange/90" : "bg-blue hover:bg-blue/90"}`}
                  disabled={purchasing === pkg.id}
                  onClick={() => handlePurchase(pkg.id, pkg.class_count, pkg.validity_days, pkg.price)}
                >
                  {purchasing === pkg.id
                    ? language === "zh"
                      ? "处理中..."
                      : "Processing..."
                    : pkg.price === 0
                      ? language === "zh"
                        ? "预约试课"
                        : "Book Trial"
                      : language === "zh"
                        ? "立即购买"
                        : "Buy Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

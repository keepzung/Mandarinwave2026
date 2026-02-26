"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Suspense } from "react"
import { ArrowLeft, Clock, Package, Calendar, ShoppingCart, AlertCircle, LogIn, X } from "lucide-react"
import { PayPalCheckout } from "@/components/paypal-checkout"
import Image from "next/image"

interface PaymentInfo {
  courseId: string
  courseName: string
  packageId: string
  packageName: string
  classCount: number
  price: number
  validityDays: number
}

function PaymentContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [initialized, setInitialized] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [orderNumber, setOrderNumber] = useState("")
  const [showCheckout, setShowCheckout] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showWechatModal, setShowWechatModal] = useState(false)
  const [showAlipayModal, setShowAlipayModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"paypal" | "wechat" | "alipay" | null>(null)
  const [paypalEnabled, setPaypalEnabled] = useState(false)

  useEffect(() => {
    // Check if PayPal is configured
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    setPaypalEnabled(!!paypalClientId && paypalClientId.length > 0)
  }, [])

  useEffect(() => {
    if (initialized) return

    const courseId = searchParams.get("courseId") || ""
    const courseName = searchParams.get("courseName") || searchParams.get("packageName") || ""
    const packageId = searchParams.get("packageId") || ""
    const packageName = searchParams.get("packageName") || ""
    const classCount = searchParams.get("classCount")
    const price = searchParams.get("price")
    const validityDays = searchParams.get("validityDays")
    const existingOrderNumber = searchParams.get("orderNumber")

    if (!classCount || !price) {
      router.replace("/student-dashboard/purchase")
      return
    }

    setPaymentInfo({
      courseId: courseId || "",
      courseName: courseName || packageName || "",
      packageId: packageId || "",
      packageName: packageName || "",
      classCount: Number.parseInt(classCount || "0"),
      price: Number.parseFloat(price || "0"),
      validityDays: Number.parseInt(validityDays || "365"),
    })

    setOrderNumber(
      existingOrderNumber || `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    )

    checkLoginStatus()

    setInitialized(true)
  }, [initialized, searchParams, router])

  useEffect(() => {
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!paypalClientId || document.querySelector('script[src*="paypal.com/sdk"]')) return

    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD&disable-funding=credit,card`
    script.async = true
    script.id = "paypal-sdk-preload"
    document.head.appendChild(script)

    return () => {
      const existingScript = document.getElementById("paypal-sdk-preload")
      if (existingScript) existingScript.remove()
    }
  }, [])

  const checkLoginStatus = async () => {
    const supabase = createBrowserClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setIsLoggedIn(!!user)
    setCurrentUserId(user?.id || null)
  }

  // Handler for manual payment methods (WeChat, Alipay)
  // Note: This does NOT verify payment - user must contact admin to confirm
  const handleManualPaymentComplete = () => {
    const confirmed = confirm(
      language === "zh"
        ? "重要提示：点击确认后，您的订单将被标记为【待确认】状态。请联系客服人员确认付款后，课时才会到账。是否继续？"
        : "Important: After clicking confirm, your order will be marked as 'pending confirmation'. Please contact customer service to verify your payment. Your class hours will only be credited after verification. Continue?"
    )
    
    if (!confirmed) return
    
    // Update order status to "pending_confirmation" instead of completing it
    const updateOrderStatus = async () => {
      try {
        const supabase = createBrowserClient()
        await supabase
          .from("student_orders")
          .update({
            status: "pending_confirmation",
            updated_at: new Date().toISOString(),
          })
          .eq("order_number", orderNumber)
      } catch (err) {
        console.error("[v0] Failed to update order status:", err)
      }
    }
    
    updateOrderStatus()
    
    alert(
      language === "zh"
        ? "订单已提交！请联系客服人员确认付款，确认后课时将自动到账。"
        : "Order submitted! Please contact customer service to verify your payment. Your class hours will be credited after verification."
    )
    router.push("/student-dashboard")
  }

  const handlePaymentComplete = async () => {
    if (!paymentInfo) return

    try {
      const supabase = createBrowserClient()
      
      // First refresh the session to ensure we have a valid token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !sessionData.session) {
        console.error("[v0] Session error:", sessionError)
        alert(language === "zh" ? "会话已过期，请重新登录" : "Session expired, please login again")
        router.push(`/student-login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)
        return
      }

      const user = sessionData.session.user
      console.log("[v0] Payment completed, updating order:", { orderNumber, userId: user.id })

      // Use limit(1) to handle cases where duplicate profiles may exist
      // Note: We need 'id' (user_profiles.id) for student_id, not 'user_id' (auth.users.id)
      const { data: userProfiles, error: profileError } = await supabase
        .from("user_profiles")
        .select("id, user_id, name, email")
        .eq("user_id", user.id)
        .limit(1)

      const userProfile = userProfiles?.[0] || null
      console.log("[v0] User profile query result:", { userProfile, profileError, userId: user.id })

      // If profile not found, try to create one from user metadata
      let studentId = userProfile?.id || null
      
      if (!userProfile && !profileError) {
        console.log("[v0] Profile not found, creating from auth user metadata")
        const { data: newProfile, error: insertError } = await supabase
          .from("user_profiles")
          .insert({
            user_id: user.id,
            name: user.user_metadata?.name || user.email?.split("@")[0] || "Student",
            email: user.email || "",
            phone: user.user_metadata?.phone || "",
            role: "student",
            created_at: new Date().toISOString(),
          })
          .select("id")
          .single()

        if (insertError || !newProfile) {
          console.error("[v0] Failed to create profile:", insertError)
          alert(language === "zh" ? "用户信息创建失败，请联系客服" : "Failed to create user profile, please contact support")
          return
        }
        
        studentId = newProfile.id
      } else if (profileError) {
        console.error("[v0] User profile query error:", profileError)
        alert(language === "zh" ? "用户信息查询失败，请重新登录" : "Failed to query user profile, please login again")
        return
      }
      
      // Use user_profiles.id (not auth.users.id) for student_id in related tables
      // student_orders.student_id and student_class_balance.student_id reference user_profiles.id
      if (!studentId) {
        console.error("[v0] Could not get user_profiles.id")
        alert(language === "zh" ? "用户信息获取失败，请重新登录" : "Failed to get user profile, please login again")
        return
      }

      console.log("[v0] Updating order status to paid:", orderNumber)

      const { data: updateData, error: updateError } = await supabase
        .from("student_orders")
        .update({
          status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("order_number", orderNumber)
        .select()

      console.log("[v0] Order update result:", { updateData, updateError })

      if (updateError) {
        console.error("[v0] Order update error:", updateError)
        throw new Error(language === "zh" ? "订单更新失败" : "Failed to update order")
      }

      const { data: existingBalance } = await supabase
        .from("student_class_balance")
        .select("*")
        .eq("student_id", studentId)
        .maybeSingle()

      if (existingBalance) {
        const { error: balanceUpdateError } = await supabase
          .from("student_class_balance")
          .update({
            total_classes: existingBalance.total_classes + paymentInfo.classCount,
            remaining_classes: existingBalance.remaining_classes + paymentInfo.classCount,
            updated_at: new Date().toISOString(),
          })
          .eq("student_id", studentId)

        if (balanceUpdateError) {
          console.error("[v0] Balance update error:", balanceUpdateError)
          throw new Error(language === "zh" ? "课时更新失败" : "Failed to update class balance")
        }
      } else {
        const { error: insertError } = await supabase.from("student_class_balance").insert({
          student_id: studentId,
          total_classes: paymentInfo.classCount,
          used_classes: 0,
          remaining_classes: paymentInfo.classCount,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (insertError) {
          console.error("[v0] Balance insert error:", insertError)
          throw new Error(language === "zh" ? "课时创建失败" : "Failed to create class balance")
        }
      }

      alert(
        language === "zh"
          ? `支付成功！\n\n订单号：${orderNumber}\n课程数量：${paymentInfo.classCount} 节课\n支付金额：¥${paymentInfo.price}\n\n课时已添加到您的账户。`
          : `Payment successful!\n\nOrder Number: ${orderNumber}\nClasses: ${paymentInfo.classCount}\nAmount: ¥${paymentInfo.price}\n\nClasses have been added to your account.`,
      )

      router.push("/student-dashboard")
    } catch (error: any) {
      console.error("[v0] Payment completion error:", error)
      alert(
        language === "zh"
          ? `订单处理失败：${error.message || "未知错误"}\n请联系客服。`
          : `Order processing failed: ${error.message || "Unknown error"}\nPlease contact support.`,
      )
    }
  }

  if (!initialized || !paymentInfo) {
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
              <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {language === "zh" ? "返回上一页" : "Go Back"}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {language === "zh" ? "确认支付" : "Confirm Payment"}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {language === "zh" ? "选择支付方式完成支付" : "Select payment method to complete"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {!isLoggedIn && (
            <Card className="mb-6 border-orange/50 bg-orange/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <LogIn className="w-5 h-5 text-orange" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {language === "zh" ? "登录提示" : "Login Required"}
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      {language === "zh"
                        ? "您需要登录才能完成购买。支付完成后，课时将自动添加到您的账户。"
                        : "You need to login to complete your purchase. After payment, classes will be automatically added to your account."}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/student-login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`,
                        )
                      }
                    >
                      {language === "zh" ? "立即登录" : "Login Now"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    {language === "zh" ? "订单详情" : "Order Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between pb-4 border-b">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{paymentInfo.courseName}</h3>
                      <p className="text-sm text-gray-600">{paymentInfo.packageName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">¥{paymentInfo.price}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue/10 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">{language === "zh" ? "课程数量" : "Classes"}</div>
                        <div className="font-semibold">
                          {paymentInfo.classCount} {language === "zh" ? "节课" : "classes"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-orange" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">{language === "zh" ? "有效期" : "Validity"}</div>
                        <div className="font-semibold">
                          {paymentInfo.validityDays} {language === "zh" ? "天" : "days"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">{language === "zh" ? "课时时长" : "Duration"}</div>
                        <div className="font-semibold">{language === "zh" ? "45分钟/节" : "45 min/class"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue/5 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-700">
                        {language === "zh"
                          ? "购买后课时将自动添加到您的账户，您可以在学生面板中查看和使用。"
                          : "After purchase, classes will be automatically added to your account and can be viewed in your student dashboard."}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!showCheckout ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{language === "zh" ? "选择支付方式" : "Select Payment Method"}</span>
                      <Button variant="outline" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        {language === "zh" ? "返回上一页" : "Go Back"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* WeChat Pay */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("wechat")}
                      className={`w-full p-4 border-2 rounded-lg transition-all ${
                        selectedPaymentMethod === "wechat"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.406-.032zm-2.464 3.206c.536 0 .97.44.97.983a.976.976 0 0 1-.97.983.976.976 0 0 1-.97-.983c0-.542.434-.983.97-.983zm4.802 0c.536 0 .97.44.97.983a.976.976 0 0 1-.97.983.976.976 0 0 1-.97-.983c0-.542.434-.983.97-.983z"/>
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-900">{language === "zh" ? "微信支付" : "WeChat Pay"}</div>
                          <div className="text-sm text-gray-500">
                            {language === "zh" ? "使用微信扫码支付" : "Scan QR code with WeChat"}
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          selectedPaymentMethod === "wechat" ? "border-green-500 bg-green-500" : "border-gray-300"
                        }`}>
                          {selectedPaymentMethod === "wechat" && (
                            <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Alipay */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("alipay")}
                      className={`w-full p-4 border-2 rounded-lg transition-all ${
                        selectedPaymentMethod === "alipay"
                          ? "border-blue bg-blue/5"
                          : "border-gray-200 hover:border-blue/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#1677FF] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xl">支</span>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-900">{language === "zh" ? "支付宝" : "Alipay"}</div>
                          <div className="text-sm text-gray-500">
                            {language === "zh" ? "使用支付宝扫码支付" : "Scan QR code with Alipay"}
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          selectedPaymentMethod === "alipay" ? "border-blue bg-blue" : "border-gray-300"
                        }`}>
                          {selectedPaymentMethod === "alipay" && (
                            <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* PayPal */}
                    {paypalEnabled && (
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod("paypal")}
                        className={`w-full p-4 border-2 rounded-lg transition-all ${
                          selectedPaymentMethod === "paypal"
                            ? "border-[#0070BA] bg-[#0070BA]/5"
                            : "border-gray-200 hover:border-[#0070BA]/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#003087] rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.644h6.097c2.095 0 3.745.47 4.914 1.4 1.168.93 1.753 2.32 1.753 4.17 0 1.16-.249 2.19-.747 3.09-.498.9-1.204 1.61-2.118 2.13-.914.52-1.95.78-3.108.78h-2.73l-.967 6.09a.77.77 0 0 1-.757.644L7.076 21.337zm.646-16.41l-1.82 11.77h2.55l.967-6.088a.77.77 0 0 1 .757-.644h2.73c.79 0 1.472-.18 2.047-.54.575-.36 1.01-.86 1.305-1.5.294-.64.442-1.37.442-2.19 0-1.23-.367-2.15-1.1-2.76-.734-.61-1.84-.91-3.32-.91H8.48a.128.128 0 0 0-.127.11l-.631 2.752z"/>
                            </svg>
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-gray-900">PayPal</div>
                            <div className="text-sm text-gray-500">
                              {language === "zh" ? "使用PayPal账户安全支付" : "Pay securely with PayPal"}
                            </div>
                            <div className="text-xs text-orange-600 mt-1">
                              {language === "zh" 
                                ? "中国大陆用户需使用稳定VPN" 
                                : "Users in mainland China need a stable VPN"}
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            selectedPaymentMethod === "paypal" ? "border-[#0070BA] bg-[#0070BA]" : "border-gray-300"
                          }`}>
                            {selectedPaymentMethod === "paypal" && (
                              <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </button>
                    )}

                    <div className="text-center pt-4">
                      <Button
                        onClick={() => {
                          if (!selectedPaymentMethod) {
                            alert(language === "zh" ? "请选择支付方式" : "Please select a payment method")
                            return
                          }
                          if (!isLoggedIn) {
                            alert(
                              language === "zh" ? "请先登录后再继续支付" : "Please login before proceeding to payment",
                            )
                            router.push(
                              `/student-login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`,
                            )
                            return
                          }
                          if (selectedPaymentMethod === "paypal" && !paypalEnabled) {
                            alert(language === "zh" ? "PayPal暂未配置，请选择其他支付方式" : "PayPal is not available, please select another payment method")
                            return
                          }
                          if (selectedPaymentMethod === "wechat") {
                            setShowWechatModal(true)
                          } else if (selectedPaymentMethod === "alipay") {
                            setShowAlipayModal(true)
                          } else if (selectedPaymentMethod === "paypal") {
                            setShowCheckout(true)
                          }
                        }}
                        className="bg-orange hover:bg-orange/90 text-white h-12 px-8"
                        disabled={!selectedPaymentMethod}
                      >
                        {language === "zh" ? "进入支付" : "Proceed to Payment"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{language === "zh" ? "完成支付" : "Complete Payment"}</span>
                      <Button variant="ghost" size="sm" onClick={() => setShowCheckout(false)}>
                        {language === "zh" ? "返回" : "Back"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PayPalCheckout
                      amount={paymentInfo.price}
                      currency="CNY"
                      description={`${paymentInfo.courseName} - ${paymentInfo.packageName}`}
                      metadata={{
                        courseId: paymentInfo.courseId,
                        courseName: paymentInfo.courseName,
                        packageName: paymentInfo.packageName,
                        classCount: paymentInfo.classCount,
                        studentId: currentUserId || "",
                      }}
                      onSuccess={handlePaymentComplete}
                      onError={(error) => {
                        console.error("[v0] PayPal payment error:", error)
                        alert(language === "zh" ? "支付失败，请重试" : "Payment failed, please try again")
                      }}
                      onBack={() => setShowCheckout(false)}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Payment Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>{language === "zh" ? "支付摘要" : "Payment Summary"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === "zh" ? "订单号" : "Order Number"}</span>
                      <span className="font-mono text-xs">{orderNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === "zh" ? "课程套餐" : "Package"}</span>
                      <span className="font-medium">{paymentInfo.packageName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === "zh" ? "课程数量" : "Classes"}</span>
                      <span className="font-medium">{paymentInfo.classCount}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold">{language === "zh" ? "应付总额" : "Total Amount"}</span>
                      <span className="text-2xl font-bold text-blue">¥{paymentInfo.price}</span>
                    </div>
                  </div>

                  <div className="text-xs text-center text-gray-500 space-y-1">
                    <div>{language === "zh" ? "安全支付由PayPal提供" : "Secure payment by PayPal"}</div>
                    <div className="text-orange-600">
                      {language === "zh" 
                        ? "中国大陆用户使用PayPal需确保VPN稳定" 
                        : "Users in mainland China need a stable VPN for PayPal"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* WeChat Pay Modal */}
      {showWechatModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-green-500 p-4 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">
                {language === "zh" ? "微信支付" : "WeChat Pay"}
              </h3>
              <button
                onClick={() => setShowWechatModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  {language === "zh" 
                    ? `请使用微信扫描下方二维码支付 ¥${paymentInfo.price}` 
                    : `Please scan the QR code below to pay ¥${paymentInfo.price}`}
                </p>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/images/wechat-pay-qr.png"
                  alt="WeChat Pay QR Code"
                  width={300}
                  height={400}
                  className="rounded-lg"
                />
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>{language === "zh" ? "扫码完成支付后，请点击下方按钮确认" : "After payment, click the button below to confirm"}</p>
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowWechatModal(false)}
                >
                  {language === "zh" ? "取消" : "Cancel"}
                </Button>
                <Button
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  onClick={() => {
                    setShowWechatModal(false)
                    handleManualPaymentComplete()
                  }}
                >
                  {language === "zh" ? "已完成支付" : "Payment Completed"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alipay Modal */}
      {showAlipayModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-[#1677FF] p-4 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">
                {language === "zh" ? "支付宝" : "Alipay"}
              </h3>
              <button
                onClick={() => setShowAlipayModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  {language === "zh" 
                    ? `请使用支付宝扫描下方二维码支付 ¥${paymentInfo.price}` 
                    : `Please scan the QR code below to pay ¥${paymentInfo.price}`}
                </p>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/images/alipay-qr.png"
                  alt="Alipay QR Code"
                  width={300}
                  height={400}
                  className="rounded-lg"
                />
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>{language === "zh" ? "扫码完成支付后，请点击下方按钮确认" : "After payment, click the button below to confirm"}</p>
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowAlipayModal(false)}
                >
                  {language === "zh" ? "取消" : "Cancel"}
                </Button>
                <Button
                  className="flex-1 bg-[#1677FF] hover:bg-[#1677FF]/90"
                  onClick={() => {
                    setShowAlipayModal(false)
                    handleManualPaymentComplete()
                  }}
                >
                  {language === "zh" ? "已完成支付" : "Payment Completed"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  )
}

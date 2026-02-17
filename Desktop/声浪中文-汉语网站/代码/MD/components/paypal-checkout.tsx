"use client"

import { useEffect, useRef, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

// Exchange rate configuration
// In production, fetch from API like: https://api.exchangerate-api.com/v4/latest/CNY
const CNY_TO_USD_RATE = 0.14 // Approximate rate: 1 CNY = 0.14 USD (updated 2024)

declare global {
  interface Window {
    paypal?: any
  }
}

interface PayPalCheckoutProps {
  amount: number
  currency?: string
  description: string
  metadata: {
    courseId: string
    courseName: string
    packageName: string
    classCount: number
    studentId: string
  }
  onSuccess: (details: any) => void
  onError?: (error: any) => void
}

export function PayPalCheckout({
  amount,
  currency = "USD",
  description,
  metadata,
  onSuccess,
  onError,
}: PayPalCheckoutProps) {
  const [sdkReady, setSdkReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const paypalRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

    console.log("[v0] PayPal Client ID exists:", !!PAYPAL_CLIENT_ID)
    console.log("[v0] Currency:", currency)

    if (!PAYPAL_CLIENT_ID) {
      console.error("[v0] NEXT_PUBLIC_PAYPAL_CLIENT_ID is not configured")
      setError("PayPal 配置未完成。请联系管理员配置 PayPal，或选择其他支付方式。")
      setIsLoading(false)
      return
    }

    if (window.paypal) {
      console.log("[v0] PayPal SDK already loaded")
      setSdkReady(true)
      setIsLoading(false)
      return
    }

    if (scriptLoadedRef.current) {
      console.log("[v0] PayPal script already being loaded")
      return
    }

    scriptLoadedRef.current = true
    console.log("[v0] Loading PayPal SDK script...")

    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency === "CNY" ? "USD" : currency}&disable-funding=credit,card`
    script.async = true

    script.addEventListener("load", () => {
      console.log("[v0] PayPal SDK loaded successfully")
      setSdkReady(true)
      setIsLoading(false)
    })

    script.addEventListener("error", (e) => {
      console.error("[v0] Failed to load PayPal SDK:", e)
      setError("PayPal加载失败。请检查网络连接或刷新页面重试。")
      setIsLoading(false)
      scriptLoadedRef.current = false
    })

    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script)
      }
    }
  }, [currency])

  useEffect(() => {
    if (!sdkReady || !paypalRef.current || !window.paypal) return

    console.log("[v0] Rendering PayPal buttons with amount:", amount, currency)

    try {
      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
            height: 45,
          },
          createOrder: async () => {
            try {
              console.log("[v0] Creating PayPal order via API")
              // Convert CNY to USD for PayPal
              const paypalAmount = currency === "CNY" 
                ? (amount * CNY_TO_USD_RATE).toFixed(2) 
                : amount

              const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  amount: paypalAmount,
                  currency: "USD", // PayPal requires USD for Chinese accounts
                  description,
                  metadata,
                }),
              })

              const data = await response.json()

              if (!response.ok) {
                throw new Error(data.error || "Failed to create order")
              }

              console.log("[v0] PayPal order created:", data.orderId)
              return data.orderId
            } catch (err: any) {
              console.error("[v0] PayPal create order error:", err)
              setError(err.message)
              throw err
            }
          },
          onApprove: async (data: any) => {
            try {
              console.log("[v0] PayPal payment approved, capturing order:", data.orderID)

              const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: data.orderID }),
              })

              const details = await response.json()

              if (!response.ok) {
                throw new Error(details.error || "Failed to capture payment")
              }

              console.log("[v0] PayPal payment captured successfully")
              onSuccess(details)
            } catch (err: any) {
              console.error("[v0] PayPal capture error:", err)
              setError(err.message)
              if (onError) onError(err)
            }
          },
          onError: (err: any) => {
            console.error("[v0] PayPal error:", err)
            setError("支付失败，请重试。")
            if (onError) onError(err)
          },
          onCancel: () => {
            console.log("[v0] PayPal payment cancelled by user")
          },
        })
        .render(paypalRef.current)
    } catch (err: any) {
      console.error("[v0] Error rendering PayPal buttons:", err)
      setError("PayPal按钮渲染失败。请刷新页面重试。")
    }
  }, [sdkReady, amount, currency, description, metadata, onSuccess, onError])

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="ml-2">
          <div className="font-semibold mb-2">支付系统错误</div>
          <div className="text-sm">{error}</div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 bg-transparent"
            onClick={() => {
              setError(null)
              setIsLoading(true)
              scriptLoadedRef.current = false
              window.location.reload()
            }}
          >
            刷新页面重试
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading || !sdkReady) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg">
        <Loader2 className="h-10 w-10 animate-spin text-blue mb-4" />
        <span className="text-gray-700 font-medium">正在加载PayPal支付...</span>
        <span className="text-sm text-gray-500 mt-2">请稍候，这可能需要几秒钟</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div ref={paypalRef} className="w-full min-h-[200px]" />
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>点击上方按钮使用PayPal完成支付</p>
        <p className="mt-1">支持PayPal账户、信用卡和借记卡</p>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, RefreshCw, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"

const CNY_TO_USD_RATE = 0.14
const SDK_LOAD_TIMEOUT = 10000

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
  const [loadProgress, setLoadProgress] = useState(0)
  const [retryCount, setRetryCount] = useState(0)
  const paypalRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const renderedRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }, [])

  const loadPayPalSDK = useCallback(() => {
    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

    console.log("[PayPal] Client ID exists:", !!PAYPAL_CLIENT_ID)

    if (!PAYPAL_CLIENT_ID) {
      setError("PayPal 配置未完成，请联系管理员。")
      setIsLoading(false)
      return
    }

    if (window.paypal) {
      console.log("[PayPal] SDK already loaded")
      setSdkReady(true)
      setIsLoading(false)
      return
    }

    if (scriptRef.current) {
      scriptRef.current.remove()
      scriptRef.current = null
    }

    clearTimers()

    setIsLoading(true)
    setError(null)
    setLoadProgress(0)
    renderedRef.current = false

    progressIntervalRef.current = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 10
      })
    }, 300)

    timeoutRef.current = setTimeout(() => {
      console.error("[PayPal] SDK load timeout")
      clearTimers()
      setError("PayPal 加载超时，可能是网络问题。请检查网络连接后重试。")
      setIsLoading(false)
      if (scriptRef.current) {
        scriptRef.current.remove()
        scriptRef.current = null
      }
    }, SDK_LOAD_TIMEOUT)

    console.log("[PayPal] Loading SDK script...")

    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency === "CNY" ? "USD" : currency}&disable-funding=credit,card`
    script.async = true

    script.addEventListener("load", () => {
      console.log("[PayPal] SDK loaded successfully")
      clearTimers()
      setLoadProgress(100)
      setTimeout(() => {
        setSdkReady(true)
        setIsLoading(false)
      }, 100)
    })

    script.addEventListener("error", (e) => {
      console.error("[PayPal] SDK load error:", e)
      clearTimers()
      setError("PayPal 加载失败，请检查网络连接或刷新页面重试。")
      setIsLoading(false)
      script.remove()
      scriptRef.current = null
    })

    document.body.appendChild(script)
    scriptRef.current = script
  }, [currency, clearTimers])

  useEffect(() => {
    loadPayPalSDK()

    return () => {
      clearTimers()
      if (scriptRef.current?.parentNode) {
        scriptRef.current.remove()
      }
    }
  }, [loadPayPalSDK, clearTimers])

  useEffect(() => {
    if (!sdkReady || !paypalRef.current || !window.paypal || renderedRef.current) return

    console.log("[PayPal] Rendering buttons, amount:", amount, currency)
    renderedRef.current = true

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
              console.log("[PayPal] Creating order")
              const paypalAmount = currency === "CNY"
                ? (amount * CNY_TO_USD_RATE).toFixed(2)
                : amount

              const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  amount: paypalAmount,
                  currency: "USD",
                  description,
                  metadata,
                }),
              })

              const data = await response.json()

              if (!response.ok) {
                throw new Error(data.error || "Failed to create order")
              }

              console.log("[PayPal] Order created:", data.orderId)
              return data.orderId
            } catch (err: any) {
              console.error("[PayPal] Create order error:", err)
              setError("创建订单失败：" + (err.message || "未知错误"))
              throw err
            }
          },
          onApprove: async (data: any) => {
            try {
              console.log("[PayPal] Payment approved, capturing:", data.orderID)

              const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: data.orderID }),
              })

              const details = await response.json()

              if (!response.ok) {
                throw new Error(details.error || "Failed to capture payment")
              }

              console.log("[PayPal] Payment captured successfully")
              onSuccess(details)
            } catch (err: any) {
              console.error("[PayPal] Capture error:", err)
              setError("支付确认失败：" + (err.message || "未知错误"))
              if (onError) onError(err)
            }
          },
          onError: (err: any) => {
            console.error("[PayPal] Button error:", err)
            setError("支付过程中出现错误，请重试。")
            if (onError) onError(err)
          },
          onCancel: () => {
            console.log("[PayPal] Payment cancelled")
          },
        })
        .render(paypalRef.current)
    } catch (err: any) {
      console.error("[PayPal] Render error:", err)
      setError("PayPal 按钮渲染失败，请重试。")
      renderedRef.current = false
    }
  }, [sdkReady, amount, currency, description, metadata, onSuccess, onError])

  const handleRetry = () => {
    setError(null)
    setSdkReady(false)
    setRetryCount(prev => prev + 1)
    if (scriptRef.current) {
      scriptRef.current.remove()
      scriptRef.current = null
    }
    loadPayPalSDK()
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="ml-2">
          <div className="font-semibold mb-2">支付加载失败</div>
          <div className="text-sm">{error}</div>
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
              onClick={handleRetry}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重试加载
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
              onClick={() => window.location.reload()}
            >
              刷新页面
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading || !sdkReady) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg">
        <Loader2 className="h-10 w-10 animate-spin text-blue mb-4" />
        <span className="text-gray-700 font-medium">正在加载 PayPal 支付...</span>
        <div className="w-48 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-blue transition-all duration-300"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 mt-2">
          {loadProgress < 30 ? "正在连接 PayPal 服务器..." :
           loadProgress < 60 ? "正在加载支付组件..." :
           "即将完成..."}
        </span>
        <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
          <Wifi className="w-3 h-3" />
          <span>如加载缓慢，请检查网络连接</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div ref={paypalRef} className="w-full min-h-[200px]" />
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>点击上方按钮使用 PayPal 完成支付</p>
        <p className="mt-1">支持 PayPal 账户、信用卡和借记卡</p>
      </div>
    </div>
  )
}

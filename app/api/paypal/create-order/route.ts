import { type NextRequest, NextResponse } from "next/server"

const API_TIMEOUT = 30000

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number = API_TIMEOUT): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = "USD", description, metadata } = body

    console.log("[v0] Creating PayPal order:", { amount, currency, description })

    const amountNumber = typeof amount === "string" ? Number.parseFloat(amount) : amount

    if (isNaN(amountNumber) || amountNumber <= 0) {
      throw new Error(`Invalid amount: ${amount}`)
    }

    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
    const PAYPAL_API_BASE =
      process.env.PAYPAL_MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("PayPal credentials not configured")
    }

    // Get PayPal access token
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")
    const tokenResponse = await fetchWithTimeout(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to get PayPal access token")
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    if (!accessToken) {
      throw new Error("No access token received from PayPal")
    }

    // Create PayPal order
    const orderResponse = await fetchWithTimeout(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amountNumber.toFixed(2),
            },
            description: description,
            custom_id: JSON.stringify(metadata),
          },
        ],
        application_context: {
          brand_name: "WaveMandarin",
          locale: "en-US",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
        },
      }),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json().catch(() => ({}))
      console.error("[v0] PayPal order creation failed:", errorData)
      throw new Error(errorData.message || "Failed to create PayPal order")
    }

    const orderData = await orderResponse.json()
    console.log("[v0] PayPal order created:", orderData.id)

    return NextResponse.json({ orderId: orderData.id })
  } catch (error: any) {
    console.error("[v0] PayPal order creation error:", error)
    const errorMessage = error?.name === "AbortError" 
      ? "Request timeout - please check your network connection" 
      : error?.message || "Failed to create PayPal order"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

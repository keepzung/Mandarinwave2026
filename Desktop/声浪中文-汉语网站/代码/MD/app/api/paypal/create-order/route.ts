import { type NextRequest, NextResponse } from "next/server"

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
    const tokenResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Create PayPal order
    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
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

    const orderData = await orderResponse.json()
    console.log("[v0] PayPal order created:", orderData.id)

    return NextResponse.json({ orderId: orderData.id })
  } catch (error) {
    console.error("[v0] PayPal order creation error:", error)
    return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 })
  }
}

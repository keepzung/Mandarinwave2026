import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    console.log("[v0] Capturing PayPal order:", orderId)

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

    // Capture PayPal order
    const captureResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    const captureData = await captureResponse.json()
    console.log("[v0] PayPal order captured:", captureData)

    // Extract custom metadata
    const customId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id
    const metadata = customId ? JSON.parse(customId) : {}

    return NextResponse.json({
      success: true,
      orderId: captureData.id,
      status: captureData.status,
      metadata,
      payerEmail: captureData.payer?.email_address,
      payerName: captureData.payer?.name?.given_name + " " + captureData.payer?.name?.surname,
    })
  } catch (error) {
    console.error("[v0] PayPal order capture error:", error)
    return NextResponse.json({ error: "Failed to capture PayPal order" }, { status: 500 })
  }
}

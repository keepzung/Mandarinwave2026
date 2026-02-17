"use server"

import { stripe } from "@/lib/stripe"
import { COURSE_PACKAGES } from "@/lib/products"

export async function startCheckoutSession(packageId: string, courseId?: string) {
  const packageInfo = COURSE_PACKAGES.find((p) => p.id === packageId)

  if (!packageInfo) {
    throw new Error(`Package with id "${packageId}" not found`)
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: packageInfo.name,
            description: `${packageInfo.description} - ${packageInfo.classes} 课时`,
          },
          unit_amount: packageInfo.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      packageId: packageId,
      courseId: courseId || "",
      classes: packageInfo.classes.toString(),
    },
  })

  return session.client_secret
}

export async function getSessionStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  return {
    status: session.status,
    customer_email: session.customer_details?.email,
    payment_status: session.payment_status,
  }
}

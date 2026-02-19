"use client"

import { useCallback } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { startCheckoutSession } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutProps {
  packageId: string
  courseId?: string
  onComplete?: () => void
}

export default function StripeCheckout({ packageId, courseId, onComplete }: StripeCheckoutProps) {
  const fetchClientSecret = useCallback(async () => {
    try {
      const clientSecret = await startCheckoutSession(packageId, courseId)
      return clientSecret
    } catch (error) {
      console.error("[v0] Error creating checkout session:", error)
      throw error
    }
  }, [packageId, courseId])

  return (
    <div id="stripe-checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
          onComplete: () => {
            console.log("[v0] Payment completed")
            onComplete?.()
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

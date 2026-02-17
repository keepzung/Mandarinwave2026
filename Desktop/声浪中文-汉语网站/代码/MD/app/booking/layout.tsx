import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book a Course - MandarinWave",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

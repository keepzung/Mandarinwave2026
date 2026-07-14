import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Student Registration - InTime Mandarin",
  description: "Register for InTime Mandarin Chinese learning courses",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

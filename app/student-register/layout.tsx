import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Student Registration - Intime Mandarin",
  description: "Register for Intime Mandarin Chinese learning courses",
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

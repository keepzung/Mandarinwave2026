import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Student Login - InTime Mandarin",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function StudentLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

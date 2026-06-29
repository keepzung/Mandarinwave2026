import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Student Login - Intime Mandarin",
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

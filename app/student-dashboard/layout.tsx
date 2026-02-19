import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Student Dashboard - MandarinWave",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

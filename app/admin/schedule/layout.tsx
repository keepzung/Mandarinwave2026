import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Schedule Management - Intime Mandarin",
  description: "Manage class schedules",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

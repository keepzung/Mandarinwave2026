import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Schedule - MandarinWave",
  description: "View your class schedule",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return children
}

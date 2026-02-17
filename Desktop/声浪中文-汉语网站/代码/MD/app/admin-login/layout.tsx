import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login - MandarinWave",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Registration - MandarinWave",
  description: "Register for an admin account",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function AdminRegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

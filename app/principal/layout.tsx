import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Principal Management - InTime Mandarin",
  description: "Principal management system for InTime Mandarin",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  return children
}

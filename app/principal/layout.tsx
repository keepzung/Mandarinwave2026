import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Principal Management - Intime Mandarin",
  description: "Principal management system for Intime Mandarin",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  return children
}

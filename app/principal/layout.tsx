import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Principal Management - MandarinWave",
  description: "Principal management system for MandarinWave",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  return children
}

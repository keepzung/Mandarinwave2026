import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kids' Chinese Course | MandarinWave",
  description: "Let children learn Chinese happily through games",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function KidsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

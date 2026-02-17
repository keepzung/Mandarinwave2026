import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "News - MandarinWave",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

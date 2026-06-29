import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Summer Camp - Intime Mandarin",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function SummerCampLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

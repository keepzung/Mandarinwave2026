import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "City Tour - MandarinWave",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function CityTourLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

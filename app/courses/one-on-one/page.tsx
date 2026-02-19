import type { Metadata } from "next"
import OneOnOneClient from "./one-on-one-client"

export const metadata: Metadata = {
  title: "One-on-One Chinese Course - MandarinWave 声浪中文",
  description:
    "Personalized one-on-one Chinese courses with dedicated teachers. Flexible scheduling and customized curriculum for all levels.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function OneOnOnePage() {
  return <OneOnOneClient />
}

import type { Metadata } from "next"
import dynamic from "next/dynamic"

const HSKClientPage = dynamic(() => import("./hsk-client"))

export const metadata: Metadata = {
  title: "HSK Exam Preparation | MandarinWave",
  description: "Systematic HSK preparation to help you pass successfully",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function HSKPage() {
  return <HSKClientPage />
}

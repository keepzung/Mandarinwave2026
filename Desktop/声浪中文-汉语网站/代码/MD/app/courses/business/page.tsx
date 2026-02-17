import type { Metadata } from "next"
import BusinessClientPage from "./BusinessClientPage"

export const metadata: Metadata = {
  title: "Business Chinese Course | MandarinWave",
  description: "Professional business Chinese training to advance your career",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function BusinessPage() {
  return <BusinessClientPage />
}

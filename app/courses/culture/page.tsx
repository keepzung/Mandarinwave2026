import type { Metadata } from "next"
import CultureClientPage from "./culture-client"

export const metadata: Metadata = {
  title: "Chinese Culture Course | MandarinWave",
  description: "Learn language through culture, feel culture through language",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function CulturePage() {
  return <CultureClientPage />
}

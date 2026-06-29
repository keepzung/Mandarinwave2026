import type { Metadata } from "next"
import GroupClientPage from "./group-client-page"

export const metadata: Metadata = {
  title: "Small Group Classes | Intime Mandarin",
  description: "Learn through interaction, progress through communication",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function GroupPage() {
  return <GroupClientPage />
}

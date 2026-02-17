import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Noto_Sans_SC } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/lib/language-context"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "MandarinWave 声浪中文 - Professional Chinese Language Education",
  description:
    "Professional online and offline Chinese education platform providing personalized learning experiences for global learners. 专业的线上线下中文教育平台，为全球学习者提供个性化学习体验。",
  generator: "v0.app",
  keywords: ["Chinese learning", "Mandarin", "中文学习", "汉语教学", "对外汉语", "Learn Chinese Online", "HSK"],
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

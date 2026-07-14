import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Noto_Sans_SC } from "next/font/google"
import Script from "next/script"
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
  title: "InTime Mandarin 真时中文 - Professional Chinese Language Education",
  description:
    "Professional online and offline Chinese education platform providing personalized learning experiences for global learners. 专业的线上线下中文教育平台，为全球学习者提供个性化学习体验。",
  generator: "v0.app",
  keywords: ["Chinese learning", "Mandarin", "中文学习", "汉语教学", "对外汉语", "Learn Chinese Online", "HSK"],
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "MIFJ1hp6jyblcRkFUx8O6Vwv77Uu_wdyT-4m2s6Lhds",
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4HBKTP3KDS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4HBKTP3KDS');
          `}
        </Script>
        <Script id="page-visit-tracker" strategy="afterInteractive">
          {`
            (function() {
              try {
                var key = 'mw_visited_' + window.location.pathname;
                var sessionKey = 'mw_session_tracked';
                if (sessionStorage.getItem(key)) return;
                sessionStorage.setItem(key, '1');
                fetch('/api/analytics/visit', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    path: window.location.pathname,
                    referrer: document.referrer || null,
                    language: navigator.language || null
                  })
                }).catch(function(){});
              } catch(e) {}
            })();
          `}
        </Script>
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

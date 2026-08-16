'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { Home, Calendar } from "lucide-react"

export default function NewsPage() {
  const { language } = useLanguage()
  const t = useTranslation(language)
  const p = t.newsPage.paragraphs

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-blue text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/">
            <Button variant="outline" className="mb-8 bg-white text-blue hover:bg-white/90 border-white">
              <Home className="mr-2 h-4 w-4" />
              {t.newsPage.backToHome}
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{t.newsPage.title}</h1>
          <h2 className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl">{t.newsPage.subtitle}</h2>
          <div className="flex items-center gap-2 mt-6 text-white/80">
            <Calendar className="w-5 h-5" />
            <time className="text-lg">{t.newsPage.date}</time>
          </div>
        </div>
      </section>

      {/* Article */}
      <article className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <img
            src="/images/news-chamber-1.jpg"
            alt={t.newsPage.subtitle}
            className="w-full h-auto rounded-2xl shadow-lg mb-10"
          />

          <div className="space-y-8">
            <p className="text-lg text-gray-700 leading-relaxed">{p[0]}</p>
          </div>

          <figure className="my-10">
            <img
              src="/images/news-chamber-2.png"
              alt={t.newsPage.subtitle}
              className="w-full h-auto rounded-2xl shadow-lg"
            />
            <figcaption className="text-center text-gray-500 mt-4 leading-relaxed">{p[1]}</figcaption>
          </figure>

          <div className="space-y-8">
            <p className="text-lg text-gray-700 leading-relaxed">{p[2]}</p>
            <p className="text-lg text-gray-700 leading-relaxed">{p[3]}</p>
          </div>

          <img
            src="/images/news-chamber-3.jpg"
            alt={t.newsPage.subtitle}
            className="w-full h-auto rounded-2xl shadow-lg my-10"
          />

          <div className="space-y-8">
            <p className="text-lg text-gray-700 leading-relaxed">{p[4]}</p>
            <p className="text-lg text-gray-700 leading-relaxed">{p[5]}</p>
          </div>

          <img
            src="/images/news-chamber-4.jpg"
            alt={t.newsPage.subtitle}
            className="w-full h-auto rounded-2xl shadow-lg my-10"
          />

          <p className="text-lg text-gray-700 leading-relaxed">{p[6]}</p>

          <div className="mt-16 text-center border-t border-gray-100 pt-10">
            <Link href="/">
              <Button className="bg-blue hover:bg-blue/90 text-white">
                <Home className="mr-2 h-4 w-4" />
                {t.newsPage.backToHome}
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"

export function Hero() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("contact")
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-[700px] flex items-center bg-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img src="/hero-chinese-learning.jpg" alt="Chinese learning" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl py-20">
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 text-balance leading-tight">
            {t.hero.title} <span className="text-orange">{t.hero.titleHighlight}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed">{t.hero.subtitle}</p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">{t.hero.description}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-blue hover:bg-blue/90 text-white text-lg px-10 shadow-lg"
              onClick={scrollToBooking}
            >
              {t.buttons.bookTrial}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

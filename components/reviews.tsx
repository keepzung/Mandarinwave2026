'use client'

import { Star } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useTranslation } from '@/lib/i18n'

export function Reviews() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {t.reviews.title}
          </h2>
          <p className="text-xl text-gray-600">
            {t.reviews.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Trustpilot Style */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-orange text-orange" />
              ))}
            </div>
            <div className="text-5xl font-bold text-black mb-2">4.9</div>
            <div className="text-gray-600">
              {language === 'zh' ? '基于 238 条评价' : 'Based on 238 reviews'}
            </div>
          </div>

          {/* Google Reviews Style */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-blue text-blue" />
              ))}
            </div>
            <div className="text-5xl font-bold text-black mb-2">4.95</div>
            <div className="text-gray-600">
              {language === 'zh' ? 'Google 评分' : 'Google Rating'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

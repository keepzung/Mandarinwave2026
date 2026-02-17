"use client"

import { Award, UserCheck, Clock, Zap, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"

export function WhyWaveMandarin() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  const features = [
    {
      icon: Award,
      title: t.why.certified.title,
      description: t.why.certified.desc,
    },
    {
      icon: UserCheck,
      title: t.why.personalized.title,
      description: t.why.personalized.desc,
    },
    {
      icon: Clock,
      title: t.why.flexible.title,
      description: t.why.flexible.desc,
    },
    {
      icon: Zap,
      title: t.why.technology.title,
      description: t.why.technology.desc,
    },
    {
      icon: Globe,
      title: t.why.globalReach.title,
      description: t.why.globalReach.desc,
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">{t.why.title}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange/10 mb-6">
                  <Icon className="w-8 h-8 text-orange" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

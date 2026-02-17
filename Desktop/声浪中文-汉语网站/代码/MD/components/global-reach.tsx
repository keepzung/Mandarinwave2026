'use client'

import { Globe, School, Users, MapPin } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function GlobalReach() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  const stats = [
    {
      icon: School,
      number: '50+',
      label: t.reach.onlineSchools,
      description: t.reach.onlineSchoolsDesc
    },
    {
      icon: Users,
      number: '200+',
      label: t.reach.teachers,
      description: t.reach.teachersDesc
    },
    {
      icon: Users,
      number: '10,000+',
      label: t.reach.students,
      description: t.reach.studentsDesc
    },
    {
      icon: MapPin,
      number: '80+',
      label: t.reach.countries,
      description: t.reach.countriesDesc
    }
  ]

  return (
    <section id="reach" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {t.reach.title}
          </h2>
          <p className="text-xl text-gray-600">
            {t.reach.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue/10 mb-6">
                  <Icon className="w-8 h-8 text-blue" />
                </div>
                <div className="text-5xl font-bold text-orange mb-2">{stat.number}</div>
                <h3 className="text-xl font-bold text-black mb-2">{stat.label}</h3>
                <p className="text-gray-600">{stat.description}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/news">
            <Button size="lg" variant="outline" className="border-blue text-blue hover:bg-blue hover:text-white">
              {t.buttons.learnMore}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

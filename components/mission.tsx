"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"
import { Carousel } from "@/components/carousel"

export function Mission() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <section id="mission" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">{t.mission.title}</h2>
            <div className="space-y-6 mb-10">
              <p className="text-lg text-gray-700 leading-relaxed">{t.mission.content1}</p>
              <p className="text-lg text-gray-700 leading-relaxed">{t.mission.content2}</p>
              <p className="text-lg text-gray-700 leading-relaxed">{t.mission.content3}</p>
              <p className="text-lg text-gray-700 leading-relaxed">{t.mission.content4}</p>
            </div>

            <h3 className="text-2xl font-bold text-orange mb-4">{t.mission.methodTitle}</h3>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">{t.mission.methodContent}</p>

            <Link href="/contact">
              <Button className="bg-blue hover:bg-blue/90 text-white">{t.buttons.collaborate}</Button>
            </Link>

            <div className="mt-8">
              <Carousel />
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:sticky lg:top-24">
            <img
              src="/about-us-learning-environment.jpg"
              alt="Our Team"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

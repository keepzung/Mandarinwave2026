"use client"

import { BookOpen, Users, Briefcase, Baby, GraduationCap, Sparkles, Snowflake, Sun, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

export function Courses() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  const courses = [
    {
      icon: Users,
      title: t.courses.group.title,
      description: t.courses.group.desc,
      color: "blue",
      href: "/courses/group",
    },
    {
      icon: BookOpen,
      title: t.courses.online.title,
      description: t.courses.online.desc,
      color: "orange",
      href: "/courses/one-on-one",
    },
    {
      icon: Baby,
      title: t.courses.kids.title,
      description: t.courses.kids.desc,
      color: "blue",
      href: "/courses/kids",
    },
    {
      icon: GraduationCap,
      title: t.courses.hsk.title,
      description: t.courses.hsk.desc,
      color: "orange",
      href: "/courses/hsk",
    },
    {
      icon: Sparkles,
      title: t.courses.culture.title,
      description: t.courses.culture.desc,
      color: "blue",
      href: "/courses/culture",
    },
    {
      icon: Briefcase,
      title: t.courses.business.title,
      description: t.courses.business.desc,
      color: "orange",
      href: "/courses/business",
    },
    {
      icon: Snowflake,
      title: t.courses.winterCamp.title,
      description: t.courses.winterCamp.desc,
      color: "blue",
      href: "/courses/winter-camp",
    },
    {
      icon: Sun,
      title: t.courses.summerCamp.title,
      description: t.courses.summerCamp.desc,
      color: "orange",
      href: "/courses/summer-camp",
    },
    {
      icon: MapPin,
      title: t.courses.cityTour.title,
      description: t.courses.cityTour.desc,
      color: "blue",
      href: "/courses/city-tour",
    },
  ]

  return (
    <section id="courses" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">{t.courses.title}</h2>
          <p className="text-xl text-gray-600">{t.courses.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const Icon = course.icon
            const isBlue = course.color === "blue"
            return (
              <Link key={index} href={course.href}>
                <div
                  className={`group p-8 rounded-2xl ${
                    isBlue ? "bg-blue" : "bg-orange"
                  } text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full`}
                >
                  <div className="mb-6">
                    <Icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{course.title}</h3>
                  <p className="text-white/90 leading-relaxed">{course.description}</p>
                  <div className="mt-4 text-white/70 group-hover:text-white transition-colors">
                    {language === "zh" ? "了解详情 →" : "Learn more →"}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

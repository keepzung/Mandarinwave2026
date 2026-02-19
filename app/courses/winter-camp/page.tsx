"use client"

import { Snowflake, Mountain, Users, Calendar, ArrowLeft, Home } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function WinterCampPage() {
  const { language } = useLanguage()
  const router = useRouter()

  const features = [
    {
      icon: Snowflake,
      title: language === "zh" ? "冬季特色活动" : "Winter Activities",
      desc: language === "zh" ? "体验中国传统冬季节日和习俗" : "Experience Chinese winter festivals and customs",
    },
    {
      icon: Users,
      title: language === "zh" ? "小组互动学习" : "Group Learning",
      desc: language === "zh" ? "与来自世界各地的学员互动交流" : "Interact with students from around the world",
    },
    {
      icon: Mountain,
      title: language === "zh" ? "文化深度体验" : "Cultural Immersion",
      desc: language === "zh" ? "在真实场景中学习和使用中文" : "Learn Chinese in authentic settings",
    },
    {
      icon: Calendar,
      title: language === "zh" ? "灵活时间安排" : "Flexible Schedule",
      desc: language === "zh" ? "根据假期时间定制学习计划" : "Customized schedule for your vacation",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{language === "zh" ? "冬令营" : "Winter Camp"}</h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {language === "zh"
                ? "在冬季假期中体验沉浸式中文学习，感受中国文化的独特魅力"
                : "Experience immersive Chinese learning during winter break and discover Chinese culture"}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
            {language === "zh" ? "项目特色" : "Program Features"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue/10 mb-4">
                    <Icon className="w-8 h-8 text-blue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-black">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-black">
            {language === "zh" ? "项目介绍" : "Program Overview"}
          </h2>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {language === "zh"
                ? "冬令营项目为学员提供独特的沉浸式中文学习体验。通过参与丰富多彩的文化活动、实地考察和互动课程，学员不仅能提升中文水平，还能深入了解中国的冬季传统和节日文化。"
                : "Our Winter Camp program offers students a unique immersive Chinese learning experience. Through diverse cultural activities, field trips, and interactive classes, students will not only improve their Chinese but also gain deep insights into Chinese winter traditions and festival culture."}
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {language === "zh"
                ? "项目包括中文课程、文化体验活动、节日庆祝、实地参观等内容。学员将在专业教师的指导下，通过真实场景的语言实践，快速提升中文听说读写能力。"
                : "The program includes Chinese lessons, cultural activities, festival celebrations, and field visits. Under professional teacher guidance, students will rapidly improve their Chinese listening, speaking, reading, and writing skills through real-world language practice."}
            </p>

            {/* Advisory Note */}
            <div className="mt-8 p-6 bg-orange/10 border-l-4 border-orange rounded">
              <p className="text-lg font-semibold text-orange mb-2">
                {language === "zh"
                  ? "📋 具体安排请咨询课程顾问"
                  : "📋 For detailed arrangements, please consult a course advisor"}
              </p>
              <p className="text-gray-700">
                {language === "zh"
                  ? "我们的课程顾问将根据您的需求和时间安排，为您定制最适合的冬令营方案。"
                  : "Our course advisors will customize the best winter camp plan for you based on your needs and schedule."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "zh" ? "开启难忘的冬季学习之旅" : "Start Your Unforgettable Winter Learning Journey"}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {language === "zh"
              ? "立即联系我们，了解更多冬令营详情"
              : "Contact us now to learn more about our Winter Camp"}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/booking?course=winter-camp">
              <Button size="lg" className="bg-orange hover:bg-orange/90 text-white">
                {language === "zh" ? "立即咨询" : "Contact Now"}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white text-blue hover:bg-gray-100" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === "zh" ? "返回上一页" : "Go Back"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

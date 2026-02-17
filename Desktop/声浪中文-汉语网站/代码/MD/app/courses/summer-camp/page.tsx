"use client"

import { Sun, Palmtree, Users, Calendar, ArrowLeft, Home } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SummerCampPage() {
  const { language } = useLanguage()
  const router = useRouter()

  const features = [
    {
      icon: Sun,
      title: language === "zh" ? "夏季特色活动" : "Summer Activities",
      desc: language === "zh" ? "丰富多彩的夏季文化体验活动" : "Diverse summer cultural activities",
    },
    {
      icon: Users,
      title: language === "zh" ? "国际化团队" : "International Team",
      desc: language === "zh" ? "结识来自世界各地的小伙伴" : "Meet friends from around the world",
    },
    {
      icon: Palmtree,
      title: language === "zh" ? "户外学习" : "Outdoor Learning",
      desc: language === "zh" ? "在户外活动中实践中文" : "Practice Chinese through outdoor activities",
    },
    {
      icon: Calendar,
      title: language === "zh" ? "暑期定制" : "Summer Customized",
      desc: language === "zh" ? "专为暑期设计的学习方案" : "Learning plan designed for summer",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-orange text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{language === "zh" ? "夏令营" : "Summer Camp"}</h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {language === "zh"
                ? "在阳光明媚的夏季，开启精彩的中文学习之旅，探索中国文化的魅力"
                : "Start an exciting Chinese learning journey in the sunny summer and explore the charm of Chinese culture"}
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
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange/10 mb-4">
                    <Icon className="w-8 h-8 text-orange" />
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
                ? "夏令营项目为学员打造充满活力的沉浸式中文学习体验。在炎炎夏日中，学员将参与户外文化探索、传统手工艺体验、城市文化考察等丰富活动，在轻松愉快的氛围中提升中文能力。"
                : "Our Summer Camp program creates a vibrant immersive Chinese learning experience. During the hot summer, students will participate in outdoor cultural exploration, traditional craft experiences, urban cultural visits, and more, improving Chinese skills in a relaxed and enjoyable atmosphere."}
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {language === "zh"
                ? "项目结合了系统的中文课程和丰富的实践活动。学员将在专业教师的带领下，通过真实的语言环境和互动体验，全面提升中文听说读写能力，同时深入了解中国当代文化和传统习俗。"
                : "The program combines systematic Chinese courses with rich practical activities. Led by professional teachers, students will comprehensively improve their Chinese listening, speaking, reading, and writing skills through authentic language environments and interactive experiences, while gaining deep insights into contemporary Chinese culture and traditional customs."}
            </p>

            {/* Advisory Note */}
            <div className="mt-8 p-6 bg-blue/10 border-l-4 border-blue rounded">
              <p className="text-lg font-semibold text-blue mb-2">
                {language === "zh"
                  ? "📋 具体安排请咨询课程顾问"
                  : "📋 For detailed arrangements, please consult a course advisor"}
              </p>
              <p className="text-gray-700">
                {language === "zh"
                  ? "我们的课程顾问将根据您的需求和时间安排，为您定制最适合的夏令营方案。"
                  : "Our course advisors will customize the best summer camp plan for you based on your needs and schedule."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orange text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "zh" ? "开启精彩的夏季学习之旅" : "Start Your Exciting Summer Learning Journey"}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {language === "zh"
              ? "立即联系我们，了解更多夏令营详情"
              : "Contact us now to learn more about our Summer Camp"}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/booking?course=summer-camp">
              <Button size="lg" className="bg-blue hover:bg-blue/90 text-white">
                {language === "zh" ? "立即咨询" : "Contact Now"}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white text-orange hover:bg-gray-100" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === "zh" ? "返回上一页" : "Go Back"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

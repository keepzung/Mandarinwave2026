"use client"

import { MapPin, Camera, Compass, Users, ArrowLeft, Home } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CityTourPage() {
  const { language } = useLanguage()
  const router = useRouter()

  const features = [
    {
      icon: MapPin,
      title: language === "zh" ? "城市探索" : "City Exploration",
      desc: language === "zh" ? "深度游览中国特色城市和景点" : "In-depth tours of Chinese cities and attractions",
    },
    {
      icon: Camera,
      title: language === "zh" ? "文化体验" : "Cultural Experience",
      desc: language === "zh" ? "在旅行中体验真实的中国文化" : "Experience authentic Chinese culture while traveling",
    },
    {
      icon: Compass,
      title: language === "zh" ? "语言实践" : "Language Practice",
      desc: language === "zh" ? "在真实场景中使用和学习中文" : "Use and learn Chinese in real-life scenarios",
    },
    {
      icon: Users,
      title: language === "zh" ? "专业导游" : "Professional Guide",
      desc: language === "zh" ? "中文教师兼导游全程陪同" : "Chinese teacher-guide accompanies throughout",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{language === "zh" ? "城市旅行" : "City Tour"}</h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {language === "zh"
                ? "在旅行中学习中文，在探索中感受文化，让语言学习成为一场难忘的旅程"
                : "Learn Chinese while traveling, experience culture while exploring, and make language learning an unforgettable journey"}
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
                ? "城市旅行项目将中文学习与文化探索完美结合。学员将在专业中文教师的带领下，游览中国特色城市，参观历史古迹、现代地标、传统市场等各类景点，在真实的语言环境中提升中文交流能力。"
                : "The City Tour program perfectly combines Chinese learning with cultural exploration. Led by professional Chinese teachers, students will visit characteristic Chinese cities, explore historical sites, modern landmarks, traditional markets, and various attractions, improving Chinese communication skills in authentic language environments."}
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {language === "zh"
                ? "项目包括城市文化讲解、景点参观、当地美食体验、购物交流、日常对话练习等内容。学员不仅能游览中国名胜，还能在实际场景中学习和使用中文，真正做到学以致用，寓学于游。"
                : "The program includes city culture explanations, attraction visits, local food experiences, shopping interactions, daily conversation practice, and more. Students will not only visit famous Chinese sights but also learn and use Chinese in real scenarios, truly achieving practical learning through travel."}
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
                  ? "我们的课程顾问将根据您的兴趣和时间安排，为您定制最适合的城市旅行路线。"
                  : "Our course advisors will customize the best city tour itinerary for you based on your interests and schedule."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "zh" ? "开启独特的文化探索之旅" : "Start Your Unique Cultural Exploration Journey"}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {language === "zh"
              ? "立即联系我们，了解更多城市旅行详情"
              : "Contact us now to learn more about our City Tour"}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/booking?course=city-tour">
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

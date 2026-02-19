"use client"

import { Clock, Users, Award, Video, Check, Lock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OneOnOneClient() {
  const { language } = useLanguage()
  const t = useTranslation(language)
  const router = useRouter()
  const { user, loading } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)



  const packages = [
    {
      id: "trial",
      name: language === "zh" ? "体验课" : "Trial Lesson",
      lessons: 1,
      price: 0,
      priceLabel: language === "zh" ? "免费" : "Free",
      features: [
        language === "zh" ? "45分钟试课" : "45-minute trial",
        language === "zh" ? "水平评估" : "Level assessment",
        language === "zh" ? "学习计划建议" : "Learning plan advice",
      ],
    },
    {
      id: "10",
      name: language === "zh" ? "10课时套餐" : "10 Classes Package",
      lessons: 10,
      price: 2800,
      priceLabel: "¥2,800",
      pricePerLesson: "¥280",
      validity: language === "zh" ? "有效期15周" : "Valid for 15 weeks",
      features: [
        language === "zh" ? "10节课，45分钟/节" : "10 lessons, 45 min each",
        language === "zh" ? "个性化教材" : "Personalized materials",
        language === "zh" ? "课后练习" : "After-class exercises",
        language === "zh" ? "学习进度报告" : "Progress reports",
      ],
    },
    {
      id: "35",
      name: language === "zh" ? "35课时套餐" : "35 Classes Package",
      lessons: 35,
      price: 8330,
      priceLabel: "¥8,330",
      pricePerLesson: "¥238",
      discount: "15%",
      validity: language === "zh" ? "有效期52周" : "Valid for 52 weeks",
      popular: true,
      features: [
        language === "zh" ? "35节课，45分钟/节" : "35 lessons, 45 min each",
        language === "zh" ? "个性化教材" : "Personalized materials",
        language === "zh" ? "课后练习" : "After-class exercises",
        language === "zh" ? "学习进度报告" : "Progress reports",
        language === "zh" ? "每月水平测试" : "Monthly level tests",
      ],
    },
    {
      id: "65",
      name: language === "zh" ? "65课时套餐" : "65 Classes Package",
      lessons: 65,
      price: 13650,
      priceLabel: "¥13,650",
      pricePerLesson: "¥210",
      discount: "25%",
      validity: language === "zh" ? "有效期80周" : "Valid for 80 weeks",
      features: [
        language === "zh" ? "65节课，45分钟/节" : "65 lessons, 45 min each",
        language === "zh" ? "个性化教材" : "Personalized materials",
        language === "zh" ? "课后练习" : "After-class exercises",
        language === "zh" ? "学习进度报告" : "Progress reports",
        language === "zh" ? "每月水平测试" : "Monthly level tests",
        language === "zh" ? "专属学习顾问" : "Dedicated learning advisor",
      ],
    },
    {
      id: "95",
      name: language === "zh" ? "95课时套餐" : "95 Classes Package",
      lessons: 95,
      price: 17290,
      priceLabel: "¥17,290",
      pricePerLesson: "¥182",
      discount: "35%",
      validity: language === "zh" ? "有效期104周" : "Valid for 104 weeks",
      features: [
        language === "zh" ? "95节课，45分钟/节" : "95 lessons, 45 min each",
        language === "zh" ? "个性化教材" : "Personalized materials",
        language === "zh" ? "课后练习" : "After-class exercises",
        language === "zh" ? "学习进度报告" : "Progress reports",
        language === "zh" ? "每月水平测试" : "Monthly level tests",
        language === "zh" ? "专属学习顾问" : "Dedicated learning advisor",
        language === "zh" ? "优先预约时段" : "Priority booking slots",
      ],
    },
    {
      id: "125",
      name: language === "zh" ? "125课时套餐" : "125 Classes Package",
      lessons: 125,
      price: 21000,
      priceLabel: "¥21,000",
      pricePerLesson: "¥168",
      discount: "40%",
      validity: language === "zh" ? "有效期104周" : "Valid for 104 weeks",
      features: [
        language === "zh" ? "125节课，45分钟/节" : "125 lessons, 45 min each",
        language === "zh" ? "个性化教材" : "Personalized materials",
        language === "zh" ? "课后练习" : "After-class exercises",
        language === "zh" ? "学习进度报告" : "Progress reports",
        language === "zh" ? "每月水平测试" : "Monthly level tests",
        language === "zh" ? "专属学习顾问" : "Dedicated learning advisor",
        language === "zh" ? "优先预约时段" : "Priority booking slots",
        language === "zh" ? "HSK考试辅导" : "HSK exam coaching",
      ],
    },
  ]

  const handleSelectPackage = (packageId: string) => {
    if (!user) {
      alert(language === "zh" ? "请先登录或注册后再购买课程" : "Please login or register to purchase courses")
      router.push("/login")
      return
    }

    setSelectedPackage(packageId)
    // Navigate to purchase page with selected package
    router.push(`/student-dashboard/purchase?course=one-on-one&package=${packageId}`)
  }

  const features = [
    {
      icon: Users,
      title: language === "zh" ? "1对1专属教学" : "1-on-1 Dedicated Teaching",
      desc: language === "zh" ? "专属教师全程跟踪学习进度" : "Dedicated teacher tracks your progress",
    },
    {
      icon: Clock,
      title: language === "zh" ? "灵活时间安排" : "Flexible Scheduling",
      desc: language === "zh" ? "随时预约，自由选择上课时间" : "Book anytime at your convenience",
    },
    {
      icon: Award,
      title: language === "zh" ? "个性化课程" : "Personalized Curriculum",
      desc: language === "zh" ? "根据学员水平定制教学内容" : "Customized content for your level",
    },
    {
      icon: Video,
      title: language === "zh" ? "互动课堂" : "Interactive Classroom",
      desc: language === "zh" ? "高质量视频和互动工具" : "HD video and interactive tools",
    },
  ]

  const levels = [
    {
      name: language === "zh" ? "零基础" : "Beginner",
      desc: language === "zh" ? "从拼音开始学起" : "Start from Pinyin",
    },
    { name: language === "zh" ? "初级" : "Elementary", desc: "HSK 1-2" },
    { name: language === "zh" ? "中级" : "Intermediate", desc: "HSK 3-4" },
    { name: language === "zh" ? "高级" : "Advanced", desc: "HSK 5-6" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === "zh" ? "在线一对一中文课程" : "One-on-One Online Chinese Course"}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {language === "zh"
                ? "专属教师，个性化定制课程，让您的中文学习更高效"
                : "Dedicated teacher, personalized curriculum for more efficient learning"}
            </p>
            <Button
              size="lg"
              className="bg-orange hover:bg-orange/90 text-white"
              onClick={() => handleSelectPackage("trial")}
            >
              {t.buttons.bookTrial}
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
            {language === "zh" ? "课程特色" : "Course Features"}
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

      {/* Packages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
            {language === "zh" ? "选择适合您的套餐" : "Choose Your Package"}
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            {language === "zh"
              ? "灵活的价格方案，满足不同学习需求"
              : "Flexible pricing plans for different learning needs"}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 relative ${
                  pkg.popular ? "border-2 border-orange" : "border border-gray-200"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange text-white px-4 py-1 rounded-full text-sm font-bold">
                    {language === "zh" ? "最受欢迎" : "Most Popular"}
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-black">{pkg.name}</h3>
                  {pkg.discount && (
                    <div className="inline-block bg-orange/10 text-orange text-sm font-semibold px-3 py-1 rounded-full mb-2">
                      {language === "zh" ? `优惠 ${pkg.discount}` : `${pkg.discount} OFF`}
                    </div>
                  )}
                  <div className="text-4xl font-bold text-orange mb-1">{pkg.priceLabel}</div>
                  {pkg.pricePerLesson && (
                    <div className="text-sm text-gray-500">
                      {pkg.pricePerLesson}/{language === "zh" ? "节" : "lesson"}
                    </div>
                  )}
                  <div className="text-gray-600 mt-2">
                    {pkg.lessons} {language === "zh" ? "节课" : "lessons"}
                  </div>
                  {pkg.validity && (
                    <div className="text-sm text-blue font-medium mt-1">
                      {pkg.validity}
                    </div>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`w-full ${
                    pkg.popular
                      ? "bg-orange hover:bg-orange/90 text-white"
                      : "bg-white hover:bg-gray-50 text-blue border-2 border-blue"
                  }`}
                >
                  {pkg.id === "trial"
                    ? language === "zh"
                      ? "预约试课"
                      : "Book Trial"
                    : language === "zh"
                      ? "立即购买"
                      : "Buy Now"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
            {language === "zh" ? "适合所有水平" : "Suitable for All Levels"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {levels.map((level, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-orange">{level.name}</h3>
                <p className="text-gray-600">{level.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "zh" ? "立即开始您的学习之旅" : "Start Your Learning Journey Today"}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {language === "zh"
              ? "预约免费试课，体验专业的一对一教学"
              : "Book a free trial and experience professional one-on-one teaching"}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => handleSelectPackage("trial")}
              className="bg-orange hover:bg-orange/90 text-white"
            >
              {t.buttons.bookTrial}
            </Button>
            <Link href="/">
              <Button size="lg" variant="outline" className="bg-white text-blue hover:bg-gray-100">
                {language === "zh" ? "返回首页" : "Back to Home"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

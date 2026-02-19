"use client"
import { GraduationCap, BookOpen, Target, Award, Check, Lock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HSKClientPage() {
  const { language } = useLanguage()
  const t = useTranslation(language)
  const router = useRouter()
  const { user, loading } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)



  const handleSelectPackage = (packageId: string) => {
    if (!user) {
      alert(language === "zh" ? "请先登录或注册后再购买课程" : "Please login or register to purchase courses")
      router.push("/login")
      return
    }
    setSelectedPackage(packageId)
    // Navigate to purchase page - use course key 'hsk' to find the course
    router.push(`/student-dashboard/purchase?course=hsk&package=${packageId}`)
  }

  const features = [
    {
      icon: Target,
      title: language === "zh" ? "真题演练" : "Real Exam Practice",
      desc: language === "zh" ? "历年真题详细讲解分析" : "Detailed analysis of past exams",
    },
    {
      icon: BookOpen,
      title: language === "zh" ? "系统复习" : "Systematic Review",
      desc: language === "zh" ? "完整覆盖HSK考试大纲" : "Complete HSK syllabus coverage",
    },
    {
      icon: GraduationCap,
      title: language === "zh" ? "应试技巧" : "Test Strategies",
      desc: language === "zh" ? "专业应试方法和技巧" : "Professional test-taking methods",
    },
    {
      icon: Award,
      title: language === "zh" ? "高通过率" : "High Pass Rate",
      desc: language === "zh" ? "85%以上学员顺利通过" : "85%+ students pass successfully",
    },
  ]

  const levels = [
    {
      level: "HSK 1",
      words: language === "zh" ? "150词汇" : "150 words",
      desc: language === "zh" ? "能理解和使用简单的中文词语和句子" : "Understand simple Chinese words and sentences",
      color: "orange",
    },
    {
      level: "HSK 2",
      words: language === "zh" ? "300词汇" : "300 words",
      desc: language === "zh" ? "能用中文进行简单直接的交流" : "Simple and direct communication",
      color: "blue",
    },
    {
      level: "HSK 3",
      words: language === "zh" ? "600词汇" : "600 words",
      desc: language === "zh" ? "能完成生活、学习中的基本交际任务" : "Basic communication in daily life",
      color: "orange",
    },
    {
      level: "HSK 4",
      words: language === "zh" ? "1200词汇" : "1200 words",
      desc: language === "zh" ? "能用中文就较广泛的话题进行讨论" : "Discuss a wide range of topics",
      color: "blue",
    },
    {
      level: "HSK 5",
      words: language === "zh" ? "2500词汇" : "2500 words",
      desc: language === "zh" ? "能阅读中文报刊杂志，欣赏影视节目" : "Read newspapers and watch TV programs",
      color: "orange",
    },
    {
      level: "HSK 6",
      words: language === "zh" ? "5000+词汇" : "5000+ words",
      desc: language === "zh" ? "能轻松理解听到或读到的中文信息" : "Easily understand Chinese information",
      color: "blue",
    },
  ]

  const packages = [
    {
      id: "trial",
      name: language === "zh" ? "免费试课" : "Free Trial",
      price: language === "zh" ? "¥0" : "$0",
      duration: language === "zh" ? "1节课" : "1 Class",
      pricePerClass: "",
      discount: "",
      validity: "",
      features: [
        language === "zh" ? "45分钟HSK模拟测试" : "45-min HSK mock test",
        language === "zh" ? "水平评估报告" : "Level assessment",
        language === "zh" ? "备考方案建议" : "Study plan advice",
      ],
      color: "blue",
      popular: false,
    },
    {
      id: "10",
      name: language === "zh" ? "10课时套餐" : "10 Classes Package",
      price: "¥2,800",
      duration: language === "zh" ? "10节课" : "10 Classes",
      pricePerClass: "¥280",
      discount: "",
      validity: language === "zh" ? "有效期15周" : "Valid for 15 weeks",
      features: [
        language === "zh" ? "每节课45分钟" : "45-min per class",
        language === "zh" ? "1对1针对训练" : "1-on-1 targeted practice",
        language === "zh" ? "真题讲解" : "Past exam analysis",
        language === "zh" ? "应试技巧" : "Test strategies",
      ],
      color: "orange",
      popular: false,
    },
    {
      id: "35",
      name: language === "zh" ? "35课时套餐" : "35 Classes Package",
      price: "¥8,330",
      duration: language === "zh" ? "35节课" : "35 Classes",
      pricePerClass: "¥238",
      discount: "15%",
      validity: language === "zh" ? "有效期52周" : "Valid for 52 weeks",
      features: [
        language === "zh" ? "每节课45分钟" : "45-min per class",
        language === "zh" ? "1对1针对训练" : "1-on-1 targeted practice",
        language === "zh" ? "真题+模拟考试" : "Past exams + mock tests",
        language === "zh" ? "听说读写全面提升" : "All skills improvement",
        language === "zh" ? "每周进度报告" : "Weekly progress report",
      ],
      color: "blue",
      popular: true,
    },
    {
      id: "65",
      name: language === "zh" ? "65课时套餐" : "65 Classes Package",
      price: "¥13,650",
      duration: language === "zh" ? "65节课" : "65 Classes",
      pricePerClass: "¥210",
      discount: "25%",
      validity: language === "zh" ? "有效期80周" : "Valid for 80 weeks",
      features: [
        language === "zh" ? "每节课45分钟" : "45-min per class",
        language === "zh" ? "1对1专属教学" : "1-on-1 dedicated teaching",
        language === "zh" ? "系统化备考方案" : "Systematic prep plan",
        language === "zh" ? "全真模拟考试" : "Full mock exams",
        language === "zh" ? "考前冲刺辅导" : "Pre-exam sprint coaching",
      ],
      color: "orange",
      popular: false,
    },
    {
      id: "95",
      name: language === "zh" ? "95课时套餐" : "95 Classes Package",
      price: "¥17,290",
      duration: language === "zh" ? "95节课" : "95 Classes",
      pricePerClass: "¥182",
      discount: "35%",
      validity: language === "zh" ? "有效期104周" : "Valid for 104 weeks",
      features: [
        language === "zh" ? "每节课45分钟" : "45-min per class",
        language === "zh" ? "1对1专属教学" : "1-on-1 dedicated teaching",
        language === "zh" ? "深度备考方案" : "In-depth prep plan",
        language === "zh" ? "多次模拟考试" : "Multiple mock exams",
        language === "zh" ? "专项技能提升" : "Targeted skills improvement",
        language === "zh" ? "考前心理辅导" : "Pre-exam counseling",
      ],
      color: "blue",
      popular: false,
    },
    {
      id: "125",
      name: language === "zh" ? "125课时套餐" : "125 Classes Package",
      price: "¥21,000",
      duration: language === "zh" ? "125节课" : "125 Classes",
      pricePerClass: "¥168",
      discount: "40%",
      validity: language === "zh" ? "有效期104周" : "Valid for 104 weeks",
      features: [
        language === "zh" ? "每节课45分钟" : "45-min per class",
        language === "zh" ? "1对1专属教学" : "1-on-1 dedicated teaching",
        language === "zh" ? "全程备考规划" : "Full prep planning",
        language === "zh" ? "无限模拟考试" : "Unlimited mock exams",
        language === "zh" ? "考前密集冲刺" : "Intensive pre-exam sprint",
        language === "zh" ? "保过承诺" : "Pass guarantee",
      ],
      color: "orange",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === "zh" ? "HSK考试备考课程" : "HSK Exam Preparation Course"}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {language === "zh"
                ? "系统化备考方案，助您顺利通过HSK考试"
                : "Systematic preparation to help you pass HSK successfully"}
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
            {language === "zh" ? "课程优势" : "Course Advantages"}
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

      {/* HSK Levels */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
            {language === "zh" ? "HSK等级介绍" : "HSK Levels"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {levels.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-sm border-t-4 ${
                  item.color === "orange" ? "border-orange" : "border-blue"
                }`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${item.color === "orange" ? "text-orange" : "text-blue"}`}>
                  {item.level}
                </h3>
                <p className="text-sm font-semibold text-gray-600 mb-3">{item.words}</p>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
            {language === "zh" ? "选择适合您的备考套餐" : "Choose Your Prep Package"}
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            {language === "zh" ? "科学的备考方案，助您高效通过HSK考试" : "Scientific prep plans for HSK success"}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow ${
                  pkg.popular ? "border-blue" : "border-gray-200"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {language === "zh" ? "最受欢迎" : "Most Popular"}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${pkg.color === "orange" ? "text-orange" : "text-blue"}`}>
                    {pkg.name}
                  </h3>
                  {pkg.discount && (
                    <div className="inline-block bg-orange/10 text-orange text-sm font-semibold px-3 py-1 rounded-full mb-2">
                      {language === "zh" ? `优惠 ${pkg.discount}` : `${pkg.discount} OFF`}
                    </div>
                  )}
                  <div className="text-3xl font-bold text-black mb-1">{pkg.price}</div>
                  {pkg.pricePerClass && (
                    <div className="text-sm text-gray-500">
                      {pkg.pricePerClass}/{language === "zh" ? "节" : "class"}
                    </div>
                  )}
                  <div className="text-gray-600">{pkg.duration}</div>
                  {pkg.validity && (
                    <div className="text-sm text-blue font-medium mt-1">
                      {pkg.validity}
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          pkg.color === "orange" ? "text-orange" : "text-blue"
                        }`}
                      />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`w-full ${
                    pkg.color === "orange" ? "bg-orange hover:bg-orange/90" : "bg-blue hover:bg-blue/90"
                  } text-white`}
                >
                  {language === "zh" ? "立即预约" : "Book Now"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "zh" ? "开始您的HSK备考之旅" : "Start Your HSK Preparation Journey"}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {language === "zh" ? "专业备考指导，让您轻松应对HSK考试" : "Professional guidance for easy HSK success"}
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange hover:bg-orange/90 text-white"
              onClick={() => handleSelectPackage("trial")}
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

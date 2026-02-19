"use client"
import { Briefcase, FileText, Handshake, TrendingUp, Check, Lock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function BusinessClientPage() {
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
    // Navigate to purchase page - use course key 'business' to find the course
    router.push(`/student-dashboard/purchase?course=business&package=${packageId}`)
  }

  const features = [
    {
      icon: Briefcase,
      title: language === "zh" ? "商务场景" : "Business Scenarios",
      desc: language === "zh" ? "涵盖会议、谈判、演讲等场景" : "Covers meetings, negotiations, presentations",
    },
    {
      icon: FileText,
      title: language === "zh" ? "商务写作" : "Business Writing",
      desc: language === "zh" ? "邮件、报告、合同等文档写作" : "Emails, reports, contracts writing",
    },
    {
      icon: Handshake,
      title: language === "zh" ? "商务礼仪" : "Business Etiquette",
      desc: language === "zh" ? "了解中国商务文化和礼仪" : "Learn Chinese business culture and etiquette",
    },
    {
      icon: TrendingUp,
      title: language === "zh" ? "行业术语" : "Industry Terminology",
      desc: language === "zh" ? "掌握专业领域商务术语" : "Master professional business terms",
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
        language === "zh" ? "45分钟商务中文体验" : "45-min business Chinese trial",
        language === "zh" ? "需求分析" : "Needs analysis",
        language === "zh" ? "定制方案建议" : "Custom plan advice",
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
        language === "zh" ? "1对1专属教学" : "1-on-1 teaching",
        language === "zh" ? "商务场景训练" : "Business scenarios",
        language === "zh" ? "行业词汇学习" : "Industry vocabulary",
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
        language === "zh" ? "1对1专属教学" : "1-on-1 teaching",
        language === "zh" ? "商务场景+写作" : "Scenarios + writing",
        language === "zh" ? "行业定制内容" : "Industry-specific content",
        language === "zh" ? "商务礼仪培训" : "Business etiquette",
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
        language === "zh" ? "1对1专属教学" : "1-on-1 teaching",
        language === "zh" ? "全面商务培训" : "Comprehensive business training",
        language === "zh" ? "行业专家授课" : "Industry experts",
        language === "zh" ? "实战案例分析" : "Real case analysis",
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
        language === "zh" ? "1对1专属教学" : "1-on-1 teaching",
        language === "zh" ? "深度商务培训" : "In-depth business training",
        language === "zh" ? "定制课程内容" : "Custom curriculum",
        language === "zh" ? "商务礼仪培训" : "Business etiquette",
        language === "zh" ? "培训效果评估" : "Training assessment",
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
        language === "zh" ? "1对1专属教学" : "1-on-1 teaching",
        language === "zh" ? "全方位商务培训" : "Full business training",
        language === "zh" ? "高级定制内容" : "Premium custom content",
        language === "zh" ? "长期学习规划" : "Long-term learning plan",
        language === "zh" ? "优先预约时间" : "Priority booking",
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
              {language === "zh" ? "商务中文课程" : "Business Chinese Course"}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {language === "zh"
                ? "专业商务场景培训，助力您的职业发展"
                : "Professional business training to advance your career"}
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
            {language === "zh" ? "课程内容" : "Course Content"}
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

      {/* Industries */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
            {language === "zh" ? "行业定制" : "Industry Customization"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: language === "zh" ? "金融" : "Finance", icon: "💰" },
              { name: language === "zh" ? "贸易" : "Trade", icon: "🌐" },
              { name: language === "zh" ? "科技" : "Technology", icon: "💻" },
              { name: language === "zh" ? "制造" : "Manufacturing", icon: "🏭" },
              { name: language === "zh" ? "服务" : "Services", icon: "🤝" },
              { name: language === "zh" ? "零售" : "Retail", icon: "🛍️" },
            ].map((industry, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-4xl mb-3">{industry.icon}</div>
                <h3 className="text-xl font-bold text-blue">{industry.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
            {language === "zh" ? "选择适合您的套餐" : "Choose Your Package"}
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            {language === "zh" ? "专业的商务中文培训方案" : "Professional business Chinese training"}
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
            {language === "zh" ? "提升您的商务中文能力" : "Enhance Your Business Chinese Skills"}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {language === "zh"
              ? "专业教师团队，为您量身定制商务中文课程"
              : "Professional team to customize business Chinese courses for you"}
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

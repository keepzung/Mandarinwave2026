"use client"
import { Sparkles, Crown, Users, MessageSquare, Check, Lock, Phone, Mail } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CultureClientPage() {
  const { language } = useLanguage()
  const t = useTranslation(language)
  const router = useRouter()
  const { user, loading } = useAuth()

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-lg p-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange/10 mb-6">
              <Lock className="w-10 h-10 text-orange" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              {language === "zh" ? "登录后查看课程详情" : "Login to View Course Details"}
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {language === "zh"
                ? "请先登录或注册账号，即可查看详细的课程信息、套餐价格和预订选项"
                : "Please login or register to view detailed course information, package pricing, and booking options"}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => router.push("/login")} className="bg-blue hover:bg-blue/90 text-white">
                {language === "zh" ? "登录" : "Login"}
              </Button>
              <Button
                size="lg"
                onClick={() => router.push("/student-register")}
                variant="outline"
                className="border-blue text-blue hover:bg-blue/10 bg-transparent"
              >
                {language === "zh" ? "注册新账号" : "Register"}
              </Button>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link href="/" className="text-blue hover:text-blue/80 transition-colors">
                {language === "zh" ? "← 返回首页" : "← Back to Home"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
          <p className="mt-4 text-gray-600">{language === "zh" ? "加载中..." : "Loading..."}</p>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: Crown,
      title: language === "zh" ? "专属定制" : "Exclusive Customization",
      desc: language === "zh" ? "根据您的需求量身打造学习方案" : "Tailored learning plans based on your needs",
    },
    {
      icon: Users,
      title: language === "zh" ? "一对一顾问" : "Personal Consultant",
      desc: language === "zh" ? "专业顾问全程跟进您的学习进度" : "Professional consultants track your progress",
    },
    {
      icon: Sparkles,
      title: language === "zh" ? "高端服务" : "Premium Service",
      desc: language === "zh" ? "VIP专属服务，尊享学习体验" : "VIP exclusive service for premium experience",
    },
    {
      icon: MessageSquare,
      title: language === "zh" ? "灵活沟通" : "Flexible Communication",
      desc: language === "zh" ? "随时与客服沟通调整学习计划" : "Communicate with support anytime to adjust plans",
    },
  ]

  const services = [
    {
      title: language === "zh" ? "企业培训定制" : "Corporate Training",
      items: [
        language === "zh" ? "企业团队中文培训" : "Corporate team Chinese training",
        language === "zh" ? "商务中文专项课程" : "Business Chinese courses",
        language === "zh" ? "跨文化沟通培训" : "Cross-cultural communication",
      ],
      color: "orange",
    },
    {
      title: language === "zh" ? "个人VIP定制" : "Personal VIP",
      items: [
        language === "zh" ? "一对一专属教师" : "Exclusive 1-on-1 teacher",
        language === "zh" ? "个性化学习路径" : "Personalized learning path",
        language === "zh" ? "灵活上课时间" : "Flexible class schedule",
      ],
      color: "blue",
    },
    {
      title: language === "zh" ? "特殊需求定制" : "Special Requirements",
      items: [
        language === "zh" ? "考试备考强化" : "Exam preparation",
        language === "zh" ? "行业专业术语" : "Industry terminology",
        language === "zh" ? "特定场景训练" : "Specific scenario training",
      ],
      color: "orange",
    },
    {
      title: language === "zh" ? "文化体验定制" : "Cultural Experience",
      items: [
        language === "zh" ? "定制文化之旅" : "Customized cultural tours",
        language === "zh" ? "专属活动安排" : "Exclusive event arrangements",
        language === "zh" ? "深度文化体验" : "In-depth cultural experiences",
      ],
      color: "blue",
    },
  ]

  const benefits = [
    language === "zh" ? "专业顾问一对一需求分析" : "Professional 1-on-1 needs analysis",
    language === "zh" ? "量身定制学习方案" : "Tailored learning solutions",
    language === "zh" ? "优选匹配最适合的教师" : "Optimal teacher matching",
    language === "zh" ? "灵活调整课程内容和进度" : "Flexible content and pace adjustment",
    language === "zh" ? "全程跟踪学习效果" : "Full-cycle learning progress tracking",
    language === "zh" ? "专属客服7x24小时服务" : "Dedicated 24/7 customer service",
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange to-orange/80 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <Crown className="w-5 h-5" />
              <span className="text-sm font-medium">
                {language === "zh" ? "高端定制服务" : "Premium Custom Service"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === "zh" ? "定制课程" : "Customed Courses"}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {language === "zh"
                ? "根据您的独特需求，我们提供一对一的专属定制服务，为您打造最适合的中文学习方案"
                : "Based on your unique needs, we provide exclusive customized services to create the perfect Chinese learning solution for you"}
            </p>
            <Button
              size="lg"
              className="bg-blue hover:bg-blue/90 text-white"
              onClick={() => router.push("/contact")}
            >
              {language === "zh" ? "联系客服咨询" : "Contact Us"}
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
            {language === "zh" ? "定制服务特色" : "Custom Service Features"}
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

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
            {language === "zh" ? "定制服务类型" : "Custom Service Types"}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className={`text-2xl font-bold mb-4 ${service.color === "orange" ? "text-orange" : "text-blue"}`}>
                  {service.title}
                </h3>
                <ul className="space-y-3">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className={`mt-1 ${service.color === "orange" ? "text-orange" : "text-blue"}`}>•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
              {language === "zh" ? "选择定制服务的优势" : "Benefits of Custom Service"}
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              {language === "zh" ? "我们为您提供最专业、最贴心的定制化服务" : "We provide the most professional and caring customized services"}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <Check className="w-6 h-6 text-orange flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "zh" ? "立即开始您的定制之旅" : "Start Your Custom Journey Today"}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {language === "zh"
                ? "联系我们的客服团队，我们将为您量身打造专属的中文学习方案"
                : "Contact our customer service team and we'll create a personalized Chinese learning plan just for you"}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <div className="flex items-center gap-3 bg-white/10 rounded-lg px-6 py-3">
                <Phone className="w-6 h-6" />
                <span className="text-lg font-medium">+86 15701696836</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-lg px-6 py-3">
                <Mail className="w-6 h-6" />
                <span className="text-lg font-medium">info@mandarinwave.cn</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                className="bg-orange hover:bg-orange/90 text-white"
                onClick={() => router.push("/contact")}
              >
                {language === "zh" ? "联系客服" : "Contact Us"}
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-blue hover:bg-gray-100" onClick={() => router.back()}>
                {language === "zh" ? "返回上一页" : "Go Back"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

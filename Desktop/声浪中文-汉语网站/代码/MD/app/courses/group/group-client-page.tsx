"use client"
import { Users, MessageCircle, Trophy, Sparkles, Check, Lock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function GroupClientPage() {
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
    // Navigate to purchase page - use course key 'group' to find the course
    router.push(`/student-dashboard/purchase?course=group&package=${packageId}`)
  }

  const features = [
    {
      icon: Users,
      title: language === "zh" ? "小班教学" : "Small Class Size",
      desc: language === "zh" ? "4-6人小班，确保每位学员都能充分参与" : "4-6 students, ensuring full participation",
    },
    {
      icon: MessageCircle,
      title: language === "zh" ? "互动交流" : "Interactive Communication",
      desc: language === "zh" ? "与同学实时交流，提升口语能力" : "Real-time communication to improve speaking",
    },
    {
      icon: Trophy,
      title: language === "zh" ? "竞争激励" : "Competitive Motivation",
      desc: language === "zh" ? "良性竞争环境，激发学习动力" : "Healthy competition to boost motivation",
    },
    {
      icon: Sparkles,
      title: language === "zh" ? "文化交流" : "Cultural Exchange",
      desc: language === "zh" ? "结识来自世界各地的学习伙伴" : "Meet learning partners from around the world",
    },
  ]

  const packages = [
    {
      id: "trial",
      name: language === "zh" ? "免费试课" : "Free Trial",
      price: language === "zh" ? "¥0" : "¥0",
      duration: language === "zh" ? "1节one-on-one" : "1 One-on-One Class",
      features: [
        language === "zh" ? "45分钟一对一体验（线上或线下）" : "45-min one-on-one trial (online or offline)",
        language === "zh" ? "水平测试" : "Level assessment",
        language === "zh" ? "学习计划建议" : "Learning plan advice",
      ],
      color: "blue",
      popular: false,
    },
    {
      id: "package",
      name: language === "zh" ? "标准套餐" : "Standard Package",
      price: "¥4,200",
      duration: language === "zh" ? "10个工作日" : "10 Working Days",
      priceDetail: language === "zh" ? "¥105/节课 × 4节/天 × 10天" : "¥105/class × 4 classes/day × 10 days",
      features: [
        language === "zh" ? "每天4节课，共40节" : "4 classes per day, 40 classes total",
        language === "zh" ? "每节课45分钟" : "45-min per class",
        language === "zh" ? "4-6人小班" : "4-6 students",
        language === "zh" ? "课后作业辅导" : "Homework support",
        language === "zh" ? "全套学习资料+录播" : "Full materials + recordings",
        language === "zh" ? "每周测评报告" : "Weekly report",
      ],
      color: "orange",
      popular: true,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-orange text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === "zh" ? "小班课程" : "Small Group Classes"}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {language === "zh"
                ? "在互动中学习，在交流中进步，享受团队学习的乐趣"
                : "Learn through interaction, progress through communication, enjoy team learning"}
            </p>
            <Button
              size="lg"
              className="bg-blue hover:bg-blue/90 text-white"
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
            {language === "zh" ? "小班优势" : "Group Class Advantages"}
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

      {/* Class Types */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
            {language === "zh" ? "班级类型" : "Class Types"}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-orange">
                {language === "zh" ? "日常会话班" : "Daily Conversation"}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === "zh" ? "专注提升日常交流能力" : "Focus on daily communication skills"}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange mt-1">•</span>
                  <span className="text-gray-700">{language === "zh" ? "实用话题场景" : "Practical scenarios"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange mt-1">•</span>
                  <span className="text-gray-700">{language === "zh" ? "角色扮演练习" : "Role-play exercises"}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-blue">
                {language === "zh" ? "HSK备考班" : "HSK Preparation"}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === "zh" ? "系统化备考，提高通过率" : "Systematic prep for high pass rates"}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue mt-1">•</span>
                  <span className="text-gray-700">{language === "zh" ? "真题讲解" : "Past exam analysis"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue mt-1">•</span>
                  <span className="text-gray-700">{language === "zh" ? "应试技巧" : "Test-taking strategies"}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-orange">
                {language === "zh" ? "文化主题班" : "Cultural Themes"}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === "zh" ? "在文化中学习语言" : "Learn language through culture"}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange mt-1">•</span>
                  <span className="text-gray-700">{language === "zh" ? "传统节日" : "Traditional festivals"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange mt-1">•</span>
                  <span className="text-gray-700">{language === "zh" ? "历史故事" : "Historical stories"}</span>
                </li>
              </ul>
            </div>
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
            {language === "zh" ? "灵活的课程套餐，满足不同学习需求" : "Flexible packages for different learning needs"}
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white border-2 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow ${
                  pkg.popular ? "border-orange" : "border-gray-200"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {language === "zh" ? "最受欢迎" : "Most Popular"}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${pkg.color === "orange" ? "text-orange" : "text-blue"}`}>
                    {pkg.name}
                  </h3>
                  <div className="text-4xl font-bold text-black mb-2">{pkg.price}</div>
                  <div className="text-gray-600 mb-1">{pkg.duration}</div>
                  {pkg.priceDetail && <div className="text-sm text-gray-500">{pkg.priceDetail}</div>}
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
                  onClick={() => handleSelectPackage(pkg.id || `pkg-${index}`)}
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
      <section className="py-16 bg-orange text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "zh" ? "加入我们的学习社区" : "Join Our Learning Community"}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {language === "zh" ? "与来自世界各地的学习者一起进步" : "Progress together with learners worldwide"}
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue hover:bg-blue/90 text-white"
              onClick={() => handleSelectPackage("trial")}
            >
              {t.buttons.bookTrial}
            </Button>
            <Link href="/">
              <Button size="lg" variant="outline" className="bg-white text-orange hover:bg-gray-100">
                {language === "zh" ? "返回首页" : "Back to Home"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

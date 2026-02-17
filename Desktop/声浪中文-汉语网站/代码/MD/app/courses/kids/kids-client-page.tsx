"use client"
import { Baby, Gamepad2, Music, Palette, Check, Lock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function KidsClientPage() {
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
    // Navigate to purchase page - use course key 'kids' to find the course
    router.push(`/student-dashboard/purchase?course=kids&package=${packageId}`)
  }

  const features = [
    {
      icon: Gamepad2,
      title: language === "zh" ? "游戏化学习" : "Gamified Learning",
      desc: language === "zh" ? "通过游戏激发孩子学习兴趣" : "Spark interest through games",
    },
    {
      icon: Music,
      title: language === "zh" ? "儿歌教学" : "Songs & Rhymes",
      desc: language === "zh" ? "在歌谣中轻松学习中文" : "Learn Chinese through songs",
    },
    {
      icon: Palette,
      title: language === "zh" ? "创意活动" : "Creative Activities",
      desc: language === "zh" ? "绘画、手工等趣味活动" : "Drawing, crafts and more",
    },
    {
      icon: Baby,
      title: language === "zh" ? "分龄教学" : "Age-Appropriate",
      desc: language === "zh" ? "根据年龄定制教学方法" : "Customized by age group",
    },
  ]

  const packages = [
    {
      id: "trial",
      name: language === "zh" ? "免费试课" : "Free Trial",
      price: language === "zh" ? "¥0" : "¥0",
      duration: language === "zh" ? "1节课" : "1 Class",
      features: [
        language === "zh" ? "30分钟趣味体验" : "30-min fun trial",
        language === "zh" ? "水平评估" : "Level assessment",
        language === "zh" ? "学习规划" : "Learning plan",
      ],
      color: "blue",
      popular: false,
    },
    {
      id: "10-classes",
      name: language === "zh" ? "10课时套餐" : "10 Classes",
      price: "¥1,860",
      duration: language === "zh" ? "10节课" : "10 Classes",
      features: [
        language === "zh" ? "每节课30分钟" : "30-min per class",
        language === "zh" ? "1对1互动教学" : "1-on-1 interactive",
        language === "zh" ? "游戏化学习" : "Gamified learning",
        language === "zh" ? "儿歌+绘本" : "Songs + picture books",
      ],
      color: "orange",
      popular: false,
    },
    {
      id: "30-classes",
      name: language === "zh" ? "30课时套餐" : "30 Classes",
      price: "¥4,760",
      duration: language === "zh" ? "30节课" : "30 Classes",
      features: [
        language === "zh" ? "每节课30分钟" : "30-min per class",
        language === "zh" ? "1对1互动教学" : "1-on-1 interactive",
        language === "zh" ? "游戏+手工活动" : "Games + crafts",
        language === "zh" ? "分级阅读训练" : "Leveled reading",
        language === "zh" ? "家长学习报告" : "Parent reports",
      ],
      color: "blue",
      popular: true,
    },
    {
      id: "50-classes",
      name: language === "zh" ? "50课时套餐" : "50 Classes",
      price: "¥6,810",
      duration: language === "zh" ? "50节课" : "50 Classes",
      features: [
        language === "zh" ? "每节课30分钟" : "30-min per class",
        language === "zh" ? "1对1互动教学" : "1-on-1 interactive",
        language === "zh" ? "全方位能力培养" : "Comprehensive training",
        language === "zh" ? "定期测评报告" : "Regular assessments",
        language === "zh" ? "专属学习顾问" : "Learning advisor",
      ],
      color: "orange",
      popular: false,
    },
    {
      id: "80-classes",
      name: language === "zh" ? "80课时套餐" : "80 Classes",
      price: "¥9,400",
      duration: language === "zh" ? "80节课" : "80 Classes",
      features: [
        language === "zh" ? "每节课30分钟" : "30-min per class",
        language === "zh" ? "1对1互动教学" : "1-on-1 interactive",
        language === "zh" ? "HSK考试准备" : "HSK preparation",
        language === "zh" ? "定期测评报告" : "Regular assessments",
        language === "zh" ? "专属学习顾问" : "Learning advisor",
        language === "zh" ? "个性化学习计划" : "Personalized plan",
      ],
      color: "blue",
      popular: false,
    },
    {
      id: "100-classes",
      name: language === "zh" ? "100课时套餐" : "100 Classes",
      price: "¥10,820",
      duration: language === "zh" ? "100节课" : "100 Classes",
      features: [
        language === "zh" ? "每节课30分钟" : "30-min per class",
        language === "zh" ? "1对1互动教学" : "1-on-1 interactive",
        language === "zh" ? "HSK考试准备" : "HSK preparation",
        language === "zh" ? "定期测评报告" : "Regular assessments",
        language === "zh" ? "专属学习顾问" : "Learning advisor",
        language === "zh" ? "个性化学习计划" : "Personalized plan",
        language === "zh" ? "优先课程预约" : "Priority booking",
      ],
      color: "orange",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-orange text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === "zh" ? "少儿中文课程" : "Kids' Chinese Course"}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {language === "zh"
                ? "让孩子在快乐中学习中文，在游戏中掌握语言"
                : "Let children learn Chinese happily through games"}
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
            {language === "zh" ? "课程特色" : "Course Features"}
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

      {/* Age Groups */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
            {language === "zh" ? "年龄分组" : "Age Groups"}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🧒</div>
              <h3 className="text-2xl font-bold mb-4 text-blue">{language === "zh" ? "6-8岁" : "6-8 Years"}</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• {language === "zh" ? "拼音和汉字系统学习" : "Systematic Pinyin and characters"}</li>
                <li>• {language === "zh" ? "阅读理解训练" : "Reading comprehension"}</li>
                <li>• {language === "zh" ? "基础写作练习" : "Basic writing practice"}</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">👦</div>
              <h3 className="text-2xl font-bold mb-4 text-orange">{language === "zh" ? "9-12岁" : "9-12 Years"}</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• {language === "zh" ? "进阶汉字和词汇" : "Advanced characters and vocabulary"}</li>
                <li>• {language === "zh" ? "文章阅读和写作" : "Article reading and writing"}</li>
                <li>• {language === "zh" ? "HSK考试准备" : "HSK exam preparation"}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
            {language === "zh" ? "选择适合孩子的套餐" : "Choose the Right Package"}
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            {language === "zh" ? "根据孩子年龄和水平，选择合适的学习方案" : "Choose based on age and level"}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
                  <div className="text-3xl font-bold text-black mb-1">{pkg.price}</div>
                  <div className="text-gray-600">{pkg.duration}</div>
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
            {language === "zh" ? "给孩子最好的中文启蒙" : "Give Your Child the Best Chinese Start"}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {language === "zh"
              ? "专业少儿中文教师，让学习变得有趣"
              : "Professional kids Chinese teachers make learning fun"}
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

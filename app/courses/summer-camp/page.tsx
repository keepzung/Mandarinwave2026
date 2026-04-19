"use client"

import { Sun, Palmtree, Users, Calendar, ArrowLeft, Home, Check, ShoppingBag, Clock, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SummerCampPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

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

  const timeSlots = [
    {
      id: "第一期",
      name_zh: "第一期",
      name_en: "Session 1",
      dates_zh: "6月22日 - 7月3日",
      dates_en: "Jun 22 - Jul 3",
      days_zh: "周一至周五",
      days_en: "Monday to Friday",
    },
    {
      id: "第二期",
      name_zh: "第二期",
      name_en: "Session 2",
      dates_zh: "7月13日 - 7月24日",
      dates_en: "Jul 13 - Jul 24",
      days_zh: "周一至周五",
      days_en: "Monday to Friday",
    },
    {
      id: "第三期",
      name_zh: "第三期",
      name_en: "Session 3",
      dates_zh: "8月3日 - 8月14日",
      dates_en: "Aug 3 - Aug 14",
      days_zh: "周一至周五",
      days_en: "Monday to Friday",
    },
  ]

  const priceOptions = [
    {
      id: "early-bird",
      name_zh: "早鸟价",
      name_en: "Early Bird",
      price: 26000,
      discount_zh: "限时优惠",
      discount_en: "Flash Sale",
    },
    {
      id: "standard",
      name_zh: "标准价",
      name_en: "Standard Price",
      price: 28000,
      discount_zh: "",
      discount_en: "",
    },
  ]

  const handlePurchase = async (timeSlotId: string, priceId: string) => {
    const slot = timeSlots.find((s) => s.id === timeSlotId)
    const priceOption = priceOptions.find((p) => p.id === priceId)
    const slug = timeSlotId.toLowerCase().replace(/\s+/g, "-")
    const packageId = `summer-camp-${slug}-${priceId}`.replace(/\s+/g, "-")
    const displayName = language === "zh"
      ? `${timeSlotId}-${priceOption?.name_zh || priceId}`
      : `${slot?.name_en || timeSlotId}-${priceOption?.name_en || priceId}`

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const price = priceId === "early-bird" ? 26000 : 28000

    const courseId = "summer-camp"

    router.push(
      `/payment?courseId=${courseId}&courseName=${encodeURIComponent(displayName)}&packageId=${packageId}&packageName=${encodeURIComponent(displayName)}&classCount=0&price=${price}&validityDays=0&orderNumber=${orderNumber}`
    )
  }

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

      {/* Program Introduction - Chinese Version */}
      {language === "zh" && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-black">
              项目介绍
            </h2>
            <div className="max-w-7xl mx-auto overflow-hidden rounded-xl shadow-lg">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
                <img
                  key={i}
                  src={`/images/summer-camp-program-zh-${i}.png`}
                  alt={`夏令营项目介绍 ${i}`}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Program Introduction - English Version */}
      {language === "en" && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-black">
              Program Introduction
            </h2>
            <div className="max-w-7xl mx-auto overflow-hidden rounded-xl shadow-lg">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
                <img
                  key={i}
                  src={`/images/summer-camp-program-en-${i}.png`}
                  alt={`Summer Camp Program Introduction ${i}`}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Packages Selection */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
            {language === "zh" ? "选择您的夏令营时段" : "Choose Your Summer Camp Period"}
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            {language === "zh"
              ? "选择最适合您的时间段，并选择价格类型"
              : "Select your preferred time period and price option"}
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className="bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all p-6"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-black">
                    {language === "zh" ? slot.name_zh : slot.name_en}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {language === "zh" ? slot.dates_zh : slot.dates_en}
                  </p>
                  <p className="text-gray-500 text-sm">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {language === "zh" ? slot.days_zh : slot.days_en}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {language === "zh" ? "选择价格类型" : "Select Price Type"}
                  </p>
                  {priceOptions.map((price) => (
                    <div
                      key={price.id}
                      onClick={() => handlePurchase(slot.id, price.id)}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange hover:bg-orange/5 cursor-pointer transition-colors"
                    >
                      <span className="font-medium text-gray-700">
                        {language === "zh" ? price.name_zh : price.name_en}
                      </span>
                      <div className="text-right">
                        <div className="font-bold text-orange text-lg">¥{price.price.toLocaleString()}</div>
                        {price.discount_zh && language === "zh" && (
                          <div className="text-xs text-orange-600">{price.discount_zh}</div>
                        )}
                        {price.discount_en && language === "en" && (
                          <div className="text-xs text-orange-600">{price.discount_en}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handlePurchase(slot.id, "early-bird")}
                  className="w-full bg-orange hover:bg-orange/90 text-white"
                >
                  {language === "zh" ? "立即预订" : "Book Now"}
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
            <Button
              size="lg"
              onClick={() => handlePurchase("第一期", "early-bird")}
              className="bg-white text-orange hover:bg-gray-100"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {language === "zh" ? "立即购买" : "Buy Now"}
            </Button>
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

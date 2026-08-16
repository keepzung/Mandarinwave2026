"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const CAROUSEL_IMAGES = [
  "/images/carousel/1.jpg",
  "/images/carousel/3.jpg",
  "/images/carousel/4.jpg",
  "/images/carousel/5.jpg",
  "/images/carousel/6.jpg",
  "/images/carousel/7.png",
]

const AUTOPLAY_MS = 4000

export function Carousel() {
  const { language } = useLanguage()
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState<Record<number, boolean>>({})

  const total = CAROUSEL_IMAGES.length

  useEffect(() => {
    if (paused || total <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total)
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [paused, total])

  const goTo = (index: number) => setCurrent(((index % total) + total) % total)

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-200 h-64 md:h-80"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {CAROUSEL_IMAGES.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {failed[index] ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-500 bg-gray-100">
              <ImageIcon className="w-10 h-10" />
              <span className="text-sm font-medium">
                {language === "zh" ? `轮播图 ${index + 1}` : `Slide ${index + 1}`}
              </span>
              <span className="text-xs text-gray-400">public{src}</span>
            </div>
          ) : (
            <img
              src={src}
              alt={`${language === "zh" ? "轮播图" : "Slide"} ${index + 1}`}
              className="w-full h-full object-cover"
              onError={() => setFailed((prev) => ({ ...prev, [index]: true }))}
            />
          )}
        </div>
      ))}

      <button
        type="button"
        aria-label={language === "zh" ? "上一张" : "Previous slide"}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
        onClick={() => goTo(current - 1)}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        aria-label={language === "zh" ? "下一张" : "Next slide"}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
        onClick={() => goTo(current + 1)}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {CAROUSEL_IMAGES.map((src, index) => (
          <button
            key={src}
            type="button"
            aria-label={`${language === "zh" ? "跳转到第" : "Go to slide"} ${index + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === current ? "bg-white" : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  )
}

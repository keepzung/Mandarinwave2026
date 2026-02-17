"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, Globe, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [userDropdownTimeout, setUserDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const { language, setLanguage } = useLanguage()
  const t = useTranslation(language)
  const { user, logout } = useAuth()

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("contact")
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  const handleUserDropdownEnter = () => {
    if (userDropdownTimeout) {
      clearTimeout(userDropdownTimeout)
      setUserDropdownTimeout(null)
    }
    setUserDropdownOpen(true)
  }

  const handleUserDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setUserDropdownOpen(false)
    }, 300) // 300ms delay before closing
    setUserDropdownTimeout(timeout)
  }

  const coursesMenuItems = [
    { key: "online", label: t.courses.online.title },
    { key: "group", label: t.courses.group.title },
    { key: "hsk", label: t.courses.hsk.title },
    { key: "business", label: t.courses.business.title },
    { key: "kids", label: t.courses.kids.title },
    { key: "summerCamp", label: t.courses.summerCamp.title },
    { key: "winterCamp", label: t.courses.winterCamp.title },
    { key: "culture", label: t.courses.culture.title },
    { key: "cityTour", label: t.courses.cityTour.title },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="MandarinWave Logo" width={64} height={64} className="w-16 h-16" />
            <div className="flex flex-col items-center text-center leading-none">
              <div className="text-black font-bold text-base leading-none">Mandarin</div>
              <div className="text-black font-bold text-base leading-none -mt-1">wave</div>
              <div className="text-orange text-[10px] font-medium tracking-wide">声｜浪｜中｜文</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <div
              className="relative pb-2"
              onMouseEnter={() => setCoursesDropdownOpen(true)}
              onMouseLeave={() => setCoursesDropdownOpen(false)}
            >
              <button className="text-gray-700 hover:text-orange transition-colors font-medium flex items-center gap-1">
                {t.nav.courses}
                <ChevronDown className="w-4 h-4" />
              </button>
              {coursesDropdownOpen && (
                <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  {coursesMenuItems.map((item) => (
                    <a
                      key={item.key}
                      href="#courses"
                      className="block px-4 py-2 text-gray-700 hover:bg-orange/10 hover:text-orange transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a href="#mission" className="text-gray-700 hover:text-orange transition-colors font-medium">
              {t.nav.mission}
            </a>
            <a href="#reviews" className="text-gray-700 hover:text-orange transition-colors font-medium">
              {t.nav.reviews}
            </a>
            <a href="#contact" className="text-gray-700 hover:text-orange transition-colors font-medium">
              {t.nav.contact}
            </a>
          </nav>

          {/* CTA Buttons & Language Toggle */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
            >
              <Globe className="w-4 h-4" />
              {language === "zh" ? "EN" : "中文"}
            </Button>
            {user ? (
              <div className="relative" onMouseEnter={handleUserDropdownEnter} onMouseLeave={handleUserDropdownLeave}>
                <button className="flex items-center gap-2 text-gray-700 hover:text-orange transition-colors">
                  <div className="w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center font-bold">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                  </div>
                  <span className="font-medium">{user.name || user.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {userDropdownOpen && (
                  <div className="absolute top-full right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 mt-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-900">{user.name || user.email}</div>
                      <div className="text-xs text-gray-500">
                        {user.role === "admin"
                          ? language === "zh"
                            ? "管理员"
                            : "Admin"
                          : language === "zh"
                            ? "学生"
                            : "Student"}
                      </div>
                    </div>
                    <a
                      href={user.role === "admin" ? "/admin" : "/student-dashboard"}
                      className="block px-4 py-2 text-gray-700 hover:bg-orange/10 hover:text-orange transition-colors"
                    >
                      {language === "zh" ? "我的控制台" : "Dashboard"}
                    </a>
                    <a
                      href="/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-orange/10 hover:text-orange transition-colors"
                    >
                      {language === "zh" ? "切换账号" : "Switch Account"}
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange/10 hover:text-orange transition-colors"
                    >
                      {language === "zh" ? "退出登录" : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-orange hover:bg-orange/10"
                onClick={() => (window.location.href = "/login")}
              >
                {t.buttons.login}
              </Button>
            )}
            <Button className="bg-blue hover:bg-blue/90 text-white shadow-lg" onClick={scrollToBooking}>
              {t.buttons.bookTrial}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-gray-700 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              {user && (
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-orange text-white flex items-center justify-center font-bold text-lg">
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name || user.email}</div>
                      <div className="text-sm text-gray-500">
                        {user.role === "admin"
                          ? language === "zh"
                            ? "管理员"
                            : "Admin"
                          : language === "zh"
                            ? "学生"
                            : "Student"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href={user.role === "admin" ? "/admin" : "/student-dashboard"}
                      className="text-gray-700 hover:text-orange transition-colors py-2 font-medium"
                    >
                      {language === "zh" ? "我的控制台" : "Dashboard"}
                    </a>
                    <a href="/login" className="text-gray-700 hover:text-orange transition-colors py-2 font-medium">
                      {language === "zh" ? "切换账号" : "Switch Account"}
                    </a>
                    <button
                      onClick={handleLogout}
                      className="text-left text-gray-700 hover:text-orange transition-colors py-2 font-medium"
                    >
                      {language === "zh" ? "退出登录" : "Logout"}
                    </button>
                  </div>
                </div>
              )}
              <div>
                <button
                  onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                  className="text-gray-700 hover:text-orange transition-colors py-2 font-medium flex items-center justify-between w-full"
                >
                  {t.nav.courses}
                  <ChevronDown className={`w-4 h-4 transition-transform ${coursesDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {coursesDropdownOpen && (
                  <div className="pl-4 mt-2 flex flex-col gap-2">
                    {coursesMenuItems.map((item) => (
                      <a
                        key={item.key}
                        href="#courses"
                        className="text-gray-600 hover:text-orange transition-colors py-1.5"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <a href="#mission" className="text-gray-700 hover:text-orange transition-colors py-2 font-medium">
                {t.nav.mission}
              </a>
              <a href="#reviews" className="text-gray-700 hover:text-orange transition-colors py-2 font-medium">
                {t.nav.reviews}
              </a>
              <a href="#contact" className="text-gray-700 hover:text-orange transition-colors py-2 font-medium">
                {t.nav.contact}
              </a>
              <Button
                variant="outline"
                className="gap-2 w-full justify-center bg-transparent"
                onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
              >
                <Globe className="w-4 h-4" />
                {language === "zh" ? "English" : "中文"}
              </Button>
              {!user && (
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full bg-transparent"
                  onClick={() => (window.location.href = "/login")}
                >
                  {t.buttons.login}
                </Button>
              )}
              <Button className="bg-blue hover:bg-blue/90 text-white w-full" onClick={scrollToBooking}>
                {t.buttons.bookTrial}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

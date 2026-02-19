"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { BookOpen, Users, Briefcase, Award, GraduationCap, Globe, ArrowRight } from "lucide-react"
import { Suspense } from "react"

interface Course {
  id: string
  course_key: string
  title_zh: string
  title_en: string
  description_zh: string
  description_en: string
  category: string
  icon: string
  color: string
  href: string
}

export default function CoursePurchasePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CoursePurchaseContent />
    </Suspense>
  )
}

function CoursePurchaseContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [courseKey, setCourseKey] = useState<string | null>(null)
  const [packageId, setPackageId] = useState<string | null>(null)

  // Get URL params on client side only
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setCourseKey(params.get("course"))
    setPackageId(params.get("package"))
  }, [])

  useEffect(() => {
    loadCourses()
  }, [])
  
  // If course key is provided, find the course and redirect to purchase page
  useEffect(() => {
    if (courseKey && courses.length > 0) {
      const course = courses.find(c => c.course_key === courseKey)
      if (course) {
        const redirectUrl = packageId 
          ? `/student-dashboard/purchase/${course.id}?package=${packageId}`
          : `/student-dashboard/purchase/${course.id}`
        router.push(redirectUrl)
      }
    }
  }, [courseKey, packageId, courses, router])

  const loadCourses = async () => {
    try {
      const supabase = createBrowserClient()

      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)

      if (error) {
        console.error("[v0] Error loading courses:", error)
        setCourses([])
      } else {
        // Sort courses to match homepage order
        const courseOrder = ["group", "one-on-one", "kids", "hsk", "culture", "business", "winter-camp", "summer-camp", "city-tour"]
        const sorted = (data || []).sort((a, b) => {
          const indexA = courseOrder.indexOf(a.course_key)
          const indexB = courseOrder.indexOf(b.course_key)
          return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
        })
        setCourses(sorted)
      }
    } catch (err) {
      console.error("[v0] Exception loading courses:", err)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "user":
        return <BookOpen className="w-8 h-8" />
      case "users":
        return <Users className="w-8 h-8" />
      case "briefcase":
        return <Briefcase className="w-8 h-8" />
      case "award":
        return <Award className="w-8 h-8" />
      case "graduation":
        return <GraduationCap className="w-8 h-8" />
      default:
        return <Globe className="w-8 h-8" />
    }
  }

  const handleSelectCourse = (course: Course) => {
    // For customed courses (culture), redirect to the contact page instead of purchase
    if (course.course_key === "culture") {
      router.push("/courses/culture")
      return
    }
    router.push(`/student-dashboard/purchase/${course.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/5 via-white to-orange/5">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === "zh" ? "选择课程" : "Choose Your Course"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {language === "zh" ? "选择您感兴趣的课程类型" : "Select the course type you're interested in"}
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push("/student-dashboard")}>
              {language === "zh" ? "返回" : "Back"}
            </Button>
          </div>
        </div>
      </div>

      {/* Course Selection */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="border-2 hover:border-blue hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleSelectCourse(course)}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue/20 transition-colors">
                    <div className="text-blue">{getIcon(course.icon)}</div>
                  </div>
                  <CardTitle className="text-xl">{language === "zh" ? course.title_zh : course.title_en}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-6">
                    {language === "zh" ? course.description_zh : course.description_en}
                  </p>
                  <Button className="w-full bg-orange hover:bg-orange/90 group-hover:bg-blue group-hover:text-white transition-colors">
                    {language === "zh" ? "查看套餐" : "View Packages"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">{language === "zh" ? "暂无可用课程" : "No courses available"}</p>
          </div>
        )}
      </div>
    </div>
  )
}

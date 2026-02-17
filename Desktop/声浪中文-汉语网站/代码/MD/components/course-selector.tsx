"use client"

import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"

interface Course {
  id: string
  course_key: string
  title_zh: string
  title_en: string
  description_zh: string
  description_en: string
  category: string
  color: string
}

interface CourseSelectorProps {
  selectedCourses: string[]
  onSelectionChange: (courseIds: string[]) => void
  multiple?: boolean
  label?: string
}

export function CourseSelector({ selectedCourses, onSelectionChange, multiple = true, label }: CourseSelectorProps) {
  const { language } = useLanguage()
  const t = useTranslation(language)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async (retryCount = 0) => {
    const MAX_RETRIES = 3

    try {
      let supabase
      try {
        supabase = createBrowserClient()
      } catch (clientError: any) {
        console.error("[v0] Failed to create Supabase client:", clientError)
        setError(
          language === "zh"
            ? "数据库连接配置错误，请联系管理员。"
            : "Database configuration error. Please contact administrator.",
        )
        setLoading(false)
        return
      }

      console.log("[v0] Querying courses from database... (attempt", retryCount + 1, ")")
      const { data, error: queryError } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .order("course_key")

      if (queryError) {
        throw queryError
      }

      console.log("[v0] Courses loaded:", data?.length || 0)

      if (!data || data.length === 0) {
        console.log("[v0] No courses found in database.")
        setError(
          language === "zh"
            ? "暂无可用课程，请联系管理员添加课程。"
            : "No courses available. Please contact administrator.",
        )
      } else {
        setCourses(data)
        setError(null)
      }
      setLoading(false)
    } catch (err: any) {
      console.error("[v0] Error loading courses (attempt", retryCount + 1, "):", err)

      // Retry on network errors
      if (retryCount < MAX_RETRIES && (err.message?.includes("fetch") || err.message?.includes("network"))) {
        console.log("[v0] Retrying in 1 second...")
        setTimeout(() => loadCourses(retryCount + 1), 1000)
        return
      }

      setError(
        language === "zh"
          ? `加载课程失败：${err.message || "网络连接错误，请刷新页面重试"}`
          : `Failed to load courses: ${err.message || "Network error, please refresh the page"}`,
      )
      setLoading(false)
    }
  }

  const handleToggle = (courseId: string) => {
    if (multiple) {
      if (selectedCourses.includes(courseId)) {
        onSelectionChange(selectedCourses.filter((id) => id !== courseId))
      } else {
        onSelectionChange([...selectedCourses, courseId])
      }
    } else {
      onSelectionChange([courseId])
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-500">{language === "zh" ? "加载课程..." : "Loading courses..."}</div>
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">{language === "zh" ? "暂无可用课程。" : "No courses available yet."}</p>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label || (language === "zh" ? "选择感兴趣的课程" : "Select Courses of Interest")}
        {multiple && (
          <span className="text-gray-500 ml-2 font-normal">
            ({language === "zh" ? "可多选" : "Multiple selection allowed"})
          </span>
        )}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {courses.map((course) => {
          const isSelected = selectedCourses.includes(course.id)
          const title = language === "zh" ? course.title_zh : course.title_en
          const desc = language === "zh" ? course.description_zh : course.description_en

          return (
            <button
              key={course.id}
              type="button"
              onClick={() => handleToggle(course.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? course.color === "blue"
                    ? "border-blue bg-blue/10"
                    : "border-orange bg-orange/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-gray-900">{title}</div>
              <div className="text-sm text-gray-600 mt-1">{desc}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

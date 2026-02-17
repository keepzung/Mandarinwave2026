'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

export default function NewsPage() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  const newsItems = language === 'zh' ? [
    {
      id: 1,
      title: '声浪中文突破10,000名学员里程碑',
      date: '2024年3月15日',
      author: '市场部',
      image: '/chinese-language-students-celebrating.jpg',
      excerpt: '我们很高兴地宣布，声浪中文的活跃学员数量已突破10,000名，覆盖全球80多个国家和地区。这一里程碑标志着我们在全球中文教育领域的重要进展。',
      content: '自成立以来，声浪中文一直致力于为全球学习者提供高质量的中文教育。通过创新的教学方法和先进的技术平台，我们成功帮助数千名学员实现了他们的中文学习目标。'
    },
    {
      id: 2,
      title: '推出全新HSK备考课程',
      date: '2024年2月28日',
      author: '教研团队',
      image: '/hsk-exam-preparation-materials.jpg',
      excerpt: '为了更好地帮助学员通过HSK考试，我们推出了全新的HSK备考课程系列，涵盖HSK 1-6级，采用最新考试大纲。',
      content: '新课程由经验丰富的HSK考试专家团队设计，结合了最新的考试趋势和教学方法。课程内容包括真题解析、应试技巧、模拟测试等，帮助学员高效备考。'
    },
    {
      id: 3,
      title: '声浪中文获得"最佳在线中文教育平台"奖',
      date: '2024年1月20日',
      author: '新闻发布',
      image: '/education-award-ceremony.jpg',
      excerpt: '在2024年度国际在线教育大会上，声浪中文荣获"最佳在线中文教育平台"奖项，这是对我们团队努力和创新的认可。',
      content: '该奖项表彰了声浪中文在教学质量、技术创新和学员满意度方面的卓越表现。我们将继续努力，为全球学习者提供更优质的中文教育服务。'
    },
    {
      id: 4,
      title: '与国际学校建立战略合作伙伴关系',
      date: '2023年12月10日',
      author: '合作部',
      image: '/international-school-partnership.jpg',
      excerpt: '声浪中文与多所国际学校签署战略合作协议，为其学生提供专业的中文课程和教师培训服务。',
      content: '此次合作将帮助更多国际学校的学生接触到高质量的中文教育，同时也为我们的教师提供了更广阔的教学平台。'
    }
  ] : [
    {
      id: 1,
      title: 'MandarinWave Reaches 10,000 Students Milestone',
      date: 'March 15, 2024',
      author: 'Marketing Team',
      image: '/chinese-language-students-celebrating.jpg',
      excerpt: "We're thrilled to announce that MandarinWave has reached 10,000 active students across 80+ countries and regions. This milestone marks a significant advancement in global Chinese education.",
      content: "Since our founding, MandarinWave has been committed to providing high-quality Chinese education to learners worldwide. Through innovative teaching methods and advanced technology platforms, we've successfully helped thousands of students achieve their Chinese learning goals."
    },
    {
      id: 2,
      title: 'Launching New HSK Preparation Courses',
      date: 'February 28, 2024',
      author: 'Curriculum Team',
      image: '/hsk-exam-preparation-materials.jpg',
      excerpt: 'To better help students pass the HSK exam, we are launching a new series of HSK preparation courses covering HSK levels 1-6, using the latest exam syllabus.',
      content: 'The new courses are designed by experienced HSK exam experts, combining the latest exam trends and teaching methods. Course content includes real question analysis, test-taking strategies, and mock tests to help students prepare efficiently.'
    },
    {
      id: 3,
      title: 'MandarinWave Wins "Best Online Chinese Education Platform" Award',
      date: 'January 20, 2024',
      author: 'Press Release',
      image: '/education-award-ceremony.jpg',
      excerpt: "At the 2024 International Online Education Conference, MandarinWave was honored with the 'Best Online Chinese Education Platform' award, recognizing our team's efforts and innovation.",
      content: "This award recognizes MandarinWave's excellence in teaching quality, technological innovation, and student satisfaction. We will continue to work hard to provide better Chinese education services to learners worldwide."
    },
    {
      id: 4,
      title: 'Strategic Partnership with International Schools',
      date: 'December 10, 2023',
      author: 'Partnership Team',
      image: '/international-school-partnership.jpg',
      excerpt: 'MandarinWave has signed strategic cooperation agreements with multiple international schools to provide professional Chinese courses and teacher training services for their students.',
      content: 'This partnership will help more international school students access high-quality Chinese education while providing our teachers with a broader teaching platform.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue text-white py-20">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="outline" className="mb-6 bg-white text-blue border-white hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'zh' ? '返回首页' : 'Back to Home'}
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === 'zh' ? '新闻动态' : 'News & Updates'}
          </h1>
          <p className="text-xl text-white/90">
            {language === 'zh' ? '了解声浪中文的最新动态和发展' : 'Stay updated with the latest news from MandarinWave'}
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {newsItems.map((item) => (
              <article 
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image || "/placeholder.svg"} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{item.author}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-3 group-hover:text-orange transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {item.excerpt}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

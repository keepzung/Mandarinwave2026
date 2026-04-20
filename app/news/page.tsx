'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { Button } from '@/components/ui/button'

export default function NewsPage() {
  const { language } = useLanguage()
  const isZh = language === 'zh'

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue text-white py-20">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="outline" className="mb-6 bg-white text-blue border-white hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isZh ? '返回首页' : 'Back to Home'}
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {isZh ? '重大喜讯！' : 'Exciting News!'}
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white/90">
            {isZh
              ? '声浪中文正式成为中国德国商会\u201C商会之友\u201D'
              : 'Mandarin Wave Officially Becomes a "Friend of the German Chamber of Commerce in China"'}
          </h2>
          <div className="flex items-center gap-2 text-white/70">
            <Calendar className="w-4 h-4" />
            <span>{isZh ? '2026年3月16日' : 'March 16, 2026'}</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Opening */}
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {isZh
              ? '我们非常高兴地向大家分享一则好消息：自2026年3月16日起，声浪中文已正式被认定为中国德国商会的\u201C商会之友\u201D！这份由执行董事兼董事会成员Oliver Oehms先生签署的荣誉证书，标志着我们在持续服务国际商界社区的道路上迈出了重要的一步。'
              : 'We are thrilled to share some exciting news with our community: as of March 16, 2026, Mandarin Wave has been officially acknowledged as a Friend of the German Chamber of Commerce in China! This prestigious certificate, signed by Mr. Oliver Oehms, Executive Director and Board Member, marks a significant milestone in our ongoing commitment to serving the international business community.'}
          </p>

          {/* Image 1 */}
          <div className="mb-12 rounded-xl overflow-hidden shadow-md">
            <img src="/images/news-blog-1.png" alt="" className="w-full h-auto" loading="lazy" />
          </div>

          {/* Bridging Language and Culture */}
          <h3 className="text-2xl font-bold text-black mb-4">
            {isZh ? '语言与文化的桥梁' : 'Bridging Language and Culture'}
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {isZh
              ? '中国德国商会是中德商业关系的重要枢纽，汇聚了在华运营的优秀企业。成为\u201C商会之友\u201D不仅是对我们服务质量的极大认可，更是深化与德国及更广泛国际商业网络合作的新起点。'
              : 'The German Chamber of Commerce is a vital hub for Sino-German business relations, bringing together outstanding enterprises operating in China. Joining as a "Friend of the Chamber" is not only a tremendous recognition of the quality of our services but also a new starting point for deepening our collaboration with the German and broader international business networks.'}
          </p>

          {/* Image 2 */}
          <div className="mb-12 rounded-xl overflow-hidden shadow-md">
            <img src="/images/news-blog-2.png" alt="" className="w-full h-auto" loading="lazy" />
          </div>

          {/* Empowering the Expatriate Community */}
          <h3 className="text-2xl font-bold text-black mb-4">
            {isZh ? '赋能外籍人士社区' : 'Empowering the Expatriate Community'}
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            {isZh
              ? '声浪中文总部位于北京，是一家为国际社区提供全方位汉语及文化融合服务的专业机构。我们深知，对于外籍人士及其家庭而言，语言和文化不仅是沟通的工具，更是充分融入并在新环境中茁壮成长的关键。'
              : 'Headquartered in Beijing, Mandarin Wave is a professional institution providing comprehensive Chinese language and cultural integration services for the international business community. We understand that for expatriates and their families, language and culture are more than just tools for communication\u2014they are the keys to fully integrating and thriving in a new environment.'}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-2">
            {isZh
              ? '为帮助客户实现这一目标，我们提供结构化的线上线下语言解决方案，包括：'
              : 'To help our clients achieve this, we deliver structured online and offline language solutions, encompassing:'}
          </p>
          <ul className="list-disc pl-6 text-lg text-gray-700 leading-relaxed mb-4 space-y-1">
            <li>{isZh ? '商务汉语：助您从容应对职场沟通' : 'Business Chinese: to help you navigate the corporate landscape.'}</li>
            <li>{isZh ? 'HSK备考：系统提升语言能力' : 'HSK Preparation: for systematic language proficiency.'}</li>
            <li>{isZh ? '专属课程：为成人和儿童量身定制' : 'Specialized Curricula: tailored for both adults and children.'}</li>
          </ul>
          <p className="text-lg text-gray-700 leading-relaxed mb-2">
            {isZh
              ? '为促进更深层次的文化参与，我们的服务延伸至课堂之外：'
              : 'To foster deeper cultural engagement, our service portfolio extends beyond the classroom to include:'}
          </p>
          <ul className="list-disc pl-6 text-lg text-gray-700 leading-relaxed mb-4 space-y-1">
            <li>{isZh ? '沉浸式青少年夏令营与冬令营' : 'Immersive youth summer and winter camps.'}</li>
            <li>{isZh ? '精选本地旅游项目' : 'Curated local tourism projects.'}</li>
            <li>{isZh ? '独具特色的中西合璧文化产品' : 'Distinctive East-meets-West cultural products.'}</li>
          </ul>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {isZh
              ? '我们全心全意致力于帮助外籍人士及其家庭掌握一切所需的语言和文化能力。'
              : 'We are entirely dedicated to equipping expatriates and their families with the linguistic and cultural competence required for success.'}
          </p>

          {/* Images 3 & 4 */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-xl overflow-hidden shadow-md">
              <img src="/images/news-blog-3.png" alt="" className="w-full h-auto" loading="lazy" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md">
              <img src="/images/news-blog-4.png" alt="" className="w-full h-auto" loading="lazy" />
            </div>
          </div>

          {/* Looking Ahead */}
          <h3 className="text-2xl font-bold text-black mb-4">
            {isZh ? '展望未来' : 'Looking Ahead'}
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            {isZh
              ? '在开启2026-2027年度中国德国商会\u201C商会之友\u201D任期之际，声浪中文将继续坚守我们的核心使命。我们期待与更多商会会员企业及国际友人建立联系，共同探索中国文化的丰富内涵！'
              : 'As we embark on our 2026-2027 term as a Friend of the German Chamber of Commerce, Mandarin Wave will continue to uphold our core mission. We look forward to connecting with more member companies of the Chamber and international friends, exploring the richness of Chinese culture together!'}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-2">
            {isZh
              ? '欢迎访问我们的官方网站，了解更多服务与课程信息：'
              : 'Discover more about our services and courses by visiting our official website:'}
          </p>
          <p className="text-lg text-blue font-semibold mb-8">
            🌐 www.mandarinwave.cn
          </p>
          <p className="text-lg text-gray-600 font-medium italic mb-12">
            {isZh
              ? '声浪中文 \u2014 助您掌握语言与文化能力'
              : 'Mandarin Wave \u2014 Equipping you with linguistic and cultural competence.'}
          </p>

          {/* QR Codes */}
          <div className="border-t border-gray-200 pt-10">
            <h4 className="text-xl font-bold text-black mb-6 text-center">
              {isZh ? '关注我们' : 'Follow Us'}
            </h4>
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              <div className="text-center">
                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-3">
                  <img src="/images/news-blog-5.png" alt="Xiaohongshu" className="w-full h-auto" loading="lazy" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {isZh ? '小红书' : 'Xiaohongshu'}
                </p>
              </div>
              <div className="text-center">
                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-3">
                  <img src="/images/news-blog-6.png" alt="WeChat" className="w-full h-auto" loading="lazy" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {isZh ? '微信' : 'WeChat'}
                </p>
              </div>
              <div className="text-center">
                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-3">
                  <img src="/images/news-blog-7.png" alt="WhatsApp" className="w-full h-auto" loading="lazy" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  WhatsApp
                </p>
              </div>
            </div>
          </div>

        </div>
      </article>
    </div>
  )
}

"use client"

import { useLanguage } from "@/lib/language-context"
import { Bot, Building2, GraduationCap, BookOpen, Palette, Landmark, Sparkles, Brain, Users, Download } from "lucide-react"

export default function ProgramIntroduction() {
  const { language } = useLanguage()
  const isZh = language === "zh"

  return (
    <div>
      {/* Hero / Intro */}
      <section className="relative bg-orange text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/summer-camp-hero.jpg"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-orange/80 to-orange" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg md:text-xl font-semibold mb-2 text-white/90">
              {isZh ? "前沿 AI + 现代艺术 + 顶尖大学" : "Pioneering AI, Modern Art, Elite Universities"}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              {isZh ? '"非凡北京" 2026夏令营' : 'Extraordinary Beijing — 2026 Chinese Summer Camp'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                <Sparkles className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">{isZh ? "行程体验" : "The Experience"}</p>
                <p className="text-sm text-white/80">
                  {isZh
                    ? "为期两周的沉浸式旅程，每日系统化汉语课程与真实城市探索完美结合"
                    : "A 2-week immersive journey balancing daily structured Chinese class with real-world city exploration"}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                <Landmark className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">{isZh ? "行程亮点" : "The Highlights"}</p>
                <p className="text-sm text-white/80">
                  {isZh
                    ? "探寻传统根基（故宫、造纸术与景泰蓝非遗手作），感受现代美学（798艺术区），触摸前沿未来（探访中国机器人基地、走进清华大学）"
                    : "Discover traditional roots (Forbidden City, Cloisonné & Papermaking workshops), explore modern aesthetics (798 Art Zone), and touch the future (Tsinghua University, AI Robots)"}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                <Users className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">{isZh ? "适合年龄" : "For Ages"}</p>
                <p className="text-3xl font-bold">12-18</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transition Quote */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-relaxed">
              {isZh
                ? "你还在认为北京只是一座历史悠久的文化古城吗？"
                : "Still think Beijing is just an ancient capital?"}
            </p>
            <p className="text-lg text-gray-600 mb-6">
              {isZh
                ? "如果是的话，也许你要更新一下你对北京的认知啦！"
                : "If so, it's time to update your perception!"}
            </p>
            <p className="text-xl font-semibold text-orange">
              {isZh
                ? "这个夏天，你将会直接走进\u201C未来\u201D的发生地："
                : "This summer, you will go straight to where the \"future\" is being made:"}
            </p>
          </div>
        </div>
      </section>

      {/* Pioneering AI */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange/10 mb-4">
                <Bot className="w-7 h-7 text-orange" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-black">
                {isZh ? "前沿科技" : "Pioneering AI"}
              </h3>
              {isZh ? (
                <p className="text-gray-500 mt-2">你准备好和中国最顶尖的大脑们来一场思想碰撞吗？</p>
              ) : (
                <p className="text-gray-500 mt-2">Are you ready for an intellectual spark with China's brightest minds?</p>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <ActivityCard
                image="/images/summer-camp-ai-robots.jpg"
                title={isZh ? "AI 机器人" : "AI Robots"}
                description={
                  isZh
                    ? "走进北京\u201C智造\u201D前沿，零距离接触尖端机器人技术，感受人工智能重塑未来的硬核力量。"
                    : "Get up close with cutting-edge robotics at Beijing's tech frontier, and experience how AI is shaping our future."
                }
              />
              <ActivityCard
                image="/images/summer-camp-science-museum.jpg"
                title={isZh ? "中国科学技术馆" : "China Science and Technology Museum"}
                description={
                  isZh
                    ? "踏入国家级科普殿堂，在沉浸式互动中探索科学奥秘，完成从理论到实践的思维飞跃。"
                    : "Explore the wonders of science through immersive, hands-on exhibits at China's premier museum, bringing theory to life."
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Elite Universities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange/10 mb-4">
                <GraduationCap className="w-7 h-7 text-orange" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-black">
                {isZh ? "顶尖大学" : "Elite Universities"}
              </h3>
              {isZh ? (
                <p className="text-gray-500 mt-2">你准备好和中国最顶尖的大脑们来一场思想碰撞吗？</p>
              ) : (
                <p className="text-gray-500 mt-2">Are you ready for an intellectual spark with China's brightest minds?</p>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <ActivityCard
                image="/images/summer-camp-tsinghua.jpg"
                title={isZh ? "清华大学" : "Tsinghua University"}
                description={
                  isZh
                    ? "中国顶尖的理工科大学。漫步于百年校园，感受前沿科技的脉搏，以创新精神点燃学术梦想！"
                    : "This is China's premier university for science and technology. Stroll through the historic campus and feel the pulse of pioneer tech. Ignite your academic dreams with the spirit of innovation!"
                }
              />
              <ActivityCard
                image="/images/summer-camp-renmin.jpg"
                title={isZh ? "中国人民大学" : "Renmin University of China"}
                description={
                  isZh
                    ? "中国最顶尖的人文社科大学。在这里，感受思想的碰撞与交融。以人文关怀理解世界，对话未来。"
                    : "This is China's leading university for humanities and social sciences. Explore the top institution for humanities. Broaden your global perspective and cultivate independent thinking."
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modern Art */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange/10 mb-4">
                <Palette className="w-7 h-7 text-orange" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-black">
                {isZh ? "当代艺术" : "Modern Art"}
              </h3>
              <p className="text-gray-500 mt-2">
                {isZh
                  ? "北京的艺术可不只是传统书画、京剧那么简单！这个夏天，我们将用脚步丈量北京的现代美学："
                  : "Think Beijing's art scene is all about traditional ink paintings and Peking Opera? Well, think again!"}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <ActivityCard
                image="/images/summer-camp-798.jpg"
                title={isZh ? "798艺术区" : "798 Art Zone"}
                description={
                  isZh
                    ? "工业遗址里的艺术狂欢！穿梭在包豪斯风格的老厂房与纵横交错的管道间，感受传统工业与现代前卫艺术的剧烈碰撞。"
                    : "An art festival inside a former factory town! Explore old Bauhaus workshops and intersecting pipes, and feel the dramatic contrast between traditional industry and bold contemporary art."
                }
              />
              <ActivityCard
                image="/images/summer-camp-pop-land.jpg"
                title={isZh ? "泡泡玛特城市乐园" : "Pop Land"}
                description={
                  isZh
                    ? "沉浸式打卡中国首个潮玩主题乐园。在这里，艺术是触手可及的潮流文化，带你零距离感受中国本土IP与当代年轻设计的创新活力。"
                    : "Immerse yourself in China's very first designer toy theme park! Here, art becomes pop culture you can actually touch. Get up close and personal with the vibrant energy of original Chinese characters and fresh, youthful designs."
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Heritage */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange/10 mb-4">
                <Landmark className="w-7 h-7 text-orange" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-black">
                {isZh ? "传统根基" : "Traditional Heritage"}
              </h3>
              <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                {isZh
                  ? "回首间，红墙黄瓦仍犹在。3000年的建城史，800年的建都史。这个夏天，你会走过宏大的历史叙事，用双手触碰历史的造物。"
                  : "Looking back, the red walls and golden tiles remain timeless. This summer, you will traverse grand historical narratives and experience the most traditional handicrafts."}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <ActivityCard
                image="/images/summer-camp-forbidden-city.jpg"
                title={isZh ? "皇城根脉" : "Imperial Majesty: Conversing with Ancient Empires"}
                description={
                  isZh
                    ? "跨越时空，走过天安门广场，深入宏伟的故宫博物院。"
                    : "Walk across Tiananmen Square and venture deep into the magnificent Forbidden City."
                }
              />
              <ActivityCard
                image="/images/summer-camp-workshop.jpg"
                title={isZh ? "非遗传承" : "Living Heritage"}
                description={
                  isZh
                    ? "唤醒指尖上的古老智慧，拒绝走马观花，亲自上手体验。在古法造纸与景泰蓝制作私享工作坊中，感受中国古代匠人对极致工艺的追求。"
                    : "In our exclusive workshops for Ancient Papermaking and Cloisonné crafting, experience firsthand the relentless pursuit of perfection by ancient Chinese artisans."
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Customized Learning Materials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange/10 mb-4">
                <BookOpen className="w-7 h-7 text-orange" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-black">
                {isZh ? "独家定制化教材" : "Exclusive Customized Learning Materials"}
              </h3>
              <p className="text-gray-500 mt-2 max-w-3xl mx-auto">
                {isZh
                  ? "独家研发沉浸式互动教材，它不仅是中文课堂的载体，更是你完美解锁本次北京之行的\u201C通关秘籍\u201D。"
                  : "This summer, you will be using our exclusively developed, immersive, and interactive learning materials. This is more than just a textbook for your Chinese classes; it is your ultimate guide to perfectly unlocking your Beijing adventure."}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange/10 mb-4">
                  <Sparkles className="w-6 h-6 text-orange" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-black">
                  {isZh ? "学以致用" : "Practical Application"}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {isZh
                    ? "与行程无缝衔接的\u201C实战预演\u201D。告别枯燥的死记硬背，将课堂与真实的城市探索深度绑定。每一堂课都会为你提前\u201C装备\u201D好次日行程所必需的核心词汇、实用句型与语法，让学到的每一句中文，都能立刻在第二天的实地场景中鲜活落地。"
                    : "We deeply integrate classroom learning with real-world city exploration. Each lesson will \"equip\" you in advance with the core vocabulary, practical sentence structures, and grammar needed for the next day's activities. This ensures that every Chinese sentence you learn immediately comes alive in real-life scenarios the very next day."}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange/10 mb-4">
                  <Brain className="w-6 h-6 text-orange" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-black">
                  {isZh ? "跨界伴学" : "Immersive Historical Companions"}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {isZh
                    ? "历史名人帮助你代入陌生之地。打破传统教材的刻板说教，我们将中国古代传奇人物请进课堂作为\u201C特邀导师\u201D。在这些历史NPC的生动引领下学习语言，让每一次发音、每一句表达，都变成一场充满趣味的跨时空对话。"
                    : "Let historical figures guide you through new destinations. Breaking away from the rigid lectures of traditional textbooks, we've invited legendary figures from ancient China into the classroom as \"guest mentors.\" Learning the language under the vivid guidance of these \"historical NPCs\" turns every pronunciation and expression into a fascinating, fun-filled dialogue across time and space."}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange/10 mb-4">
                  <Building2 className="w-6 h-6 text-orange" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-black">
                  {isZh ? "文脉传承" : "Cultural Heritage"}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {isZh
                    ? "解码从传统到未来的文化基因。这不仅是一套中文教材，更是一座连接古今的桥梁。在字词句的深度解析中，带你领略中国古代智慧是如何在当代艺术中焕发新生，又如何演变为引领世界的前沿科技，于语言的潜移默化中，让你体会、理解中国文化的传承与创新。"
                    : "Deciphering cultural genes from the past to the future. Through an in-depth analysis of words and sentences, we will show you how ancient Chinese wisdom is revitalized in contemporary art, and how it has evolved into world-leading, cutting-edge technology. As you absorb the language naturally, you will truly experience and understand both the heritage and the innovation of Chinese culture."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Camp Schedule Tables */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-10 text-black">
              {isZh ? "2026夏令营日程安排" : "2026 Summer Camp Schedule"}
            </h3>

            {/* Week 1 */}
            <h4 className="text-2xl font-bold mb-4 text-black">
              {isZh ? "第一周" : "Week 1"}
            </h4>
            <div className="overflow-x-auto mb-10">
              <table className="w-full border-collapse text-sm md:text-base">
                <thead>
                  <tr className="bg-orange text-white">
                    <th className="border border-orange-400 px-3 py-2 text-left whitespace-nowrap"></th>
                    <th className="border border-orange-400 px-3 py-2 text-center">Mon</th>
                    <th className="border border-orange-400 px-3 py-2 text-center">Tue</th>
                    <th className="border border-orange-400 px-3 py-2 text-center">Wed</th>
                    <th className="border border-orange-400 px-3 py-2 text-center">Thu</th>
                    <th className="border border-orange-400 px-3 py-2 text-center">Fri</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50 whitespace-nowrap">8:30-12:00</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "开营仪式" : "Opening Ceremony"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "故宫" : "Forbidden City"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "景泰蓝制作工坊" : "Cloisonné Making Workshop"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "798艺术区" : "798 Art Zone"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "中国人民大学" : "Renmin University of China"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50 whitespace-nowrap">12:00-14:00</td>
                    <td className="border border-gray-300 px-3 py-2 text-center bg-orange/5" colSpan={5}>{isZh ? "午餐" : "Lunch"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50 whitespace-nowrap">14:00-17:30</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "与乾隆皇帝同游故宫" : "Tour the Forbidden City with Emperor Qianlong"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "与景泰皇帝制作景泰蓝" : "Making Cloisonné with Emperor Jingtai"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "李清照的798艺术探险" : "Li Qingzhao's 798 Art Adventure"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "蔡伦教你如何造纸" : "Cai Lun Teaches You How to Make Paper"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "中国人民大学" : "Renmin University of China"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50 whitespace-nowrap">17:30-18:30</td>
                    <td className="border border-gray-300 px-3 py-2 text-center bg-orange/5" colSpan={5}>{isZh ? "晚餐" : "Dinner"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50 whitespace-nowrap">18:30-20:00</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "亮马河" : "Liangma River"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "三里屯" : "Sanlitun"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "蓝色港湾" : "Beijing Solana"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "日坛公园" : "Ritan Park"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "朝阳公园" : "Chaoyang Park"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Week 2 */}
            <h4 className="text-2xl font-bold mb-4 text-black">
              {isZh ? "第二周" : "Week 2"}
            </h4>
            <div className="overflow-x-auto mb-10">
              <table className="w-full border-collapse text-sm md:text-base">
                <thead>
                  <tr className="bg-orange text-white">
                    <th className="border border-orange-400 px-3 py-2 text-left whitespace-nowrap"></th>
                    <th className="border border-orange-400 px-3 py-2 text-center">Mon</th>
                    <th className="border border-orange-400 px-3 py-2 text-center">Tue</th>
                    <th className="border border-orange-400 px-3 py-2 text-center">Wed</th>
                    <th className="border border-orange-400 px-3 py-2 text-center">Thu</th>
                    <th className="border border-orange-400 px-3 py-2 text-center">Fri</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50 whitespace-nowrap">8:30-12:00</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "古法造纸工坊" : "Papermaking Workshop"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "AI机器人" : "AI Robots"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "清华大学" : "Tsinghua University"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "中国科学技术馆" : "China Science and Technology Museum"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "饺子工坊" : "Dumpling Workshop"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50 whitespace-nowrap">12:00-14:00</td>
                    <td className="border border-gray-300 px-3 py-2 text-center bg-orange/5" colSpan={5}>{isZh ? "午餐" : "Lunch"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50 whitespace-nowrap">14:00-17:30</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "鲁班带你探索未来科技" : "Luban Explores the Future Science and Tech with You"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "AI机器人" : "AI Robots"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "清华大学" : "Tsinghua University"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "苏东坡的饺子工坊" : "Su Dongpo's Dumpling Workshop"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "闭营仪式" : "Closing Ceremony"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50 whitespace-nowrap">17:30-18:30</td>
                    <td className="border border-gray-300 px-3 py-2 text-center bg-orange/5" colSpan={5}>{isZh ? "晚餐" : "Dinner"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50 whitespace-nowrap">18:30-20:00</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "国际使馆区" : "International Embassy Area"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "国贸中心" : "China World Trade Centre"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "海淀公园" : "Haidian Park"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "泡泡玛特城市乐园" : "Popland"}</td>
                    <td className="border border-gray-300 px-3 py-2">{isZh ? "胡同游" : "Local Hutong Tour"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Camp Schedule 2026 */}
            <h4 className="text-2xl font-bold mb-4 text-black">
              {isZh ? "2026营期安排" : "Camp Schedule 2026"}
            </h4>
            <div className="overflow-x-auto mb-10">
              <table className="w-full border-collapse text-sm md:text-base">
                <thead>
                  <tr className="bg-orange text-white">
                    <th className="border border-orange-400 px-4 py-2 text-left w-1/3">{isZh ? "营期" : "Session"}</th>
                    <th className="border border-orange-400 px-4 py-2 text-left">{isZh ? "营期日期（周一至次周五）" : "Camp Dates (Mon to Following Fri)"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{isZh ? "第一期" : "Session 1"}</td>
                    <td className="border border-gray-300 px-4 py-2">{isZh ? "6月22日 - 7月3日" : "June 22 - July 3"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{isZh ? "第二期" : "Session 2"}</td>
                    <td className="border border-gray-300 px-4 py-2">{isZh ? "7月13日 - 7月24日" : "July 13 - July 24"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{isZh ? "第三期" : "Session 3"}</td>
                    <td className="border border-gray-300 px-4 py-2">{isZh ? "8月3日 - 8月14日" : "August 3 - August 14"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 bg-orange/5 text-gray-600 italic" colSpan={2}>
                      {isZh
                        ? "注：每期名额有限，我们强烈建议根据当地学校假期安排尽早锁定孩子的名额。"
                        : "Note: Spaces for each session are limited. We highly recommend securing your child's spot early based on their local school holiday schedule."}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Price & Service */}
            <h4 className="text-2xl font-bold mb-4 text-black">
              {isZh ? "价格与服务" : "Price & Service"}
            </h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse text-sm md:text-base">
                <thead>
                  <tr className="bg-orange text-white">
                    <th className="border border-orange-400 px-4 py-2 text-left">{isZh ? "服务内容" : "Service"}</th>
                    <th className="border border-orange-400 px-4 py-2 text-left w-2/5">{isZh ? "价格" : "Price"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">{isZh ? "沉浸式中文课程及定制化学习教材" : "Immersive Chinese lessons & customized learning materials"}</td>
                    <td className="border border-gray-300 px-4 py-2" rowSpan={8}>
                      <div className="font-semibold text-orange">
                        {isZh ? "早鸟价：26,000元/人" : "Early Bird: 26,000 RMB/Person"}
                      </div>
                      <div className="mt-1">
                        {isZh ? "标准价：28,000元/人" : "Regular: 28,000 RMB/Person"}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">{isZh ? "传统手工坊及外出游览" : "Traditional workshops & Excursion"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">{isZh ? "优质双人间酒店及每日三餐营养膳食" : "Premium double-occupancy hotel rooms & 3 nutritious meals daily"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">{isZh ? "所有营地活动及游览的专车接送" : "Private coach buses for all scheduled camp activities and excursions"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">{isZh ? "北京（PEK/PKX）机场接送（限08:00-20:00）" : "Beijing (PEK/PKX) pickup & drop-off (Limited to 08:00-20:00)"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">{isZh ? "营服、欢迎礼包及毕业证书" : "Camp uniforms, welcome pack & graduation certificate"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">{isZh ? "24/7双语监护" : "24/7 bilingual supervision"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">{isZh ? "高端综合保险" : "Premium comprehensive insurance"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded-b-lg p-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-800 mb-2">{isZh ? "费用不包含：" : "What's Excluded:"}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{isZh ? "往返北京的机票及交通费用。" : "Airfare and transportation to and from Beijing."}</li>
                <li>{isZh ? "中国签证申请费用。" : "Chinese visa application fees."}</li>
                <li>{isZh ? "可选周末文化游（需额外付费）。" : "Optional weekend cultural tours (Additional fee applies)."}</li>
                <li>{isZh ? "08:00-20:00以外的机场接送需加收300元/趟附加费。" : "Airport pickup/drop-off outside 08:00-20:00 incurs a 300 RMB/trip surcharge."}</li>
                <li>{isZh ? "个人消费：购物、纪念品及通讯费用。" : "Personal expenses: Shopping, souvenirs, and communication fees."}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Download Full Program Review */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <a
            href={isZh ? "/images/summer-camp-program-review-zh.png" : "/images/summer-camp-program-review-en.png"}
            download
            className="inline-flex items-center gap-2 bg-orange hover:bg-orange/90 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            <Download className="w-5 h-5" />
            {isZh ? "下载完整项目介绍" : "Download Full Program Introduction"}
          </a>
        </div>
      </section>
    </div>
  )
}

function ActivityCard({ image, title, description }: { image: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <h4 className="text-xl font-bold mb-3 text-black">{title}</h4>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

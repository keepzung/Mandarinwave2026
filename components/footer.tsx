"use client"

import { Facebook, Instagram, Youtube } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import Image from "next/image"

export function Footer() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-3 mb-4">
              <img
                src="/images/真时汉语_画板 1.png"
                alt="真时汉语 InTime Mandarin"
                className="h-20 w-auto brightness-0 invert"
              />
            </a>
            <p className="text-white/70 max-w-md leading-relaxed">{t.footer.description}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#courses" className="text-white/70 hover:text-orange transition-colors">
                  {t.footer.courses}
                </a>
              </li>
              <li>
                <a href="#mission" className="text-white/70 hover:text-orange transition-colors">
                  {t.footer.about}
                </a>
              </li>
              <li>
                <a href="#reviews" className="text-white/70 hover:text-orange transition-colors">
                  {t.nav.reviews}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/70 hover:text-orange transition-colors">
                  {t.footer.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t.footer.followUs}</h4>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.xiaohongshu.com/user/profile/6472a466000000001f004ded"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg overflow-hidden hover:opacity-80 flex items-center justify-center transition-opacity"
                title="小红书 (7430739918)"
              >
                <Image
                  src="/images/xiaohongshu-logo.png"
                  alt="小红书"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </a>
              <a
                href="https://www.tiktok.com/@intimemandarin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:opacity-80 flex items-center justify-center transition-opacity"
                title="TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <defs>
                    <linearGradient id="tiktok-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#25F4EE" />
                      <stop offset="50%" stopColor="#FE2C55" />
                      <stop offset="100%" stopColor="#000000" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#tiktok-gradient)" d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/intimemandarin/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:opacity-80 flex items-center justify-center transition-opacity"
                title="Instagram"
              >
                <Instagram className="w-5 h-5 text-[#E4405F]" />
              </a>
              <a
                href="https://youtube.com/@intimemandarin?si=o99QE2AZBcivt6vA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:opacity-80 flex items-center justify-center transition-opacity"
                title="YouTube @InTimeMandarin"
              >
                <Youtube className="w-5 h-5 text-[#FF0000]" />
              </a>
              <a
                href="https://x.com/InTimeMandarin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:opacity-80 flex items-center justify-center transition-opacity"
                title="X (Twitter)"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/1GVQC4Fwxp/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:opacity-80 flex items-center justify-center transition-opacity"
                title="Facebook"
              >
                <Facebook className="w-5 h-5 text-[#1877F2]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center text-white/60">
          <p>
            &copy; 2025 {t.logo}. {t.footer.copyright}.
          </p>
        </div>
      </div>
    </footer>
  )
}

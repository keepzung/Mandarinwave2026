'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/lib/language-context'
import { Mail, Phone, MapPin, Send, Home } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const t = {
    zh: {
      title: '联系我们',
      subtitle: '我们很乐意听取您的意见',
      formTitle: '发送消息',
      name: '姓名',
      email: '邮箱',
      phone: '电话',
      message: '留言',
      send: '发送消息',
      sending: '发送中...',
      contactInfo: '联系信息',
      emailLabel: '电子邮件',
      phoneLabel: '电话',
      addressLabel: '地址',
      emailValue: 'info@mandarinwave.cn',
      phoneValue: '+86 15701696836',
      addressValue: '中国北京市朝阳区',
      backHome: '返回首页'
    },
    en: {
      title: 'Contact Us',
      subtitle: "We'd love to hear from you",
      formTitle: 'Send us a Message',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      contactInfo: 'Contact Information',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      addressLabel: 'Address',
      emailValue: 'info@mandarinwave.cn',
      phoneValue: '+86 15701696836',
      addressValue: 'Chaoyang District, Beijing, China',
      backHome: 'Back to Home'
    }
  }[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('[v0] Form submitted:', formData)
    setIsSubmitting(false)
    // Reset form
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-blue text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          <Link href="/">
            <Button variant="outline" className="mt-8 bg-white text-blue hover:bg-white/90 border-white">
              <Home className="mr-2 h-5 w-5" />
              {t.backHome}
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                {t.formTitle}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                    {t.name}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                    {t.email}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2 text-foreground">
                    {t.phone}
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                    {t.message}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange hover:bg-orange/90 text-white text-lg py-6"
                >
                  {isSubmitting ? t.sending : t.send}
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">
                  {t.contactInfo}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {language === 'zh' 
                    ? '无论您是想了解我们的课程、预约试课，还是寻求合作机会，我们都期待与您交流。'
                    : 'Whether you want to learn about our courses, book a trial class, or explore partnership opportunities, we look forward to connecting with you.'}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md">
                  <div className="p-3 bg-orange/10 rounded-lg">
                    <Mail className="h-6 w-6 text-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.emailLabel}</h3>
                    <a href={`mailto:${t.emailValue}`} className="text-muted-foreground hover:text-orange">
                      {t.emailValue}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md">
                  <div className="p-3 bg-blue/10 rounded-lg">
                    <Phone className="h-6 w-6 text-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.phoneLabel}</h3>
                    <a href={`tel:${t.phoneValue}`} className="text-muted-foreground hover:text-blue">
                      {t.phoneValue}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md">
                  <div className="p-3 bg-orange/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.addressLabel}</h3>
                    <p className="text-muted-foreground">
                      {t.addressValue}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

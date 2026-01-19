"use client"

import { useState } from "react"
import { Mail, MessageCircle, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock 제출 - 실제로는 API 호출
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "이메일",
      content: "support@travelmate.com",
      description: "24시간 이내 답변 드립니다",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "라이브 채팅",
      content: "평일 09:00 - 18:00",
      description: "실시간 상담 가능",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "전화",
      content: "1588-1234",
      description: "평일 09:00 - 18:00",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "주소",
      content: "서울특별시 강남구",
      description: "테헤란로 123",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">문의하기</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            궁금하신 점이 있으신가요? 언제든지 문의해주세요.
            <br />
            최대한 빠르게 답변 드리겠습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">연락처 정보</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{info.title}</h3>
                      <p className="text-gray-900">{info.content}</p>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-2">자주 묻는 질문을 확인해보세요</h3>
              <p className="text-sm text-blue-700 mb-4">
                대부분의 질문에 대한 답변을 FAQ에서 빠르게 찾을 수 있습니다.
              </p>
              <Button variant="outline" asChild className="w-full">
                <a href="/faq">FAQ 보기</a>
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">메시지 보내기</h2>

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">문의가 접수되었습니다</h3>
                <p className="text-green-700">
                  빠른 시일 내에 답변 드리겠습니다.
                  <br />
                  감사합니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    문의 유형 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">선택해주세요</option>
                    <option value="general">일반 문의</option>
                    <option value="technical">기술 지원</option>
                    <option value="account">계정 관련</option>
                    <option value="billing">결제 관련</option>
                    <option value="feature">기능 제안</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    문의 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="문의하실 내용을 상세히 적어주세요..."
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  문의 보내기
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

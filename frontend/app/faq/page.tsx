"use client"

import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      category: "계정 및 로그인",
      questions: [
        {
          question: "회원가입은 어떻게 하나요?",
          answer:
            "홈페이지 우측 상단의 '회원가입' 버튼을 클릭하여 이메일 또는 소셜 계정(Google, Naver)으로 간편하게 가입하실 수 있습니다. 이메일 인증 후 바로 서비스를 이용하실 수 있습니다.",
        },
        {
          question: "비밀번호를 잊어버렸어요.",
          answer:
            "로그인 페이지에서 '비밀번호 찾기'를 클릭하시면 가입하신 이메일로 비밀번호 재설정 링크가 전송됩니다. 링크를 통해 새로운 비밀번호를 설정하실 수 있습니다.",
        },
        {
          question: "계정을 삭제하고 싶어요.",
          answer:
            "마이페이지 > 설정 > 계정 관리에서 '계정 삭제' 옵션을 선택하실 수 있습니다. 계정 삭제 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.",
        },
      ],
    },
    {
      category: "여행 계획",
      questions: [
        {
          question: "여행을 어떻게 만드나요?",
          answer:
            "로그인 후 '여행 만들기' 버튼을 클릭하여 여행 제목, 날짜, 목적지를 입력하면 새로운 여행이 생성됩니다. 생성 후 일정, 장소, 메모 등을 자유롭게 추가할 수 있습니다.",
        },
        {
          question: "여행에 친구를 초대하려면 어떻게 하나요?",
          answer:
            "여행 상세 페이지에서 '멤버 관리' 메뉴를 선택하고 '초대하기' 버튼을 클릭하세요. 친구의 이메일을 입력하거나 초대 링크를 공유하여 간편하게 초대할 수 있습니다.",
        },
        {
          question: "여행 일정을 수정하거나 삭제할 수 있나요?",
          answer:
            "네, 여행 생성자 및 관리자 권한을 가진 멤버는 언제든지 일정을 수정하거나 삭제할 수 있습니다. 일정 항목을 클릭하여 수정 모드로 진입하거나 삭제 버튼을 눌러주세요.",
        },
      ],
    },
    {
      category: "경비 관리",
      questions: [
        {
          question: "경비는 어떻게 기록하나요?",
          answer:
            "여행 페이지의 '경비' 탭에서 '+' 버튼을 눌러 지출 내역을 추가할 수 있습니다. 금액, 카테고리, 지불한 사람, 참여자를 선택하여 상세하게 기록할 수 있습니다.",
        },
        {
          question: "경비 정산은 어떻게 하나요?",
          answer:
            "경비 탭에서 '정산하기' 버튼을 클릭하면 자동으로 멤버별 지출 내역과 정산 금액이 계산됩니다. 누가 누구에게 얼마를 보내야 하는지 명확하게 확인할 수 있습니다.",
        },
        {
          question: "영수증을 첨부할 수 있나요?",
          answer:
            "네, 경비 등록 시 영수증 사진을 첨부할 수 있습니다. 카메라로 직접 촬영하거나 갤러리에서 선택하여 업로드하세요.",
        },
      ],
    },
    {
      category: "기능 및 사용법",
      questions: [
        {
          question: "오프라인에서도 사용할 수 있나요?",
          answer:
            "일부 기능은 오프라인에서도 사용 가능합니다. 이전에 불러온 여행 데이터는 오프라인에서도 조회할 수 있으며, 온라인 상태가 되면 자동으로 동기화됩니다.",
        },
        {
          question: "알림은 어떻게 설정하나요?",
          answer:
            "마이페이지 > 설정 > 알림 설정에서 원하는 알림을 켜거나 끌 수 있습니다. 여행 초대, 일정 변경, 채팅 메시지 등 다양한 알림을 맞춤 설정할 수 있습니다.",
        },
        {
          question: "여행 데이터를 내보낼 수 있나요?",
          answer:
            "네, 여행 상세 페이지의 설정 메뉴에서 '데이터 내보내기'를 선택하면 여행 일정, 경비, 사진 등을 PDF 또는 Excel 파일로 다운로드할 수 있습니다.",
        },
      ],
    },
    {
      category: "결제 및 요금",
      questions: [
        {
          question: "TravelMate는 무료인가요?",
          answer:
            "기본 기능은 완전 무료로 제공됩니다. 추가 기능이 필요한 경우 프리미엄 플랜을 이용하실 수 있으며, 자세한 요금 정보는 요금제 페이지에서 확인하실 수 있습니다.",
        },
        {
          question: "환불 정책은 어떻게 되나요?",
          answer:
            "프리미엄 플랜 구매 후 7일 이내 서비스를 이용하지 않은 경우 전액 환불이 가능합니다. 환불을 원하시면 고객지원팀에 문의해주세요.",
        },
      ],
    },
  ]

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">자주 묻는 질문</h1>
          <p className="text-lg text-gray-600 mb-8">
            궁금하신 점을 빠르게 찾아보세요
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="질문을 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-8">
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex
                  const isOpen = openIndex === globalIndex

                  return (
                    <div
                      key={faqIndex}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            isOpen ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            찾으시는 답변이 없으신가요?
          </h2>
          <p className="text-gray-600 mb-6">
            고객지원팀이 도와드리겠습니다.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            문의하기
          </Link>
        </div>
      </div>
    </div>
  )
}

import { BookOpen, Users, Calendar, CreditCard, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const helpCategories = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "시작하기",
      description: "TravelMate 사용법을 알아보세요",
      items: [
        "회원가입 및 로그인",
        "프로필 설정하기",
        "첫 여행 만들기",
        "친구 초대하기",
      ],
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "여행 계획",
      description: "여행을 계획하고 관리하는 방법",
      items: [
        "일정 추가 및 수정",
        "장소 검색 및 저장",
        "체크리스트 활용하기",
        "메모 및 사진 추가",
      ],
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "협업 기능",
      description: "친구들과 함께 여행을 준비하세요",
      items: [
        "여행 멤버 관리",
        "실시간 채팅 사용법",
        "투표 기능 활용",
        "역할 및 권한 설정",
      ],
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "경비 관리",
      description: "여행 경비를 기록하고 정산하세요",
      items: [
        "지출 내역 등록",
        "카테고리별 분류",
        "멤버별 정산하기",
        "영수증 첨부 및 관리",
      ],
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "계정 설정",
      description: "계정 및 알림 설정 관리",
      items: [
        "개인정보 변경",
        "알림 설정",
        "계정 연동",
        "계정 삭제",
      ],
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: "문제 해결",
      description: "자주 발생하는 문제와 해결방법",
      items: [
        "로그인 문제",
        "초대 링크 오류",
        "사진 업로드 실패",
        "알림이 오지 않을 때",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">도움말</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            TravelMate 사용에 도움이 필요하신가요? 아래 카테고리에서 원하는 주제를 찾아보세요.
          </p>
        </div>

        {/* Help Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {helpCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href="#"
                      className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">원하는 답변을 찾지 못하셨나요?</h2>
          <p className="text-gray-600 mb-6">
            고객지원팀에 문의하시면 빠르게 도와드리겠습니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              문의하기
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              FAQ 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { ArrowRight, Camera, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TravelMate</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
              >
                <Link href="/signup">시작하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-orange-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              함께 만드는
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                {" "}
                여행 이야기
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              친구들과 함께 여행을 계획하고, 실시간으로 추억을 기록하며, 아름다운 여행 스토리를 만들어보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
              >
                <Link href="/signup">
                  무료로 시작하기
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">로그인</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <img
              src="/placeholder.svg?height=600&width=1000&text=TravelMate+App+Preview"
              alt="TravelMate 앱 미리보기"
              className="w-full rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">여행의 모든 순간을 함께</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              계획부터 기록까지, TravelMate와 함께라면 여행이 더욱 특별해집니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">스마트한 여행 계획</h3>
                <p className="text-gray-600">
                  AI 추천과 실시간 정보로 완벽한 여행 일정을 만들어보세요. 맛집, 관광지, 숙소까지 한 번에!
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">실시간 협업</h3>
                <p className="text-gray-600">
                  친구들과 실시간으로 일정을 공유하고 수정하세요. 채팅과 투표 기능으로 모두가 만족하는 여행을!
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">추억 기록 & 공유</h3>
                <p className="text-gray-600">
                  여행 중 사진과 일기를 실시간으로 기록하고, 아름다운 여행 앨범을 자동으로 만들어보세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">활성 사용자</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">완성된 여행</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">1M+</div>
              <div className="text-gray-600">공유된 사진</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">4.9</div>
              <div className="text-gray-600">평점 (5점 만점)</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">간단한 3단계로 시작하세요</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">계획 세우기</h3>
              <p className="text-gray-600">여행지와 날짜를 선택하고, 친구들을 초대해서 함께 일정을 계획하세요.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">여행 떠나기</h3>
              <p className="text-gray-600">실시간으로 위치를 공유하고, 사진과 후기를 바로바로 기록하세요.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">추억 간직하기</h3>
              <p className="text-gray-600">자동으로 만들어진 여행 앨범을 친구들과 공유하고 추억을 간직하세요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">지금 바로 여행 계획을 시작하세요!</h2>
          <p className="text-xl text-blue-100 mb-8">무료로 가입하고 친구들과 함께 특별한 여행을 만들어보세요.</p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
            <Link href="/signup">
              무료 회원가입
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-xl font-bold">TravelMate</span>
              </div>
              <p className="text-gray-400">함께 만드는 여행 이야기</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">서비스</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white">
                    기능 소개
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    요금제
                  </Link>
                </li>
                <li>
                  <Link href="/download" className="hover:text-white">
                    앱 다운로드
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">지원</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    도움말
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    문의하기
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    자주 묻는 질문
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">회사</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    회사 소개
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    이용약관
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TravelMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

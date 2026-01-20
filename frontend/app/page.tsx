"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Calendar,
  Camera,
  CheckCircle2,
  DollarSign,
  Hotel,
  Mail,
  MapPin,
  Plane,
  Share2,
  Sparkles,
  Train,
  Users,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState({
    hero: false,
    feature1: false,
    featureReservation: false,
    feature2: false,
    feature3: false,
    feature4: false,
    feature5: false,
    howItWorks: false,
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Progressive reveal on scroll
      const sections = document.querySelectorAll("[data-reveal]")
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const sectionName = section.getAttribute("data-reveal")
        if (rect.top < window.innerHeight * 0.75 && sectionName) {
          setIsVisible((prev) => ({ ...prev, [sectionName]: true }))
        }
      })
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-blue-50 via-white to-orange-50 py-20 lg:py-32 overflow-hidden"
        data-reveal="hero"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center transition-all duration-1000 ${
              isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              여행의 모든 순간을 스마트하게
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
              친구들과 함께 만드는
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                완벽한 여행 경험
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
              계획부터 경비 관리, 추억 공유까지. TravelMate와 함께라면 여행의 모든 것이 간편해집니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-lg h-14 px-8"
              >
                <Link href="/signup">
                  무료로 시작하기
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg h-14 px-8 bg-transparent">
                <Link href="/explore">여행 둘러보기</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>
      </section>

      {/* Feature 1: 함께 계획 세우기 */}
      <section className="py-20 bg-white" data-reveal="feature1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
              isVisible.feature1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Mail className="w-4 h-4" />
                초대 & 협업
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                이메일 한 번이면
                <br />
                <span className="text-blue-600">모두 함께 계획 세우기</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                친구들을 이메일로 손쉽게 초대하고, 실시간으로 함께 여행 일정을 만들어보세요. 체크리스트와 예약 관리를
                함께하며 서로 보완하고, 투표 기능으로 모두가 만족하는 여행을 계획할 수 있습니다.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">이메일로 간편한 초대 및 실시간 협업</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">체크리스트와 예약을 함께 관리</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">투표 기능으로 민주적인 결정</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Card className="shadow-2xl border-0 overflow-hidden">
                <CardContent className="p-8 bg-gradient-to-br from-purple-50 to-blue-50">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        김
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">김여행</div>
                        <div className="text-sm text-gray-500">일정 추가 중...</div>
                      </div>
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                      <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                        박
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">박모험</div>
                        <div className="text-sm text-gray-500">체크리스트 완료!</div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        이
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">이탐험</div>
                        <div className="text-sm text-gray-500">숙소 투표 참여</div>
                      </div>
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Reservation: 예약 관리 */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50" data-reveal="featureReservation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
              isVisible.featureReservation ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="lg:order-2">
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Plane className="w-4 h-4" />
                스마트한 예약
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                모든 예약을
                <br />
                <span className="text-teal-600">한곳에서 관리하세요</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                항공권, 숙소, 관광지, 교통편까지 여행의 모든 예약을 체계적으로 관리하세요. 예약 정보를 한눈에 확인하고,
                확인 번호와 시간 정보를 놓치지 마세요. Google Maps 통합으로 위치도 쉽게 찾을 수 있습니다.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Plane className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">항공편, 숙소, 관광지 예약 통합 관리</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Google Maps로 위치 쉽게 확인</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">예약 확인 번호와 시간 자동 정리</span>
                </li>
              </ul>
            </div>
            <div className="lg:order-1 relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">항공편</h3>
                    <p className="text-sm text-gray-600">티켓 정보와 시간표를 한눈에</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                      <Hotel className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">숙소</h3>
                    <p className="text-sm text-gray-600">체크인/아웃 정보 자동 알림</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">관광지</h3>
                    <p className="text-sm text-gray-600">티켓과 위치 정보 관리</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                      <Train className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">교통편</h3>
                    <p className="text-sm text-gray-600">버스, 기차, 렌터카 예약</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: 경비 관리 (핵심 기능) */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50" data-reveal="feature2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
              isVisible.feature2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="lg:order-2">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <DollarSign className="w-4 h-4" />
                핵심 기능
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                여행 경비는
                <br />
                <span className="text-indigo-600">TravelMate가 책임집니다</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                여행에서 소비한 모든 돈을 자동으로 추적하고 관리해드립니다. 복잡한 N빵 계산은 이제 그만! 누가 얼마를
                쓰고, 누구에게 얼마를 받아야 하는지 한눈에 확인하고 간편하게 정산하세요.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Wallet className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">공동 경비와 개별 경비를 자동으로 분류</span>
                </li>
                <li className="flex items-start gap-3">
                  <DollarSign className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">복잡한 N빵 계산을 자동으로 처리</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">영수증 사진 첨부로 투명한 정산</span>
                </li>
              </ul>
            </div>
            <div className="lg:order-1 relative">
              <Card className="shadow-2xl border-0 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
                    <div className="text-sm opacity-90 mb-1">전체 예산</div>
                    <div className="text-3xl font-bold">₩1,200,000</div>
                    <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                      <div className="bg-white h-full w-[40%] rounded-full"></div>
                    </div>
                    <div className="mt-2 text-sm opacity-90">사용: 40% (₩480,000)</div>
                  </div>
                  <div className="p-6 space-y-3 bg-white">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">저녁 식사</div>
                          <div className="text-sm text-gray-500">4명 균등 분담</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">₩120,000</div>
                        <div className="text-sm text-green-600">정산 완료</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Camera className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">입장료</div>
                          <div className="text-sm text-gray-500">공동 경비</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">₩80,000</div>
                        <div className="text-sm text-orange-600">정산 대기</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: 앨범 & 추억 공유 */}
      <section className="py-20 bg-white" data-reveal="feature3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
              isVisible.feature3 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Camera className="w-4 h-4" />
                추억 저장소
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                소중한 순간을
                <br />
                <span className="text-pink-600">영원히 간직하세요</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                여행 중 촬영한 사진과 영상을 장소별, 시간별로 자동 정리하여 아름다운 앨범을 만들어드립니다. 동행자들과
                실시간으로 사진을 공유하고, 여행이 끝난 후에도 언제든 추억을 되새길 수 있습니다.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Camera className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">장소별, 시간별 자동 분류</span>
                </li>
                <li className="flex items-start gap-3">
                  <Share2 className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">동행자들과 실시간 사진 공유</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">추억을 아름다운 앨범으로 소장</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl h-48 overflow-hidden shadow-lg">
                    <img
                      src="/images/destinations/tokyo.jpg"
                      alt="도쿄 여행"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl h-32 overflow-hidden shadow-lg">
                    <img
                      src="/images/destinations/osaka.jpg"
                      alt="오사카 여행"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl h-32 overflow-hidden shadow-lg">
                    <img
                      src="/images/destinations/jeju.jpg"
                      alt="제주도 여행"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl h-48 overflow-hidden shadow-lg">
                    <img
                      src="/images/destinations/busan.jpg"
                      alt="부산 여행"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 4: 실시간 여행 흔적 */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50" data-reveal="feature4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center max-w-3xl mx-auto transition-all duration-1000 ${
              isVisible.feature4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              여행의 모든 순간
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              계획부터 추억까지
              <br />
              <span className="text-purple-600">여행의 모든 것이 한곳에</span>
            </h2>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              여행 전 계획과 준비를 도와주고, 여행 중에는 실시간으로 흔적을 남기며, 여행 후에는 소중한 추억으로
              보관합니다. 언제든 원하는 정보를 확인하고 공유할 수 있습니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">계획 & 준비</h3>
                  <p className="text-sm text-gray-600">일정, 체크리스트, 예약까지 완벽하게 준비</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-pink-200 hover:border-pink-400 transition-all shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">실시간 기록</h3>
                  <p className="text-sm text-gray-600">여행지에서 순간순간 기록하고 공유</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-indigo-200 hover:border-indigo-400 transition-all shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">추억 공유</h3>
                  <p className="text-sm text-gray-600">원하는 섹션만 골라 편리하게 공유</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white" data-reveal="howItWorks">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.howItWorks ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">간단한 3단계로 시작하세요</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">가입부터 여행까지, 모든 과정이 쉽고 빠릅니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`text-center transition-all duration-1000 delay-100 ${
                isVisible.howItWorks ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-200 rounded-2xl -z-10 blur-xl opacity-50"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">초대하고 계획하기</h3>
              <p className="text-gray-600">
                친구들을 이메일로 초대하고
                <br />
                함께 여행 계획을 세워보세요
              </p>
            </div>

            <div
              className={`text-center transition-all duration-1000 delay-200 ${
                isVisible.howItWorks ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-200 rounded-2xl -z-10 blur-xl opacity-50"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">여행하고 기록하기</h3>
              <p className="text-gray-600">
                여행지에서 지출을 기록하고
                <br />
                사진과 추억을 실시간 공유하세요
              </p>
            </div>

            <div
              className={`text-center transition-all duration-1000 delay-300 ${
                isVisible.howItWorks ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-orange-200 rounded-2xl -z-10 blur-xl opacity-50"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">정산하고 추억 간직하기</h3>
              <p className="text-gray-600">
                자동 계산으로 간편하게 정산하고
                <br />
                아름다운 앨범으로 추억을 보관하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 text-balance">
            지금 바로 여행 계획을 시작하세요
          </h2>
          <p className="text-xl text-white/90 mb-8">무료로 가입하고 친구들과 함께 완벽한 여행을 만들어보세요</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg h-14 px-8" asChild>
              <Link href="/signup">
                무료로 시작하기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg h-14 px-8 bg-transparent"
              asChild
            >
              <Link href="/explore">여행 둘러보기</Link>
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white/20 rounded-full"></div>
      </section>
    </div>
  )
}

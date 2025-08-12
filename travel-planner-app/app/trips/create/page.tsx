"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PrivateRoute from "@/components/PrivateRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, MapPin, Users, Plus, X, CalendarIcon, Upload, Globe, Lock, Check } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

// 여행 템플릿 데이터
const tripTemplates = [
  {
    id: "healing",
    name: "힐링 여행",
    description: "휴식과 재충전을 위한 여행",
    icon: "🌿",
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    id: "food",
    name: "맛집 투어",
    description: "현지 음식을 즐기는 여행",
    icon: "🍽️",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  },
  {
    id: "culture",
    name: "문화 탐방",
    description: "역사와 문화를 체험하는 여행",
    icon: "🏛️",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
  {
    id: "adventure",
    name: "모험 여행",
    description: "액티비티와 스포츠 중심 여행",
    icon: "🏔️",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    id: "custom",
    name: "직접 계획",
    description: "처음부터 직접 계획하기",
    icon: "✏️",
    color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
  },
]

function CreateTripPageContent() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    template: "",
    title: "",
    destination: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    description: "",
    coverImage: null as File | null,
    isPublic: false,
    inviteEmails: [] as string[],
    budget: "",
  })

  const [emailInput, setEmailInput] = useState("")
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData({ ...formData, coverImage: file })
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 이메일 추가
  const handleAddEmail = () => {
    if (emailInput && !formData.inviteEmails.includes(emailInput)) {
      setFormData({
        ...formData,
        inviteEmails: [...formData.inviteEmails, emailInput],
      })
      setEmailInput("")
    }
  }

  // 이메일 제거
  const handleRemoveEmail = (email: string) => {
    setFormData({
      ...formData,
      inviteEmails: formData.inviteEmails.filter((e) => e !== email),
    })
  }

  // 폼 제출
  const handleSubmit = async () => {
    try {
      // TODO: API 호출로 여행 생성
      console.log("여행 생성 데이터:", formData)

      // 성공 시 여행 상세 페이지로 이동
      router.push("/trips/1") // 실제로는 생성된 여행 ID 사용
    } catch (error) {
      console.error("여행 생성 실패:", error)
    }
  }

  // 다음 단계로
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  // 이전 단계로
  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // 단계별 유효성 검사
  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.template !== ""
      case 2:
        return formData.title && formData.destination && formData.startDate && formData.endDate
      case 3:
        return true // 선택사항이므로 항상 유효
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>대시보드로 돌아가기</span>
            </Link>

            {/* 진행 상황 표시 */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= num ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step > num ? <Check className="w-4 h-4" /> : num}
                  </div>
                  {num < 3 && <div className={`w-8 h-0.5 mx-2 ${step > num ? "bg-blue-600" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>

            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TravelMate</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Step 1: 템플릿 선택 */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">어떤 여행을 계획하시나요?</h1>
              <p className="text-gray-600 text-lg">템플릿을 선택하면 더 쉽게 여행을 계획할 수 있어요</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 ${template.color} ${
                    formData.template === template.id ? "ring-2 ring-blue-500 shadow-lg scale-105" : "hover:shadow-md"
                  }`}
                  onClick={() => setFormData({ ...formData, template: template.id })}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{template.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: 기본 정보 */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">여행 정보를 입력해주세요</h1>
              <p className="text-gray-600 text-lg">기본적인 여행 정보를 설정해보세요</p>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-8 space-y-6">
                {/* 커버 이미지 업로드 */}
                <div className="space-y-2">
                  <label className="text-base font-medium text-gray-700">커버 이미지</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    {coverImagePreview ? (
                      <div className="relative">
                        <img
                          src={coverImagePreview || "/placeholder.svg"}
                          alt="Cover preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setCoverImagePreview(null)
                            setFormData({ ...formData, coverImage: null })
                          }}
                        >
                          변경
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">여행을 대표할 이미지를 업로드하세요</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="cover-image"
                        />
                        <label htmlFor="cover-image">
                          <Button type="button" variant="outline" className="cursor-pointer bg-transparent">
                            이미지 선택
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* 여행 제목 */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-base font-medium text-gray-700">
                    여행 제목 *
                  </label>
                  <Input
                    id="title"
                    placeholder="예: 제주도 힐링 여행"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-lg h-12"
                  />
                </div>

                {/* 목적지 */}
                <div className="space-y-2">
                  <label htmlFor="destination" className="text-base font-medium text-gray-700">
                    목적지 *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="destination"
                      placeholder="예: 제주도"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="pl-10 text-lg h-12"
                    />
                  </div>
                </div>

                {/* 날짜 선택 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-base font-medium text-gray-700">시작일 *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start text-left font-normal bg-transparent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? (
                            format(formData.startDate, "PPP", { locale: ko })
                          ) : (
                            <span>날짜를 선택하세요</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => setFormData({ ...formData, startDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-medium text-gray-700">종료일 *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start text-left font-normal bg-transparent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? (
                            format(formData.endDate, "PPP", { locale: ko })
                          ) : (
                            <span>날짜를 선택하세요</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => setFormData({ ...formData, endDate: date })}
                          initialFocus
                          disabled={(date) => (formData.startDate ? date < formData.startDate : false)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* 예산 */}
                <div className="space-y-2">
                  <label htmlFor="budget" className="text-base font-medium text-gray-700">
                    예상 예산 (선택)
                  </label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="예: 500000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="h-12"
                  />
                </div>

                {/* 여행 설명 */}
                <div className="space-y-2">
                  <label htmlFor="description" className="text-base font-medium text-gray-700">
                    여행 설명
                  </label>
                  <Textarea
                    id="description"
                    placeholder="이번 여행에 대해 간단히 설명해주세요..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* 공개 설정 */}
                <div className="space-y-4">
                  <label className="text-base font-medium text-gray-700">공개 설정</label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="radio"
                        name="privacy"
                        checked={!formData.isPublic}
                        onChange={() => setFormData({ ...formData, isPublic: false })}
                        className="text-blue-600"
                      />
                      <div className="flex items-center space-x-3">
                        <Lock className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">비공개</p>
                          <p className="text-sm text-gray-500">초대받은 사람만 볼 수 있습니다</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="radio"
                        name="privacy"
                        checked={formData.isPublic}
                        onChange={() => setFormData({ ...formData, isPublic: true })}
                        className="text-blue-600"
                      />
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">공개</p>
                          <p className="text-sm text-gray-500">모든 사용자가 볼 수 있습니다</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: 동행자 초대 */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">동행자를 초대해보세요</h1>
              <p className="text-gray-600 text-lg">함께 여행할 사람들을 초대하거나 나중에 추가할 수 있어요</p>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  동행자 초대
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 이메일 초대 */}
                <div className="space-y-2">
                  <label className="text-base font-medium text-gray-700">이메일로 초대</label>
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="이메일 주소를 입력하세요"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddEmail())}
                      className="h-12"
                    />
                    <Button onClick={handleAddEmail} disabled={!emailInput} className="h-12">
                      <Plus className="w-4 h-4 mr-2" />
                      추가
                    </Button>
                  </div>
                </div>

                {/* 초대된 이메일 목록 */}
                {formData.inviteEmails.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-base font-medium text-gray-700">초대할 사람들</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.inviteEmails.map((email) => (
                        <Badge key={email} variant="secondary" className="px-3 py-1 text-sm">
                          {email}
                          <button
                            onClick={() => handleRemoveEmail(email)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 건너뛰기 옵션 */}
                <div className="text-center py-8 border-t">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">나중에 초대하기</h3>
                      <p className="text-gray-600">지금 초대하지 않고 여행을 만든 후에 친구들을 초대할 수도 있어요</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between pt-8">
          <Button variant="outline" onClick={handlePrev} disabled={step === 1} className="px-8 bg-transparent">
            이전
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="px-8 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
          >
            {step === 3 ? "여행 만들기" : "다음"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CreateTripPage() {
  return (
    <PrivateRoute>
      <CreateTripPageContent />
    </PrivateRoute>
  )
}

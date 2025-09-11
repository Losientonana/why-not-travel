"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Upload,
  MapPin,
  CalendarIcon,
  Users,
  Globe,
  Lock,
  Plus,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
    features: ["자연 명소", "스파/온천", "조용한 숙소", "느린 여행"],
  },
  {
    id: "food",
    name: "맛집 투어",
    description: "현지 음식을 즐기는 여행",
    icon: "🍽️",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    features: ["유명 맛집", "현지 음식", "요리 체험", "시장 투어"],
  },
  {
    id: "culture",
    name: "문화 탐방",
    description: "역사와 문화를 체험하는 여행",
    icon: "🏛️",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    features: ["박물관", "역사 유적", "전통 체험", "문화 공연"],
  },
  {
    id: "adventure",
    name: "모험 여행",
    description: "액티비티와 스포츠 중심 여행",
    icon: "🏔️",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    features: ["등산/트레킹", "수상 스포츠", "익스트림 스포츠", "야외 활동"],
  },
  {
    id: "city",
    name: "도시 탐험",
    description: "도시의 매력을 발견하는 여행",
    icon: "🏙️",
    color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
    features: ["쇼핑", "카페 투어", "야경 명소", "도시 문화"],
  },
  {
    id: "custom",
    name: "직접 계획",
    description: "처음부터 직접 계획하기",
    icon: "✏️",
    color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
    features: ["자유로운 계획", "맞춤형 일정", "개인 취향", "유연한 스케줄"],
  },
]

export default function CreateTripPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    template: "",
    title: "",
    destination: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    description: "",
    coverImage: null as File | null,
    budget: "",
    isPublic: false,
    inviteEmails: [] as string[],
  })

  const [emailInput, setEmailInput] = useState("")
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleAddEmail = () => {
    if (emailInput && !formData.inviteEmails.includes(emailInput)) {
      setFormData({
        ...formData,
        inviteEmails: [...formData.inviteEmails, emailInput],
      })
      setEmailInput("")
    }
  }

  const handleRemoveEmail = (email: string) => {
    setFormData({
      ...formData,
      inviteEmails: formData.inviteEmails.filter((e) => e !== email),
    })
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.template !== ""
      case 2:
        return formData.title && formData.destination && formData.startDate && formData.endDate
      case 3:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      console.log("여행 생성 데이터:", formData)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/trip/1")
    } catch (error) {
      console.error("여행 생성 실패:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedTemplate = tripTemplates.find((t) => t.id === formData.template)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>추천 페이지로 돌아가기</span>
            </Link>

            {/* 진행 상황 표시 */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep >= step
                        ? "bg-blue-600 text-white"
                        : currentStep === step
                          ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-8 h-0.5 mx-2 transition-colors ${
                        currentStep > step ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
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
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className={`flex items-center ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
              <span className="font-medium">1. 템플릿 선택</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
              <span className="font-medium">2. 기본 정보</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
              <span className="font-medium">3. 동행자 초대</span>
            </div>
          </div>
        </div>

        {/* Step 1: 템플릿 선택 */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">어떤 여행을 계획하시나요?</h1>
              <p className="text-gray-600 text-lg">템플릿을 선택하면 더 쉽게 여행을 계획할 수 있어요</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 border-2 ${template.color} ${
                    formData.template === template.id
                      ? "ring-2 ring-blue-500 shadow-lg scale-105 border-blue-300"
                      : "hover:shadow-md border-gray-200"
                  }`}
                  onClick={() => setFormData({ ...formData, template: template.id })}
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">{template.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700 mb-2">포함 요소:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedTemplate && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{selectedTemplate.icon}</div>
                    <div>
                      <h3 className="font-semibold text-blue-900">{selectedTemplate.name} 선택됨</h3>
                      <p className="text-blue-700">{selectedTemplate.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 2: 기본 정보 */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">여행 정보를 입력해주세요</h1>
              <p className="text-gray-600 text-lg">
                {selectedTemplate && (
                  <span className="inline-flex items-center space-x-2">
                    <span>{selectedTemplate.icon}</span>
                    <span>{selectedTemplate.name}</span>
                    <span>여행의 기본 정보를 설정해보세요</span>
                  </span>
                )}
              </p>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-8 space-y-6">
                {/* 커버 이미지 업로드 */}
                <div className="space-y-2">
                  <Label className="text-base font-medium text-gray-700">커버 이미지</Label>
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
                        <p className="text-sm text-gray-500 mb-4">JPG, PNG 파일 (최대 10MB)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="cover-image"
                        />
                        <Label htmlFor="cover-image">
                          <Button type="button" variant="outline" className="cursor-pointer bg-transparent">
                            이미지 선택
                          </Button>
                        </Label>
                      </div>
                    )}
                  </div>
                </div>

                {/* 여행 제목 */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium text-gray-700">
                    여행 제목 *
                  </Label>
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
                  <Label htmlFor="destination" className="text-base font-medium text-gray-700">
                    목적지 *
                  </Label>
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
                    <Label className="text-base font-medium text-gray-700">시작일 *</Label>
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
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium text-gray-700">종료일 *</Label>
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
                          disabled={(date) => {
                            if (formData.startDate) {
                              return date < formData.startDate
                            }
                            return date < new Date()
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* 예산 */}
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-base font-medium text-gray-700">
                    예상 예산 (선택)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₩</span>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="500000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="pl-8 h-12"
                    />
                  </div>
                  <p className="text-sm text-gray-500">예산을 설정하면 지출 관리에 도움이 됩니다</p>
                </div>

                {/* 여행 설명 */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium text-gray-700">
                    여행 설명
                  </Label>
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
                  <Label className="text-base font-medium text-gray-700">공개 설정</Label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors">
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

                    <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors">
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
        {currentStep === 3 && (
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
                  <Label className="text-base font-medium text-gray-700">이메일로 초대</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="이메일 주소를 입력하세요"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddEmail())}
                      className="h-12"
                    />
                    <Button
                      onClick={handleAddEmail}
                      disabled={!emailInput || !emailInput.includes("@")}
                      className="h-12 px-6"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      추가
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">초대받은 사람들은 이메일로 알림을 받게 됩니다</p>
                </div>

                {/* 초대된 이메일 목록 */}
                {formData.inviteEmails.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-base font-medium text-gray-700">
                      초대할 사람들 ({formData.inviteEmails.length}명)
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.inviteEmails.map((email) => (
                        <Badge key={email} variant="secondary" className="px-3 py-2 text-sm">
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

                {/* 권한 안내 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">초대된 멤버 권한</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 여행 일정 보기 및 편집</li>
                    <li>• 사진 업로드 및 공유</li>
                    <li>• 체크리스트 관리</li>
                    <li>• 지출 내역 추가</li>
                  </ul>
                </div>

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
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1} className="px-8 bg-transparent">
            <ChevronLeft className="w-4 h-4 mr-2" />
            이전
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepValid() || isSubmitting}
            className="px-8 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
          >
            {isSubmitting ? (
              "생성 중..."
            ) : currentStep === 3 ? (
              "여행 만들기"
            ) : (
              <>
                다음
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

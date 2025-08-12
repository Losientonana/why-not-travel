"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, MapPin, Calendar, Users, Globe, Lock, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

const tripTemplates = [
  { id: "healing", name: "힐링 여행", description: "휴식과 재충전을 위한 여행", icon: "🌿" },
  { id: "food", name: "맛집 투어", description: "현지 음식을 즐기는 여행", icon: "🍽️" },
  { id: "culture", name: "문화 탐방", description: "역사와 문화를 체험하는 여행", icon: "🏛️" },
  { id: "adventure", name: "모험 여행", description: "액티비티와 스포츠 중심 여행", icon: "🏔️" },
  { id: "custom", name: "직접 계획", description: "처음부터 직접 계획하기", icon: "✏️" },
]

export default function CreateTripPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    coverImage: null as File | null,
    isPublic: false,
    template: "",
    inviteEmails: [] as string[],
  })
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState("")

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

  const addInviteEmail = () => {
    if (inviteEmail && !formData.inviteEmails.includes(inviteEmail)) {
      setFormData({
        ...formData,
        inviteEmails: [...formData.inviteEmails, inviteEmail],
      })
      setInviteEmail("")
    }
  }

  const removeInviteEmail = (email: string) => {
    setFormData({
      ...formData,
      inviteEmails: formData.inviteEmails.filter((e) => e !== email),
    })
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log("Creating trip:", formData)
    // Redirect to trip detail page
    window.location.href = "/trip/1"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  돌아가기
                </Button>
              </Link>
              <h1 className="text-lg font-semibold">새 여행 만들기</h1>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= num ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Template Selection */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">어떤 여행을 계획하시나요?</h2>
              <p className="text-gray-600">템플릿을 선택하면 더 쉽게 여행을 계획할 수 있어요</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    formData.template === template.id ? "ring-2 ring-primary-500 bg-primary-50" : ""
                  }`}
                  onClick={() => setFormData({ ...formData, template: template.id })}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{template.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.template}
                className="bg-primary-500 hover:bg-primary-600"
              >
                다음 단계
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Basic Information */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">여행 정보를 입력해주세요</h2>
              <p className="text-gray-600">기본적인 여행 정보를 설정해보세요</p>
            </div>

            <Card>
              <CardContent className="p-8 space-y-6">
                {/* Cover Image Upload */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">커버 이미지</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
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
                        <Label htmlFor="cover-image">
                          <Button type="button" variant="outline" className="cursor-pointer bg-transparent">
                            이미지 선택
                          </Button>
                        </Label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trip Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">
                    여행 제목 *
                  </Label>
                  <Input
                    id="title"
                    placeholder="예: 제주도 힐링 여행"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-lg"
                  />
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-base font-medium">
                    목적지 *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="destination"
                      placeholder="예: 제주도"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="pl-10 text-lg"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">시작일 *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.startDate ? (
                            format(formData.startDate, "PPP", { locale: ko })
                          ) : (
                            <span>날짜를 선택하세요</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => setFormData({ ...formData, startDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">종료일 *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.endDate ? (
                            format(formData.endDate, "PPP", { locale: ko })
                          ) : (
                            <span>날짜를 선택하세요</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
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

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">
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

                {/* Privacy Settings */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">공개 설정</Label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="radio"
                        name="privacy"
                        checked={!formData.isPublic}
                        onChange={() => setFormData({ ...formData, isPublic: false })}
                        className="text-primary-600"
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
                        className="text-primary-600"
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

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="bg-transparent">
                이전 단계
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!formData.title || !formData.destination || !formData.startDate || !formData.endDate}
                className="bg-primary-500 hover:bg-primary-600"
              >
                다음 단계
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Invite Members */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">동행자를 초대해보세요</h2>
              <p className="text-gray-600">함께 여행할 사람들을 초대하거나 나중에 추가할 수 있어요</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  동행자 초대
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Invite */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">이메일로 초대</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="이메일 주소를 입력하세요"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addInviteEmail()}
                    />
                    <Button onClick={addInviteEmail} disabled={!inviteEmail}>
                      <Plus className="w-4 h-4 mr-2" />
                      추가
                    </Button>
                  </div>
                </div>

                {/* Invited Emails */}
                {formData.inviteEmails.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-base font-medium">초대할 사람들</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.inviteEmails.map((email) => (
                        <Badge key={email} variant="secondary" className="px-3 py-1">
                          {email}
                          <button
                            onClick={() => removeInviteEmail(email)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skip Option */}
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">지금 초대하지 않고 나중에 추가할 수도 있어요</p>
                  <Button variant="outline" onClick={handleSubmit} className="bg-transparent">
                    나중에 초대하기
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} className="bg-transparent">
                이전 단계
              </Button>
              <Button onClick={handleSubmit} className="bg-gradient-to-r from-primary-500 to-coral-500 text-white">
                여행 만들기
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

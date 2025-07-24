"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin } from "lucide-react"
import api from "@/lib/axios"

export default function CreateTripPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    visibility: "public", // Default to public
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await api.post("/api/trips", formData)
      alert("여행 계획이 성공적으로 생성되었습니다!")
      router.push("/dashboard") // Redirect to dashboard after creation
    } catch (err: any) {
      console.error("여행 계획 생성 실패:", err)
      setError(err.response?.data || "여행 계획 생성 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
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
              <span>내 여행으로 돌아가기</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TravelMate</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">새 여행 만들기</h1>
          <p className="text-gray-600">친구들과 함께할 특별한 여행을 계획해보세요</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              여행 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 여행 제목 */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  여행 제목 *
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="예: 제주도 힐링 여행"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {/* 여행 날짜 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    출발일 *
                  </label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                    도착일 *
                  </label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              {/* 여행 설명 */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  여행 설명
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="이번 여행에 대해 간단히 설명해주세요..."
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={4}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* 제출 버튼 */}
              <div className="flex gap-4 pt-6">
                <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="/dashboard">취소</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "생성 중..." : "여행 만들기"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

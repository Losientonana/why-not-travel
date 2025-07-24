"use client"

import { useState } from "react"
import {
  MapPin,
  Calendar,
  Users,
  Camera,
  CheckSquare,
  DollarSign,
  Plus,
  Edit,
  Share2,
  ArrowLeft,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

// Mock data
const tripData = {
  id: "1",
  title: "제주도 힐링 여행",
  destination: "제주도",
  startDate: "2024-03-15",
  endDate: "2024-03-18",
  coverImage: "/placeholder.svg?height=300&width=800",
  status: "planning",
  totalBudget: 800000,
  spentAmount: 450000,
  participants: [
    { id: "1", name: "김여행", avatar: "/placeholder.svg", role: "owner" },
    { id: "2", name: "박모험", avatar: "/placeholder.svg", role: "editor" },
    { id: "3", name: "이탐험", avatar: "/placeholder.svg", role: "viewer" },
  ],
}

const scheduleData = [
  {
    day: 1,
    date: "2024-03-15",
    activities: [
      { id: "1", time: "09:00", title: "제주공항 도착", location: "제주국제공항", type: "transport" },
      { id: "2", time: "14:00", title: "성산일출봉", location: "성산일출봉", type: "attraction" },
      { id: "3", time: "18:00", title: "저녁식사", location: "올레국수", type: "food" },
    ],
  },
  {
    day: 2,
    date: "2024-03-16",
    activities: [
      { id: "4", time: "08:00", title: "한라산 등반", location: "한라산국립공원", type: "activity" },
      { id: "5", time: "19:00", title: "흑돼지 구이", location: "돈사돈", type: "food" },
    ],
  },
]

const albumData = [
  { id: "1", image: "/placeholder.svg", title: "제주공항 도착!", date: "2024-03-15", likes: 12 },
  { id: "2", image: "/placeholder.svg", title: "성산일출봉 일몰", date: "2024-03-15", likes: 24 },
  { id: "3", image: "/placeholder.svg", title: "한라산 정상", date: "2024-03-16", likes: 18 },
]

const checklistData = [
  { id: "1", title: "항공권 예약", completed: true, assignee: "김여행" },
  { id: "2", title: "숙소 예약", completed: true, assignee: "박모험" },
  { id: "3", title: "렌터카 예약", completed: false, assignee: "이탐험" },
  { id: "4", title: "여행자보험", completed: false, assignee: "김여행" },
]

const expenseData = [
  { id: "1", category: "교통", amount: 180000, paidBy: "김여행", date: "2024-03-15" },
  { id: "2", category: "숙박", amount: 240000, paidBy: "박모험", date: "2024-03-14" },
  { id: "3", category: "식비", amount: 30000, paidBy: "이탐험", date: "2024-03-15" },
]

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  돌아가기
                </Button>
              </Link>
              <h1 className="text-lg font-semibold truncate">{tripData.title}</h1>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                편집
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Trip Cover */}
      <div className="relative h-64">
        <img
          src={tripData.coverImage || "/placeholder.svg"}
          alt={tripData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{tripData.title}</h1>
          <div className="flex items-center space-x-4 text-white/90">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{tripData.destination}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>
                {new Date(tripData.startDate).toLocaleDateString("ko-KR")} -{" "}
                {new Date(tripData.endDate).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute top-6 right-6">
          <Badge className="bg-blue-100 text-blue-800">계획중</Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">요약</TabsTrigger>
            <TabsTrigger value="schedule">일정표</TabsTrigger>
            <TabsTrigger value="album">앨범</TabsTrigger>
            <TabsTrigger value="checklist">체크리스트</TabsTrigger>
            <TabsTrigger value="expense">경비</TabsTrigger>
            <TabsTrigger value="members">멤버</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="md:col-span-1 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">여행 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">기간</p>
                      <p className="font-medium">4일 3박</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">동행자</p>
                      <div className="flex -space-x-2">
                        {tripData.participants.slice(0, 3).map((participant) => (
                          <Avatar key={participant.id} className="w-8 h-8 border-2 border-white">
                            <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{participant.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">+{tripData.participants.length}명</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">예산</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">사용</span>
                          <span className="text-sm font-medium">₩{tripData.spentAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${(tripData.spentAmount / tripData.totalBudget) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>총 예산: ₩{tripData.totalBudget.toLocaleString()}</span>
                          <span>{Math.round((tripData.spentAmount / tripData.totalBudget) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Map */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>여행 경로</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p>지도 뷰</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">일정표</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                일정 추가
              </Button>
            </div>

            <div className="space-y-6">
              {scheduleData.map((day) => (
                <Card key={day.day}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        {day.day}일차 - {new Date(day.date).toLocaleDateString("ko-KR")}
                      </span>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        추가
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {day.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-grab"
                        >
                          <div className="w-16 text-sm font-medium text-gray-600 flex-shrink-0">{activity.time}</div>
                          <div className="flex-1">
                            <h4 className="font-medium">{activity.title}</h4>
                            <p className="text-sm text-gray-600">{activity.location}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.type === "transport"
                              ? "이동"
                              : activity.type === "food"
                                ? "식사"
                                : activity.type === "attraction"
                                  ? "관광"
                                  : "활동"}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Album Tab */}
          <TabsContent value="album" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">여행 앨범</h2>
              <Button>
                <Camera className="w-4 h-4 mr-2" />
                사진 추가
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {albumData.map((photo) => (
                <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-square relative">
                    <img
                      src={photo.image || "/placeholder.svg"}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm mb-1 truncate">{photo.title}</h4>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(photo.date).toLocaleDateString("ko-KR")}</span>
                      <span>❤️ {photo.likes}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">체크리스트</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                항목 추가
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {checklistData.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                        item.completed ? "bg-green-50" : "bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        readOnly
                      />
                      <div className="flex-1">
                        <span
                          className={`font-medium ${item.completed ? "text-gray-500 line-through" : "text-gray-900"}`}
                        >
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="text-xs">{item.assignee[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">{item.assignee}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expense Tab */}
          <TabsContent value="expense" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">경비 관리</h2>
              <Button>
                <DollarSign className="w-4 h-4 mr-2" />
                지출 추가
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Budget Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">예산 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-600">₩{tripData.spentAmount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">사용 금액</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-coral-500 h-3 rounded-full"
                        style={{ width: `${(tripData.spentAmount / tripData.totalBudget) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>남은 예산</span>
                      <span className="font-medium">
                        ₩{(tripData.totalBudget - tripData.spentAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expense List */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">지출 내역</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expenseData.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium">{expense.category}</p>
                            <p className="text-sm text-gray-600">
                              {expense.paidBy} · {new Date(expense.date).toLocaleDateString("ko-KR")}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold">₩{expense.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">동행자 관리</h2>
              <Button>
                <Users className="w-4 h-4 mr-2" />
                초대하기
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {tripData.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{participant.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-gray-600">
                            {participant.role === "owner" ? "방장" : participant.role === "editor" ? "편집자" : "뷰어"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            participant.role === "owner"
                              ? "default"
                              : participant.role === "editor"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {participant.role === "owner" ? "방장" : participant.role === "editor" ? "편집자" : "뷰어"}
                        </Badge>
                        {participant.role !== "owner" && (
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-6 py-2">
          {[
            { key: "overview", icon: MapPin, label: "요약" },
            { key: "schedule", icon: Calendar, label: "일정" },
            { key: "album", icon: Camera, label: "앨범" },
            { key: "checklist", icon: CheckSquare, label: "체크" },
            { key: "expense", icon: DollarSign, label: "경비" },
            { key: "members", icon: Users, label: "멤버" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center py-2 ${
                activeTab === tab.key ? "text-primary-600" : "text-gray-600"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

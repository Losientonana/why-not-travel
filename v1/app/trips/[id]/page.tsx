"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Users, Camera, Share2, Edit, MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for trip details
const mockTrip = {
  id: "1",
  title: "제주도 힐링 여행",
  destination: "제주도",
  startDate: "2024-03-15",
  endDate: "2024-03-18",
  status: "upcoming",
  coverImage: "/placeholder.svg?height=400&width=800",
  description: "친구들과 함께하는 제주도 힐링 여행입니다. 아름다운 자연과 맛있는 음식을 즐기며 소중한 추억을 만들어요!",
  participants: [
    { id: "1", name: "김여행", email: "kim@example.com", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "2", name: "박모험", email: "park@example.com", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "3", name: "이탐험", email: "lee@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  ],
  itinerary: [
    {
      date: "2024-03-15",
      day: "Day 1",
      activities: [
        { time: "09:00", title: "제주공항 도착", location: "제주국제공항" },
        { time: "11:00", title: "렌터카 픽업", location: "제주공항 렌터카" },
        { time: "12:30", title: "점심식사", location: "흑돼지 맛집" },
        { time: "14:00", title: "숙소 체크인", location: "제주 리조트" },
        { time: "16:00", title: "해변 산책", location: "협재해수욕장" },
      ],
    },
    {
      date: "2024-03-16",
      day: "Day 2",
      activities: [
        { time: "08:00", title: "조식", location: "호텔 레스토랑" },
        { time: "09:30", title: "한라산 등반", location: "한라산 국립공원" },
        { time: "12:00", title: "산중 도시락", location: "한라산" },
        { time: "15:00", title: "하산 및 휴식", location: "숙소" },
        { time: "18:00", title: "저녁식사", location: "해산물 맛집" },
      ],
    },
  ],
  photos: [
    { id: "1", url: "/placeholder.svg?height=200&width=200", caption: "제주공항 도착!" },
    { id: "2", url: "/placeholder.svg?height=200&width=200", caption: "협재해수욕장 석양" },
    { id: "3", url: "/placeholder.svg?height=200&width=200", caption: "흑돼지 맛집" },
    { id: "4", url: "/placeholder.svg?height=200&width=200", caption: "한라산 정상" },
  ],
}

const statusConfig = {
  planning: { label: "계획중", color: "bg-yellow-100 text-yellow-800" },
  upcoming: { label: "예정", color: "bg-blue-100 text-blue-800" },
  ongoing: { label: "여행중", color: "bg-green-100 text-green-800" },
  completed: { label: "완료", color: "bg-gray-100 text-gray-800" },
}

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

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
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                편집
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <img
          src={mockTrip.coverImage || "/placeholder.svg"}
          alt={mockTrip.title}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{mockTrip.title}</h1>
                <div className="flex items-center space-x-4 text-lg">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-1" />
                    {mockTrip.destination}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-1" />
                    {new Date(mockTrip.startDate).toLocaleDateString("ko-KR")} -{" "}
                    {new Date(mockTrip.endDate).toLocaleDateString("ko-KR")}
                  </div>
                </div>
              </div>
              <Badge className={statusConfig[mockTrip.status as keyof typeof statusConfig].color}>
                {statusConfig[mockTrip.status as keyof typeof statusConfig].label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="itinerary">일정</TabsTrigger>
            <TabsTrigger value="photos">사진</TabsTrigger>
            <TabsTrigger value="members">멤버</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>여행 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{mockTrip.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">여행 기간</p>
                      <p className="font-medium">
                        {new Date(mockTrip.startDate).toLocaleDateString("ko-KR")} -{" "}
                        {new Date(mockTrip.endDate).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">참여자</p>
                      <p className="font-medium">{mockTrip.participants.length}명</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Camera className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">사진</p>
                      <p className="font-medium">{mockTrip.photos.length}장</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">여행 일정</h2>
              <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                일정 추가
              </Button>
            </div>

            <div className="space-y-6">
              {mockTrip.itinerary.map((day, dayIndex) => (
                <Card key={dayIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        {day.day} - {new Date(day.date).toLocaleDateString("ko-KR")}
                      </span>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50">
                          <div className="text-sm font-medium text-blue-600 min-w-[60px]">{activity.time}</div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{activity.title}</h4>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {activity.location}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">여행 사진</h2>
              <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                사진 추가
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockTrip.photos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <img src={photo.url || "/placeholder.svg"} alt={photo.caption} className="w-full h-48 object-cover" />
                  <CardContent className="p-3">
                    <p className="text-sm text-gray-600">{photo.caption}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">여행 멤버</h2>
              <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                멤버 초대
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockTrip.participants.map((participant) => (
                <Card key={participant.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                        <AvatarFallback>{participant.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{participant.name}</h3>
                        <p className="text-sm text-gray-600">{participant.email}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

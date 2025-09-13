"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Plus,
  Search,
  Calendar,
  Users,
  Camera,
  Settings,
  Filter,
  Grid3X3,
  List,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react"

// Mock data
const mockTrips = [
  {
    id: 1,
    title: "제주도 힐링 여행",
    destination: "제주도",
    startDate: "2024-03-15",
    endDate: "2024-03-18",
    status: "upcoming",
    coverImage: "/placeholder.svg?height=200&width=300&text=제주도+힐링+여행",
    participants: 3,
    photos: 0,
    budget: 800000,
    spent: 0,
    isOwner: true,
  },
  {
    id: 2,
    title: "부산 맛집 투어",
    destination: "부산",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    status: "completed",
    coverImage: "/placeholder.svg?height=200&width=300&text=부산+맛집+투어",
    participants: 2,
    photos: 24,
    budget: 500000,
    spent: 480000,
    isOwner: true,
  },
  {
    id: 3,
    title: "서울 문화 탐방",
    destination: "서울",
    startDate: "2024-04-01",
    endDate: "2024-04-03",
    status: "planning",
    coverImage: "/placeholder.svg?height=200&width=300&text=서울+문화+탐방",
    participants: 4,
    photos: 0,
    budget: 300000,
    spent: 0,
    isOwner: false,
  },
]

const popularTrips = [
  {
    id: 4,
    title: "강릉 바다 여행",
    destination: "강릉",
    author: "바다사랑",
    likes: 156,
    coverImage: "/placeholder.svg?height=200&width=300&text=강릉+바다+여행",
    participants: 3,
    duration: "2박 3일",
  },
  {
    id: 5,
    title: "경주 역사 탐방",
    destination: "경주",
    author: "역사탐험가",
    likes: 89,
    coverImage: "/placeholder.svg?height=200&width=300&text=경주+역사+탐방",
    participants: 5,
    duration: "3박 4일",
  },
  {
    id: 6,
    title: "전주 한옥마을",
    destination: "전주",
    author: "전통문화",
    likes: 124,
    coverImage: "/placeholder.svg?height=200&width=300&text=전주+한옥마을",
    participants: 2,
    duration: "1박 2일",
  },
]

const statusConfig = {
  planning: { label: "계획중", color: "bg-yellow-100 text-yellow-800" },
  upcoming: { label: "예정", color: "bg-blue-100 text-blue-800" },
  ongoing: { label: "여행중", color: "bg-green-100 text-green-800" },
  completed: { label: "완료", color: "bg-gray-100 text-gray-800" },
}

export default function TripsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("my-trips")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTrips = mockTrips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || trip.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const filteredPopularTrips = popularTrips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">여행 관리</h1>
            <p className="text-gray-600">나의 여행을 관리하고 새로운 여행을 발견해보세요</p>
          </div>

          <Link href="/trip/create">
            <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />새 여행 만들기
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="여행 제목이나 목적지로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              필터
            </Button>

            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="my-trips" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />내 여행
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              인기 여행
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              최근 활동
            </TabsTrigger>
          </TabsList>

          {/* My Trips Tab */}
          <TabsContent value="my-trips" className="space-y-6">
            {/* Status Filter */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {[
                { key: "all", label: "전체" },
                { key: "planning", label: "계획중" },
                { key: "upcoming", label: "예정" },
                { key: "ongoing", label: "여행중" },
                { key: "completed", label: "완료" },
              ].map((status) => (
                <Button
                  key={status.key}
                  variant={statusFilter === status.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status.key)}
                  className="whitespace-nowrap"
                >
                  {status.label}
                </Button>
              ))}
            </div>

            {filteredTrips.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">여행이 없습니다</h3>
                <p className="text-gray-600 mb-4">첫 번째 여행을 계획해보세요!</p>
                <Link href="/trip/create">
                  <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />새 여행 만들기
                  </Button>
                </Link>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredTrips.map((trip) => (
                  <Link key={trip.id} href={`/trips/${trip.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md">
                      <CardContent className="p-0">
                        {viewMode === "grid" ? (
                          <>
                            <div className="relative">
                              <img
                                src={trip.coverImage || "/placeholder.svg"}
                                alt={trip.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <Badge
                                className={`absolute top-3 right-3 ${statusConfig[trip.status as keyof typeof statusConfig].color}`}
                              >
                                {statusConfig[trip.status as keyof typeof statusConfig].label}
                              </Badge>
                              {trip.isOwner && (
                                <Badge className="absolute top-3 left-3 bg-blue-600 text-white">내 여행</Badge>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 mb-1">{trip.title}</h3>
                              <p className="text-sm text-gray-600 mb-3 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {trip.destination}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(trip.startDate).toLocaleDateString("ko-KR", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    {trip.participants}
                                  </div>
                                  <div className="flex items-center">
                                    <Camera className="w-3 h-3 mr-1" />
                                    {trip.photos}
                                  </div>
                                </div>
                              </div>
                              {/* Budget Progress */}
                              {trip.budget > 0 && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs text-gray-600">
                                    <span>예산 사용</span>
                                    <span>{Math.round((trip.spent / trip.budget) * 100)}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-600 h-1.5 rounded-full"
                                      style={{ width: `${Math.min((trip.spent / trip.budget) * 100, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center p-4 space-x-4">
                            <img
                              src={trip.coverImage || "/placeholder.svg"}
                              alt={trip.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-gray-900">{trip.title}</h3>
                                <div className="flex space-x-2">
                                  {trip.isOwner && <Badge className="bg-blue-600 text-white text-xs">내 여행</Badge>}
                                  <Badge className={statusConfig[trip.status as keyof typeof statusConfig].color}>
                                    {statusConfig[trip.status as keyof typeof statusConfig].label}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {trip.destination}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(trip.startDate).toLocaleDateString("ko-KR", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                                <div className="flex items-center">
                                  <Users className="w-3 h-3 mr-1" />
                                  {trip.participants}
                                </div>
                                <div className="flex items-center">
                                  <Camera className="w-3 h-3 mr-1" />
                                  {trip.photos}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Popular Trips Tab */}
          <TabsContent value="popular" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">인기 여행</h2>
              <Link href="/explore" className="text-blue-600 hover:text-blue-700">
                더보기
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPopularTrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href={`/explore/${trip.id}`}>
                    <div className="relative">
                      <img
                        src={trip.coverImage || "/placeholder.svg"}
                        alt={trip.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{trip.likes}</span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{trip.title}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{trip.destination}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>by {trip.author}</span>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            <span>{trip.participants}명</span>
                          </div>
                          <span>{trip.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recent Activity Tab */}
          <TabsContent value="recent" className="space-y-6">
            <h2 className="text-2xl font-bold">최근 활동</h2>
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src="/placeholder.svg?height=40&width=40&text=김"
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">김여행</span>님이
                      <span className="font-medium text-blue-600"> 제주도 힐링 여행</span>에 새로운 사진을 추가했습니다.
                    </p>
                    <p className="text-xs text-gray-500">2시간 전</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src="/placeholder.svg?height=40&width=40&text=박"
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">박모험</span>님이
                      <span className="font-medium text-blue-600"> 부산 맛집 투어</span> 여행을 완료했습니다.
                    </p>
                    <p className="text-xs text-gray-500">1일 전</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src="/placeholder.svg?height=40&width=40&text=이"
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">이탐험</span>님이 새로운 여행
                      <span className="font-medium text-blue-600"> 강릉 바다 여행</span>을 계획하기 시작했습니다.
                    </p>
                    <p className="text-xs text-gray-500">2일 전</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

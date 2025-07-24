"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Plus, Search, Calendar, Users, Camera, Settings, Filter, Grid3X3, List } from "lucide-react"

// Mock data
const mockTrips = [
  {
    id: 1,
    title: "제주도 힐링 여행",
    destination: "제주도",
    startDate: "2024-03-15",
    endDate: "2024-03-18",
    status: "upcoming",
    coverImage: "/placeholder.svg?height=200&width=300",
    participants: 3,
    photos: 0,
  },
  {
    id: 2,
    title: "부산 맛집 투어",
    destination: "부산",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    status: "completed",
    coverImage: "/placeholder.svg?height=200&width=300",
    participants: 2,
    photos: 24,
  },
  {
    id: 3,
    title: "서울 문화 탐방",
    destination: "서울",
    startDate: "2024-04-01",
    endDate: "2024-04-03",
    status: "planning",
    coverImage: "/placeholder.svg?height=200&width=300",
    participants: 4,
    photos: 0,
  },
]

const statusConfig = {
  planning: { label: "계획중", color: "bg-yellow-100 text-yellow-800" },
  upcoming: { label: "예정", color: "bg-blue-100 text-blue-800" },
  ongoing: { label: "여행중", color: "bg-green-100 text-green-800" },
  completed: { label: "완료", color: "bg-gray-100 text-gray-800" },
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("all")

  const filteredTrips = mockTrips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && trip.status === activeTab
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TravelMate</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  설정
                </Button>
              </Link>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">김</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">내 여행</h1>
            <p className="text-gray-600">계획하고, 기록하고, 추억하세요</p>
          </div>

          <Link href="/trips/create">
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-4">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="planning">계획중</TabsTrigger>
            <TabsTrigger value="upcoming">예정</TabsTrigger>
            <TabsTrigger value="completed">완료</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredTrips.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">여행이 없습니다</h3>
                <p className="text-gray-600 mb-4">첫 번째 여행을 계획해보세요!</p>
                <Link href="/trips/create">
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
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 mb-1">{trip.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">{trip.destination}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
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
                                <Badge className={statusConfig[trip.status as keyof typeof statusConfig].color}>
                                  {statusConfig[trip.status as keyof typeof statusConfig].label}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{trip.destination}</p>
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
        </Tabs>
      </div>
    </div>
  )
}

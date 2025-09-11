"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Settings, Camera, MapPin, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserInfo, UserInfo } from "@/lib/auth";

// Mock user data
const mockUser = {
  id: "1",
  name: "김여행",
  email: "kim@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  bio: "여행을 사랑하는 사람입니다. 새로운 곳을 탐험하고 추억을 만드는 것이 취미예요!",
  joinDate: "2023-01-15",
  stats: {
    totalTrips: 12,
    totalPhotos: 248,
    totalFriends: 15,
    totalLikes: 89,
  },
}

const mockRecentTrips = [
  {
    id: "1",
    title: "제주도 힐링 여행",
    destination: "제주도",
    date: "2024-03-15",
    status: "completed",
    coverImage: "/placeholder.svg?height=150&width=200",
    photos: 24,
  },
  {
    id: "2",
    title: "부산 맛집 투어",
    destination: "부산",
    date: "2024-02-10",
    status: "completed",
    coverImage: "/placeholder.svg?height=150&width=200",
    photos: 18,
  },
  {
    id: "3",
    title: "서울 문화 탐방",
    destination: "서울",
    date: "2024-04-01",
    status: "upcoming",
    coverImage: "/placeholder.svg?height=150&width=200",
    photos: 0,
  },
]

const statusConfig = {
  planning: { label: "계획중", color: "bg-yellow-100 text-yellow-800" },
  upcoming: { label: "예정", color: "bg-blue-100 text-blue-800" },
  ongoing: { label: "여행중", color: "bg-green-100 text-green-800" },
  completed: { label: "완료", color: "bg-gray-100 text-gray-800" },
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await getUserInfo();
      setUser(userInfo);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const displayUser = user ? {
    ...mockUser,
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    avatar: `/placeholder.svg?height=100&width=100&text=${user.name[0]}`,
  } : mockUser;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={displayUser.avatar || "/placeholder.svg"} alt={displayUser.name} />
                  <AvatarFallback className="text-2xl">{displayUser.name[0]}</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-transparent"
                  variant="outline"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{displayUser.name}</h1>
                  <div className="flex space-x-2 mt-2 md:mt-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/profile/edit">
                        <Edit className="w-4 h-4 mr-2" />
                        프로필 편집
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{displayUser.email}</p>
                <p className="text-gray-700 mb-4">{displayUser.bio}</p>
                <p className="text-sm text-gray-500">
                  {new Date(displayUser.joinDate).toLocaleDateString("ko-KR")}에 가입
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{displayUser.stats.totalTrips}</div>
                <div className="text-sm text-gray-600">총 여행</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{displayUser.stats.totalPhotos}</div>
                <div className="text-sm text-gray-600">사진</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{displayUser.stats.totalFriends}</div>
                <div className="text-sm text-gray-600">친구</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{displayUser.stats.totalLikes}</div>
                <div className="text-sm text-gray-600">좋아요</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">최근 여행</TabsTrigger>
            <TabsTrigger value="photos">사진</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>

          {/* Recent Trips Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRecentTrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href={`/trips/${trip.id}`}>
                    <div className="relative">
                      <img
                        src={trip.coverImage || "/placeholder.svg"}
                        alt={trip.title}
                        className="w-full h-40 object-cover"
                      />
                      <Badge
                        className={`absolute top-3 right-3 ${statusConfig[trip.status as keyof typeof statusConfig].color}`}
                      >
                        {statusConfig[trip.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{trip.title}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{trip.destination}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(trip.date).toLocaleDateString("ko-KR")}</span>
                        </div>
                        <div className="flex items-center">
                          <Camera className="w-4 h-4 mr-1" />
                          <span>{trip.photos}장</span>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">사진이 없습니다</h3>
              <p className="text-gray-600">여행을 떠나서 첫 번째 사진을 업로드해보세요!</p>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>계정 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/profile/edit">
                    <Edit className="w-4 h-4 mr-2" />
                    프로필 편집
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  알림 설정
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="w-4 h-4 mr-2" />
                  친구 관리
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

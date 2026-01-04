"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  Heart,
  Search,
  Bell,
  ArrowRight,
  Calendar,
  Compass,
  ChevronRight,
  Sparkles,
  Clock,
  Award,
  TrendingUp,
  Users,
  Star,
  Zap,
  Target,
  Globe,
  Activity,
  BarChart3,
  Utensils,
  CameraIcon,
  MessageCircle,
  RefreshCw,
  Eye,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context";

// Enhanced Mock Data with more realistic content
const mockUser = {
  id: "1",
  name: "김여행",
  email: "kim@example.com",
  avatar: "/placeholder.svg?height=40&width=40&text=김",
  level: 12,
  points: 2840,
  completedTrips: 8,
  totalPhotos: 156,
  friends: 24,
  badges: ["여행왕", "사진작가", "맛집헌터"],
}

const personalizedRecommendations = [
  {
    id: "1",
    title: "제주도 봄꽃 축제",
    location: "제주도",
    image: "/placeholder.svg?height=400&width=600&text=제주도+봄꽃+축제",
    description: "유채꽃과 벚꽃이 만드는 봄의 향연을 만끽하세요",
    tags: ["꽃구경", "드라이브", "힐링", "사진촬영"],
    duration: "2박 3일",
    budget: "35만원",
    season: "지금이 딱!",
    weather: "맑음 22°C",
    popularity: 95,
    aiScore: 98,
    reasons: ["과거 힐링 여행 선호", "봄 시즌 활동적", "사진 촬영 관심"],
    activities: ["유채꽃밭 투어", "한라산 등반", "해안도로 드라이브", "전통시장 탐방"],
    bestTime: "3-4월",
    difficulty: "쉬움",
  },
  {
    id: "2",
    title: "부산 바다 & 맛집 투어",
    location: "부산",
    image: "/placeholder.svg?height=400&width=600&text=부산+바다+맛집",
    description: "따뜻해진 바다와 신선한 해산물의 완벽한 조합",
    tags: ["바다", "맛집", "사진", "도시"],
    duration: "1박 2일",
    budget: "25만원",
    season: "봄 추천",
    weather: "구름조금 19°C",
    popularity: 88,
    aiScore: 92,
    reasons: ["맛집 탐방 이력", "해안 여행 선호", "단기 여행 패턴"],
    activities: ["해운대 해변", "자갈치시장", "감천문화마을", "광안리 야경"],
    bestTime: "4-5월",
    difficulty: "쉬움",
  },
  {
    id: "3",
    title: "경주 역사문화 탐방",
    location: "경주",
    image: "/placeholder.svg?height=400&width=600&text=경주+역사문화",
    description: "천년 고도의 깊은 역사와 문화를 체험하세요",
    tags: ["역사", "문화", "유적지", "교육"],
    duration: "2박 3일",
    budget: "30만원",
    season: "연중 추천",
    weather: "맑음 20°C",
    popularity: 82,
    aiScore: 85,
    reasons: ["문화 체험 관심", "교육적 여행 선호", "역사 관련 활동"],
    activities: ["불국사", "석굴암", "첨성대", "안압지"],
    bestTime: "3-5월, 9-11월",
    difficulty: "보통",
  },
]

const quickActions = [
  {
    title: "AI 여행 계획",
    description: "AI가 맞춤 여행을 추천해드려요",
    icon: <Sparkles className="w-8 h-8" />,
    href: "/trip/create",
    color: "from-purple-600 to-pink-500",
    highlight: true,
    badge: "NEW",
  },
  {
    title: "내 여행 관리",
    description: "진행중인 여행들을 확인하세요",
    icon: <Calendar className="w-8 h-8" />,
    href: "/trips",
    color: "from-blue-600 to-cyan-500",
    count: 3,
  },
  {
    title: "여행지 탐색",
    description: "전 세계 인기 여행지를 둘러보세요",
    icon: <Globe className="w-8 h-8" />,
    href: "/explore",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "추억 기록",
    description: "여행 사진과 일기를 남겨보세요",
    icon: <CameraIcon className="w-8 h-8" />,
    href: "/memories",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "친구 찾기",
    description: "함께 여행할 친구들을 찾아보세요",
    icon: <Users className="w-8 h-8" />,
    href: "/friends",
    color: "from-indigo-500 to-purple-500",
  },
  {
    title: "여행 통계",
    description: "나의 여행 데이터를 분석해보세요",
    icon: <BarChart3 className="w-8 h-8" />,
    href: "/stats",
    color: "from-teal-500 to-blue-500",
  },
]

const trendingDestinations = [
  {
    id: "1",
    title: "강릉 바다 여행",
    location: "강릉",
    image: "/placeholder.svg?height=300&width=400&text=강릉+바다",
    trend: "🔥 HOT",
    trendValue: "+45%",
    likes: 1234,
    views: 15600,
    description: "따뜻한 봄바다와 커피의 도시",
    tags: ["바다", "커피", "힐링"],
    rating: 4.8,
    reviewCount: 156,
    priceRange: "20-30만원",
    bestSeason: "봄, 여름",
    activities: ["해변 산책", "커피 투어", "일출 명소"],
    weather: "맑음 18°C",
    crowdLevel: "보통",
  },
  {
    id: "2",
    title: "전주 한옥마을",
    location: "전주",
    image: "/placeholder.svg?height=300&width=400&text=전주+한옥마을",
    trend: "⭐ 인기",
    trendValue: "+32%",
    likes: 892,
    views: 12400,
    description: "전통과 맛의 완벽한 조화",
    tags: ["전통", "맛집", "문화"],
    rating: 4.7,
    reviewCount: 203,
    priceRange: "15-25만원",
    bestSeason: "연중",
    activities: ["한옥 체험", "전통 음식", "공예 체험"],
    weather: "구름조금 21°C",
    crowdLevel: "혼잡",
  },
  {
    id: "3",
    title: "설악산 국립공원",
    location: "속초",
    image: "/placeholder.svg?height=300&width=400&text=설악산+국립공원",
    trend: "📈 상승",
    trendValue: "+28%",
    likes: 756,
    views: 9800,
    description: "웅장한 자연과 등산의 즐거움",
    tags: ["등산", "자연", "모험"],
    rating: 4.9,
    reviewCount: 89,
    priceRange: "25-35만원",
    bestSeason: "봄, 가을",
    activities: ["등산", "케이블카", "온천"],
    weather: "맑음 16°C",
    crowdLevel: "보통",
  },
  {
    id: "4",
    title: "여수 밤바다",
    location: "여수",
    image: "/placeholder.svg?height=300&width=400&text=여수+밤바다",
    trend: "🌟 추천",
    trendValue: "+22%",
    likes: 634,
    views: 8200,
    description: "로맨틱한 야경과 해산물의 천국",
    tags: ["야경", "로맨틱", "해산물"],
    rating: 4.6,
    reviewCount: 124,
    priceRange: "30-40만원",
    bestSeason: "봄, 여름",
    activities: ["야경 투어", "해산물 맛집", "케이블카"],
    weather: "구름많음 19°C",
    crowdLevel: "보통",
  },
]

const friendActivities = [
  {
    id: "1",
    user: {
      name: "박모험",
      avatar: "/placeholder.svg?height=40&width=40&text=박",
      level: 8,
    },
    action: "제주도 여행을 완료했어요",
    type: "trip_completed",
    time: "2시간 전",
    details: {
      tripTitle: "제주도 힐링 여행",
      duration: "3박 4일",
      photos: 24,
      rating: 5,
    },
    image: "/placeholder.svg?height=100&width=100&text=제주도",
    likes: 12,
    comments: 3,
  },
  {
    id: "2",
    user: {
      name: "이탐험",
      avatar: "/placeholder.svg?height=40&width=40&text=이",
      level: 15,
    },
    action: "부산 맛집 투어 계획을 세웠어요",
    type: "trip_planned",
    time: "5시간 전",
    details: {
      tripTitle: "부산 맛집 대탐험",
      startDate: "2024-04-15",
      participants: 4,
    },
    image: "/placeholder.svg?height=100&width=100&text=부산+맛집",
    likes: 8,
    comments: 5,
  },
  {
    id: "3",
    user: {
      name: "최여행",
      avatar: "/placeholder.svg?height=40&width=40&text=최",
      level: 12,
    },
    action: "강릉 여행 사진 15장을 업로드했어요",
    type: "photos_uploaded",
    time: "1일 전",
    details: {
      tripTitle: "강릉 바다 여행",
      photoCount: 15,
      location: "강릉",
    },
    image: "/placeholder.svg?height=100&width=100&text=강릉+사진",
    likes: 23,
    comments: 7,
  },
  {
    id: "4",
    user: {
      name: "정모험가",
      avatar: "/placeholder.svg?height=40&width=40&text=정",
      level: 20,
    },
    action: "새로운 배지 '맛집헌터'를 획득했어요",
    type: "badge_earned",
    time: "2일 전",
    details: {
      badgeName: "맛집헌터",
      description: "50개 이상의 맛집을 방문한 여행자",
    },
    likes: 18,
    comments: 4,
  },
]

const weeklyChallenge = {
  title: "이번 주 챌린지",
  description: "새로운 지역의 맛집 3곳 방문하기",
  progress: 2,
  total: 3,
  reward: "맛집탐험가 배지 + 100 포인트",
  timeLeft: "3일 남음",
  participants: 156,
}

const userStats = {
  thisMonth: {
    tripsPlanned: 2,
    photosUploaded: 45,
    placesVisited: 8,
    friendsConnected: 3,
  },
  achievements: [
    { name: "여행왕", icon: "👑", description: "10회 이상 여행 완료" },
    { name: "사진작가", icon: "📸", description: "100장 이상 사진 업로드" },
    { name: "맛집헌터", icon: "🍽️", description: "50곳 이상 맛집 방문" },
  ],
  travelStyle: {
    primary: "힐링 여행",
    secondary: "맛집 투어",
    preference: "자연 > 도시 > 문화",
  },
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("")
  const [currentRecommendation, setCurrentRecommendation] = useState(0)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState(null)

  // Auto-rotate recommendations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRecommendation((prev) => (prev + 1) % personalizedRecommendations.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const filteredDestinations = useMemo(() => {
    if (selectedFilter === "all") return trendingDestinations
    return trendingDestinations.filter((dest) => dest.tags.some((tag) => tag.includes(selectedFilter)))
  }, [selectedFilter])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  }

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring" as const,
        stiffness: 300,
      },
    },
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const displayUser = user ? {
    ...mockUser, // Keep other mock data for now
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    avatar: `/placeholder.svg?height=40&width=40&text=${user.name[0]}`,
  } : mockUser;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4">
        {/* Enhanced Hero Section */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="py-12 lg:py-20">
          <div className="text-center mb-12">
            <motion.div variants={itemVariants} className="flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-orange-500 mr-2" />
              <span className="text-orange-600 font-medium">{displayUser.name}님을 위한 AI 맞춤 추천</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              완벽한 여행을
              <motion.span
                className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                {" "}
                시작하세요
              </motion.span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI가 분석한 당신의 여행 스타일에 맞는 완벽한 여행지를 추천해드립니다
            </motion.p>

            {/* Enhanced Search Bar */}
            <motion.div variants={itemVariants} className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="어디로 떠나고 싶으세요?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 shadow-lg"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    AI 검색
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Compact AI Recommendations - 상단에 작게 배치 */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI 맞춤 추천</h3>
                <Badge className="bg-purple-100 text-purple-800 text-xs">
                  {personalizedRecommendations[currentRecommendation].aiScore}% 매치
                </Badge>
              </div>
              <Link href="/recommendations">
                <Button variant="outline" size="sm" className="bg-transparent text-sm">
                  전체보기
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {personalizedRecommendations.slice(0, 3).map((destination, index) => (
                <motion.div
                  key={destination.id}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="cursor-pointer"
                >
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                      <img
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-500 text-white border-0 text-xs">
                          <Sparkles className="w-2 h-2 mr-1" />
                          AI 추천
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-purple-500 text-white border-0 text-xs">{destination.aiScore}%</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-sm mb-1">{destination.title}</h4>
                      <div className="flex items-center text-xs text-gray-600 mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{destination.location}</span>
                        <span className="mx-2">•</span>
                        <span>{destination.duration}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{destination.description}</p>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-xs"
                      >
                        계획하기
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Content - Popular Destinations & Quick Actions */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Popular This Week */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-red-500" />
                  <h2 className="text-2xl font-bold text-gray-900">이번 주 인기 여행지</h2>
                </div>
                <Link href="/explore">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    더 보기
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {trendingDestinations.slice(0, 4).map((destination, index) => (
                  <motion.div
                    key={destination.id}
                    variants={itemVariants}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="cursor-pointer"
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="relative">
                        <img
                          src={destination.image || "/placeholder.svg"}
                          alt={destination.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-red-500 text-white border-0 text-xs">{destination.trend}</Badge>
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          <span className="text-xs font-medium">{destination.likes}</span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h3 className="font-bold text-lg mb-1">{destination.title}</h3>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>{destination.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 mr-1" />
                              <span>{destination.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">빠른 시작</h3>
                <div className="space-y-3">
                  {quickActions.slice(0, 4).map((action, index) => (
                    <motion.div key={index} whileHover={{ x: 4 }} className="group">
                      <Link href={action.href}>
                        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                              >
                                <div className="text-white scale-75">{action.icon}</div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {action.title}
                                </h4>
                                <p className="text-xs text-gray-600 truncate">{action.description}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* User Quick Stats */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">나의 여행 현황</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">완료한 여행</span>
                      <span className="font-bold text-blue-600">{displayUser.completedTrips}회</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">업로드한 사진</span>
                      <span className="font-bold text-green-600">{displayUser.totalPhotos}장</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">여행 친구</span>
                      <span className="font-bold text-orange-600">{displayUser.friends}명</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">현재 레벨</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-purple-600">Level {displayUser.level}</span>
                          <div className="flex items-center">
                            <Zap className="w-3 h-3 text-yellow-500 mr-1" />
                            <span className="text-xs font-medium">{displayUser.points}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.section>

        {/* More Destinations */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="py-16">
          <div className="flex items-center justify-between mb-8">
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-6 h-6 text-green-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">더 많은 여행지 둘러보기</h2>
              </div>
              <p className="text-xl text-gray-600">전국 각지의 숨겨진 명소들을 발견해보세요</p>
            </motion.div>

            <motion.div variants={itemVariants} className="hidden md:flex items-center space-x-4">
              <div className="flex space-x-2">
                {["all", "바다", "산", "도시", "맛집"].map((filter) => (
                  <motion.button
                    key={filter}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedFilter === filter
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter === "all" ? "전체" : filter}
                  </motion.button>
                ))}
              </div>

              <Link href="/explore">
                <Button variant="outline" className="bg-transparent">
                  더 보기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnimatePresence>
              {filteredDestinations.map((destination, index) => (
                <motion.div key={destination.id} variants={itemVariants} whileHover="hover" layout>
                  <motion.div variants={cardHoverVariants}>
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                      <div className="relative">
                        <img
                          src={destination.image || "/placeholder.svg"}
                          alt={destination.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute top-3 left-3 flex space-x-2">
                          <Badge className="bg-red-500 text-white border-0 text-xs">{destination.trend}</Badge>
                          <Badge className="bg-green-500 text-white border-0 text-xs">{destination.trendValue}</Badge>
                        </div>

                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          <span className="text-xs font-medium">{destination.likes}</span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <Eye className="w-3 h-3" />
                              <span>{destination.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              <span>{destination.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {destination.title}
                          </h3>
                          <div className="flex items-center text-gray-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{destination.location}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 text-sm">{destination.description}</p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {destination.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span>{destination.priceRange}</span>
                          <span>{destination.weather}</span>
                        </div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-sm">
                            여행 계획하기
                            <ArrowRight className="w-3 h-3 ml-2" />
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Weekly Challenge Section */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="py-16">
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-black/10" />
              <CardContent className="relative p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Award className="w-6 h-6" />
                      <span className="text-lg font-semibold">{weeklyChallenge.title}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{weeklyChallenge.description}</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span>진행률</span>
                        <span className="font-bold">
                          {weeklyChallenge.progress}/{weeklyChallenge.total}
                        </span>
                      </div>
                      <Progress
                        value={(weeklyChallenge.progress / weeklyChallenge.total) * 100}
                        className="h-2 bg-white/20"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span>보상: {weeklyChallenge.reward}</span>
                        <span>{weeklyChallenge.timeLeft}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button className="bg-white text-purple-600 hover:bg-gray-100">참여하기</Button>
                      <div className="text-sm">
                        <Users className="w-4 h-4 inline mr-1" />
                        {weeklyChallenge.participants}명 참여중
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-32 h-32 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
                    >
                      <Utensils className="w-16 h-16" />
                    </motion.div>
                    <div className="text-4xl font-bold mb-2">
                      {weeklyChallenge.progress}/{weeklyChallenge.total}
                    </div>
                    <div className="text-sm opacity-90">완료</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Enhanced Friend Activities */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Activity className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">친구들의 최근 활동</h2>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  새로고침
                </Button>
              </div>

              <div className="space-y-4">
                {friendActivities.map((activity, index) => (
                  <motion.div key={activity.id} variants={itemVariants} whileHover={{ scale: 1.02 }} className="group">
                    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {activity.user.level}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-gray-900">
                                <span className="text-blue-600 font-semibold">{activity.user.name}</span>
                                님이 {activity.action}
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{activity.time}</span>
                              </div>
                            </div>

                            {activity.details && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                {activity.type === "trip_completed" && (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-sm">{activity.details.tripTitle}</div>
                                      <div className="text-xs text-gray-600">
                                        {activity.details.duration} • 사진 {activity.details.photos}장
                                      </div>
                                    </div>
                                    <div className="flex">
                                      {[...Array(activity.details.rating)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {activity.type === "trip_planned" && (
                                  <div>
                                    <div className="font-medium text-sm">{activity.details.tripTitle}</div>
                                    <div className="text-xs text-gray-600">
                                      {activity.details.startDate} • {activity.details.participants}명 참여
                                    </div>
                                  </div>
                                )}

                                {activity.type === "photos_uploaded" && (
                                  <div>
                                    <div className="font-medium text-sm">{activity.details.tripTitle}</div>
                                    <div className="text-xs text-gray-600">
                                      {activity.details.location} • {activity.details.photoCount}장 업로드
                                    </div>
                                  </div>
                                )}

                                {activity.type === "badge_earned" && (
                                  <div>
                                    <div className="font-medium text-sm flex items-center">
                                      <Award className="w-4 h-4 mr-2 text-yellow-500" />
                                      {activity.details.badgeName}
                                    </div>
                                    <div className="text-xs text-gray-600">{activity.details.description}</div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                                >
                                  <Heart className="w-4 h-4" />
                                  <span className="text-sm">{activity.likes}</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  <span className="text-sm">{activity.comments}</span>
                                </motion.button>
                              </div>

                              {activity.image && (
                                <img
                                  src={activity.image || "/placeholder.svg"}
                                  alt="Activity"
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* User Stats Sidebar */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Monthly Stats */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">이번 달 활동</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">계획한 여행</span>
                      <span className="font-bold text-blue-600">{userStats.thisMonth.tripsPlanned}개</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">업로드한 사진</span>
                      <span className="font-bold text-green-600">{userStats.thisMonth.photosUploaded}장</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">방문한 장소</span>
                      <span className="font-bold text-orange-600">{userStats.thisMonth.placesVisited}곳</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">새로운 친구</span>
                      <span className="font-bold text-purple-600">{userStats.thisMonth.friendsConnected}명</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-gray-900">획득한 배지</h3>
                  </div>
                  <div className="space-y-3">
                    {userStats.achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <div className="font-medium text-sm">{achievement.name}</div>
                          <div className="text-xs text-gray-600">{achievement.description}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Travel Style */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Compass className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">나의 여행 스타일</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">주요 스타일</div>
                      <Badge className="bg-indigo-100 text-indigo-800">{userStats.travelStyle.primary}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">보조 스타일</div>
                      <Badge variant="outline">{userStats.travelStyle.secondary}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">선호도</div>
                      <div className="text-sm">{userStats.travelStyle.preference}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced CTA Section */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="py-20">
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 border-0 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-black/10" />
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
              <CardContent className="relative p-12 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                  <Sparkles className="w-16 h-16 mx-auto mb-6" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">지금 바로 완벽한 여행을 시작하세요!</h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  AI가 분석한 맞춤 추천부터 친구들과의 협업까지, TravelMate와 함께 특별한 여행을 만들어보세요
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/trip/create">
                      <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                        <Sparkles className="w-5 h-5 mr-2" />
                        AI로 여행 계획하기
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/explore">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10 bg-transparent"
                      >
                        <Globe className="w-5 h-5 mr-2" />
                        여행지 둘러보기
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}

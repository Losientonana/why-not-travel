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
  Camera as CameraIcon,
  MessageCircle,
  RefreshCw,
  Eye,
} from "lucide-react"
import { getUserInfo, UserInfo, isAuthenticated } from "@/lib/auth";

// Mock Data for demo purposes
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
  },
]

export default function HomePage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("")
  const [currentRecommendation, setCurrentRecommendation] = useState(0)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      // 먼저 인증 상태 확인
      if (isAuthenticated()) {
        const userInfo = await getUserInfo();
        setUser(userInfo);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

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
        type: "spring",
        stiffness: 100,
      },
    },
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const displayUser = user ? {
    ...mockUser,
    id: user.id ? user.id.toString() : mockUser.id,
    name: user.name || mockUser.name,
    email: user.email || mockUser.email,
    avatar: user.name ? `/placeholder.svg?height=40&width=40&text=${user.name[0]}` : mockUser.avatar,
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4">
        {/* Enhanced Hero Section */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="py-12 lg:py-20">
          <div className="text-center mb-12">
            {displayUser ? (
              <>
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
              </>
            ) : (
              <>
                <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  함께 만드는
                  <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                    {" "}
                    여행 이야기
                  </span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  친구들과 함께 여행을 계획하고, 실시간으로 추억을 기록하며, 아름다운 여행 스토리를 만들어보세요.
                </motion.p>
              </>
            )}

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

            {!displayUser && (
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/signup">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-8">
                      <Sparkles className="w-5 h-5 mr-2" />
                      지금 무료로 시작하기
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8"
                    >
                      이미 계정이 있어요
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

          {displayUser && (
            /* User Stats Card - 상단 배치 */
            <motion.div variants={itemVariants} className="mb-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">나의 여행 현황</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="font-bold text-2xl text-blue-600 mb-1">{displayUser.completedTrips}</div>
                      <div className="text-sm text-gray-600">완료한 여행</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-2xl text-green-600 mb-1">{displayUser.totalPhotos}</div>
                      <div className="text-sm text-gray-600">업로드한 사진</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-2xl text-orange-600 mb-1">{displayUser.friends}</div>
                      <div className="text-sm text-gray-600">여행 친구</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-2xl text-purple-600 mb-1">
                        <div className="flex items-center justify-center space-x-1">
                          <span>L{displayUser.level}</span>
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <span className="text-lg">{displayUser.points}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">레벨 & 포인트</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {displayUser && (
            /* AI Recommendations for logged in users */
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
          )}

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
                <h3 className="text-xl font-bold text-gray-900 mb-4">{displayUser ? "빠른 시작" : "여행의 모든 순간을 함께"}</h3>
                {displayUser ? (
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
                ) : (
                  <div className="space-y-6">
                    {/* Feature cards for non-logged users */}
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">스마트한 여행 계획</h3>
                        <p className="text-sm text-gray-600">
                          AI 추천과 실시간 정보로 완벽한 여행 일정을 만들어보세요.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">실시간 협업</h3>
                        <p className="text-sm text-gray-600">
                          친구들과 실시간으로 일정을 공유하고 수정하세요.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CameraIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">추억 기록 & 공유</h3>
                        <p className="text-sm text-gray-600">
                          여행 중 사진과 일기를 실시간으로 기록하세요.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

            </div>
          </div>
        </motion.section>

        {!displayUser && (
          <>
            {/* Stats Section for non-logged users */}
            <motion.section variants={containerVariants} initial="hidden" animate="visible" className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <motion.div variants={itemVariants}>
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">10K+</div>
                    <div className="text-gray-600">활성 사용자</div>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">50K+</div>
                    <div className="text-gray-600">완성된 여행</div>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">1M+</div>
                    <div className="text-gray-600">공유된 사진</div>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">4.9</div>
                    <div className="text-gray-600">평점 (5점 만점)</div>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* How it works for non-logged users */}
            <motion.section variants={containerVariants} initial="hidden" animate="visible" className="py-20 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    간단한 3단계로 시작하세요
                  </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div variants={itemVariants} className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">계획 세우기</h3>
                    <p className="text-gray-600">여행지와 날짜를 선택하고, 친구들을 초대해서 함께 일정을 계획하세요.</p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">여행 떠나기</h3>
                    <p className="text-gray-600">실시간으로 위치를 공유하고, 사진과 후기를 바로바로 기록하세요.</p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">추억 간직하기</h3>
                    <p className="text-gray-600">자동으로 만들어진 여행 앨범을 친구들과 공유하고 추억을 간직하세요.</p>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          </>
        )}

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
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {displayUser
                    ? '지금 바로 완벽한 여행을 시작하세요!'
                    : '지금 가입하고 무료로 모든 기능을 즐겨보세요! ✨'}
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  {displayUser
                    ? 'AI가 분석한 맞춤 추천부터 친구들과의 협업까지, TravelMate와 함께 특별한 여행을 만들어보세요'
                    : '단 몇 분만 투자하면 AI 여행 추천, 친구들과의 실시간 협업, 추억 기록까지! 모든 프리미엄 기능을 완전 무료로 만나보세요 🎁'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {displayUser ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/signup">
                          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                            <Sparkles className="w-5 h-5 mr-2" />
                            지금 무료로 시작하기
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/login">
                          <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10 bg-transparent px-8"
                          >
                            이미 계정이 있어요
                          </Button>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TravelMate</span>
              </div>
              <p className="text-gray-400">함께 만드는 여행 이야기</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">서비스</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white">
                    기능 소개
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    요금제
                  </Link>
                </li>
                <li>
                  <Link href="/download" className="hover:text-white">
                    앱 다운로드
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">지원</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    도움말
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    문의하기
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    자주 묻는 질문
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">회사</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    회사 소개
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    이용약관
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TravelMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
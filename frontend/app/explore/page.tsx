"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    MapPin,
    Heart,
    Star,
    Clock,
    Plane,
    ArrowRight,
    TrendingUp,
    Sparkles,
    Globe,
    Mountain,
    Waves,
    Building2,
    Utensils,
    Camera,
    Calendar,
    ChevronLeft,
} from "lucide-react"

// 여행지 데이터
const destinations = {
    domestic: [
        {
            id: "jeju",
            name: "제주도",
            country: "대한민국",
            image: "/images/destinations/jeju.jpg",
            description: "에메랄드빛 바다와 한라산이 어우러진 천혜의 자연, 사계절 아름다운 대한민국 대표 휴양지",
            bestSeason: "봄 (3-5월)",
            duration: "3박 4일 추천",
            trending: true,
            tags: ["자연", "힐링", "드라이브", "맛집"],
            highlights: ["성산일출봉", "우도", "한라산", "협재해변"],
        },
        {
            id: "busan",
            name: "부산",
            country: "대한민국",
            image: "/images/destinations/busan.jpg",
            description: "활기찬 항구도시의 매력과 아름다운 해변, 신선한 해산물까지 모든 것이 있는 곳",
            bestSeason: "여름 (6-8월)",
            duration: "2박 3일 추천",
            trending: true,
            tags: ["바다", "맛집", "야경", "문화"],
            highlights: ["해운대", "감천문화마을", "광안리", "자갈치시장"],
        },
        {
            id: "gangneung",
            name: "강릉",
            country: "대한민국",
            image: "/images/destinations/gangneung.jpg",
            description: "동해의 푸른 바다와 커피 향이 어우러진 감성 여행지, 일출 명소로도 유명",
            bestSeason: "연중",
            duration: "1박 2일 추천",
            trending: false,
            tags: ["바다", "커피", "일출", "힐링"],
            highlights: ["경포해변", "정동진", "안목해변", "주문진"],
        },
    ],
    international: [
        {
            id: "tokyo",
            name: "도쿄",
            country: "일본",
            image: "/images/destinations/tokyo.jpg",
            description: "전통과 현대가 공존하는 세계적인 대도시, 쇼핑, 음식, 문화 모든 것이 넘치는 곳",
            bestSeason: "봄 (3-4월), 가을 (10-11월)",
            duration: "4박 5일 추천",
            trending: true,
            tags: ["쇼핑", "맛집", "문화", "테마파크"],
            highlights: ["시부야", "아사쿠사", "신주쿠", "하라주쿠"],
        },
        {
            id: "osaka",
            name: "오사카",
            country: "일본",
            image: "/images/destinations/osaka.jpg",
            description: "일본의 부엌이라 불리는 맛의 도시, 활기찬 분위기와 친근한 사람들이 매력",
            bestSeason: "봄 (3-4월), 가을 (10-11월)",
            duration: "3박 4일 추천",
            trending: true,
            tags: ["맛집", "테마파크", "쇼핑", "야경"],
            highlights: ["도톤보리", "오사카성", "유니버설", "신세카이"],
        },
        {
            id: "shanghai",
            name: "상하이",
            country: "중국",
            image: "/images/destinations/shanghai.jpg",
            description: "동양의 파리라 불리는 화려한 대도시, 역사와 현대가 조화를 이루는 매력적인 곳",
            bestSeason: "봄 (4-5월), 가을 (9-11월)",
            duration: "3박 4일 추천",
            trending: false,
            tags: ["야경", "역사", "쇼핑", "맛집"],
            highlights: ["와이탄", "동방명주", "예원", "난징루"],
        },
        {
            id: "beijing",
            name: "베이징",
            country: "중국",
            image: "/images/destinations/beijing.jpg",
            description: "5000년 역사가 살아 숨쉬는 중국의 수도, 웅장한 문화유산과 현대의 조화",
            bestSeason: "봄 (4-5월), 가을 (9-10월)",
            duration: "4박 5일 추천",
            trending: false,
            tags: ["역사", "문화", "세계유산", "맛집"],
            highlights: ["만리장성", "자금성", "천안문", "이화원"],
        },
    ],
}

// 테마별 추천
const themes = [
    {
        id: "healing",
        title: "힐링 여행",
        description: "지친 일상에서 벗어나 자연 속에서 재충전",
        icon: Waves,
        color: "from-teal-500 to-cyan-500",
        spots: ["제주도", "강릉", "양양"],
    },
    {
        id: "food",
        title: "맛집 투어",
        description: "현지의 맛을 찾아 떠나는 미식 여행",
        icon: Utensils,
        color: "from-orange-500 to-red-500",
        spots: ["오사카", "부산", "전주"],
    },
    {
        id: "culture",
        title: "문화 탐방",
        description: "역사와 예술이 살아있는 문화 여행",
        icon: Building2,
        color: "from-purple-500 to-pink-500",
        spots: ["도쿄", "베이징", "경주"],
    },
    {
        id: "adventure",
        title: "액티비티",
        description: "짜릿한 모험과 새로운 경험을 찾아서",
        icon: Mountain,
        color: "from-green-500 to-emerald-500",
        spots: ["제주도", "강원도", "규슈"],
    },
]

export default function ExplorePage() {
    const [activeTab, setActiveTab] = useState("all")
    const [likedDestinations, setLikedDestinations] = useState<string[]>([])

    const allDestinations = [...destinations.domestic, ...destinations.international]

    const filteredDestinations =
        activeTab === "all"
            ? allDestinations
            : activeTab === "domestic"
                ? destinations.domestic
                : destinations.international

    const handleLike = (id: string) => {
        setLikedDestinations((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]))
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    }

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring" as const, stiffness: 100 },
        },
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">TravelMate</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                                홈
                            </Link>
                            <Link href="/trips" className="text-gray-600 hover:text-blue-600 transition-colors">
                                내 여행
                            </Link>
                            <Link href="/explore" className="text-blue-600 font-medium relative">
                                둘러보기
                                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600" />
                            </Link>
                            <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
                                마이페이지
                            </Link>
                        </nav>

                        <Link href="/trip/create">
                            <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                                <Plane className="w-4 h-4 mr-2" />
                                여행 계획하기
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    돌아가기
                </Link>

                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-orange-500 text-white border-0">
                        <Globe className="w-3 h-3 mr-1" />
                        2025 트렌디 여행지
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        어디로 떠나볼까요?
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        지금 가장 핫한 여행지부터 숨은 명소까지, TravelMate가 엄선한 여행지를 둘러보세요
                    </p>
                </motion.section>

                {/* Theme Quick Links */}
                <motion.section variants={containerVariants} initial="hidden" animate="visible" className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">테마별 여행</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {themes.map((theme) => (
                            <motion.div key={theme.id} variants={itemVariants} whileHover={{ y: -4, scale: 1.02 }}>
                                <Card className="cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all">
                                    <CardContent className={`p-5 bg-gradient-to-br ${theme.color} text-white`}>
                                        <theme.icon className="w-7 h-7 mb-2" />
                                        <h3 className="font-bold text-base mb-1">{theme.title}</h3>
                                        <p className="text-xs text-white/80 mb-2">{theme.description}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {theme.spots.slice(0, 2).map((spot) => (
                                                <Badge key={spot} variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                                                    {spot}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Featured Destination - 제주도 */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="flex items-center space-x-2 mb-4">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                        <h2 className="text-xl font-bold text-gray-900">이달의 추천 여행지</h2>
                    </div>

                    <Card className="overflow-hidden border-0 shadow-xl">
                        <div className="grid lg:grid-cols-2">
                            <div className="relative h-72 lg:h-auto">
                                <img
                                    src="/images/destinations/jeju-featured.jpg"
                                    alt="제주도"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent lg:bg-gradient-to-t" />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <Badge className="bg-red-500 text-white border-0">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        HOT
                                    </Badge>
                                </div>
                                <div className="absolute bottom-4 left-4 lg:hidden text-white">
                                    <h3 className="text-2xl font-bold">제주도</h3>
                                    <p className="text-white/80">대한민국</p>
                                </div>
                            </div>

                            <CardContent className="p-6 lg:p-8">
                                <div className="hidden lg:block mb-3">
                                    <h3 className="text-2xl font-bold text-gray-900">제주도</h3>
                                    <p className="text-gray-500">Jeju Island, 대한민국</p>
                                </div>

                                <p className="text-gray-700 mb-5 leading-relaxed">
                                    에메랄드빛 바다와 한라산이 어우러진 천혜의 자연, 사계절 아름다운 대한민국 대표 휴양지입니다.
                                    성산일출봉에서 맞이하는 일출, 우도의 투명한 바다, 올레길 트레킹까지 다양한 매력이 가득합니다.
                                </p>

                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm">봄 (3-5월) 추천</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm">3박 4일 추천</span>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">주요 명소</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {["성산일출봉", "우도", "한라산", "협재해변"].map((spot) => (
                                            <Badge key={spot} variant="outline" className="text-xs">
                                                {spot}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Link href="/trip/create">
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                                        이 여행지로 계획 시작하기
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </div>
                    </Card>
                </motion.section>

                {/* Popular Destinations */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-xl font-bold text-gray-900">인기 여행지</h2>
                        </div>
                    </div>

                    <Tabs defaultValue="all" onValueChange={setActiveTab}>
                        <TabsList className="mb-6">
                            <TabsTrigger value="all">전체</TabsTrigger>
                            <TabsTrigger value="domestic">국내</TabsTrigger>
                            <TabsTrigger value="international">해외</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab}>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredDestinations.map((dest) => (
                                    <motion.div key={dest.id} variants={itemVariants}>
                                        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all group">
                                            <div className="relative h-48">
                                                <img
                                                    src={dest.image || "/placeholder.svg"}
                                                    alt={dest.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                                {/* Like Button */}
                                                <button
                                                    onClick={() => handleLike(dest.id)}
                                                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                                                >
                                                    <Heart
                                                        className={`w-4 h-4 ${likedDestinations.includes(dest.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                                                    />
                                                </button>

                                                {/* Trending Badge */}
                                                {dest.trending && (
                                                    <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
                                                        <TrendingUp className="w-3 h-3 mr-1" />
                                                        인기
                                                    </Badge>
                                                )}

                                                {/* Destination Info */}
                                                <div className="absolute bottom-3 left-3 text-white">
                                                    <h3 className="text-xl font-bold">{dest.name}</h3>
                                                    <p className="text-white/80 text-sm">{dest.country}</p>
                                                </div>
                                            </div>

                                            <CardContent className="p-4">
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dest.description}</p>

                                                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{dest.bestSeason}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{dest.duration}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {dest.tags.slice(0, 3).map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs bg-gray-100">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <Link href="/trip/create">
                                                    <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors bg-transparent">
                                                        여행 시작하기
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </motion.section>

                {/* CTA Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center py-12"
                >
                    <Card className="bg-gradient-to-r from-blue-600 to-orange-500 border-0 text-white p-8 md:p-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">
                            마음에 드는 여행지를 찾으셨나요?
                        </h2>
                        <p className="text-white/90 mb-6 max-w-xl mx-auto">
                            TravelMate와 함께 친구들과 완벽한 여행 계획을 세워보세요.
                            일정 관리부터 경비 정산까지 한 번에!
                        </p>
                        <Link href="/trip/create">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                                <Plane className="w-5 h-5 mr-2" />
                                지금 여행 계획 시작하기
                            </Button>
                        </Link>
                    </Card>
                </motion.section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-orange-500 rounded-md flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold">TravelMate</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        친구들과 함께 만드는 완벽한 여행 경험
                    </p>
                </div>
            </footer>
        </div>
    )
}

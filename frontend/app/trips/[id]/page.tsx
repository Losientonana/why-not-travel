"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getTripDetail, getItineraries, getPhotos, getChecklists, getExpenses, createChecklist, toggleChecklist, deleteChecklist } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Camera,
  Share2,
  Edit,
  MoreHorizontal,
  Plus,
  Clock,
  DollarSign,
  Heart,
  MessageCircle,
  Download,
  Trash2,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock data for trip details
const mockTrip = {
  id: "1",
  title: "제주도 힐링 여행",
  destination: "제주도",
  startDate: "2024-03-15",
  endDate: "2024-03-18",
  status: "upcoming",
  coverImage: "/placeholder.svg?height=400&width=800&text=제주도+힐링+여행",
  description: "친구들과 함께하는 제주도 힐링 여행입니다. 아름다운 자연과 맛있는 음식을 즐기며 소중한 추억을 만들어요!",
  isOwner: true,
  isPublic: false,
  budget: 800000,
  spent: 320000,
  participants: [
    {
      id: "1",
      name: "김여행",
      email: "kim@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=김",
      role: "owner",
    },
    {
      id: "2",
      name: "박모험",
      email: "park@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=박",
      role: "editor",
    },
    {
      id: "3",
      name: "이탐험",
      email: "lee@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=이",
      role: "viewer",
    },
  ],
  itinerary: [
    {
      date: "2024-03-15",
      day: "Day 1",
      activities: [
        {
          id: "1",
          time: "09:00",
          title: "제주공항 도착",
          location: "제주국제공항",
          type: "transport",
          duration: "30분",
          cost: 0,
        },
        {
          id: "2",
          time: "11:00",
          title: "렌터카 픽업",
          location: "제주공항 렌터카",
          type: "transport",
          duration: "30분",
          cost: 80000,
        },
        {
          id: "3",
          time: "12:30",
          title: "점심식사",
          location: "흑돼지 맛집",
          type: "food",
          duration: "1시간",
          cost: 45000,
        },
        {
          id: "4",
          time: "14:00",
          title: "숙소 체크인",
          location: "제주 리조트",
          type: "accommodation",
          duration: "30분",
          cost: 240000,
        },
        {
          id: "5",
          time: "16:00",
          title: "해변 산책",
          location: "협재해수욕장",
          type: "activity",
          duration: "2시간",
          cost: 0,
        },
      ],
    },
    {
      date: "2024-03-16",
      day: "Day 2",
      activities: [
        {
          id: "6",
          time: "08:00",
          title: "조식",
          location: "호텔 레스토랑",
          type: "food",
          duration: "1시간",
          cost: 30000,
        },
        {
          id: "7",
          time: "09:30",
          title: "한라산 등반",
          location: "한라산 국립공원",
          type: "activity",
          duration: "6시간",
          cost: 15000,
        },
        {
          id: "8",
          time: "12:00",
          title: "산중 도시락",
          location: "한라산",
          type: "food",
          duration: "1시간",
          cost: 20000,
        },
        {
          id: "9",
          time: "15:00",
          title: "하산 및 휴식",
          location: "숙소",
          type: "rest",
          duration: "3시간",
          cost: 0,
        },
        {
          id: "10",
          time: "18:00",
          title: "저녁식사",
          location: "해산물 맛집",
          type: "food",
          duration: "2시간",
          cost: 60000,
        },
      ],
    },
  ],
  photos: [
    {
      id: "1",
      url: "/placeholder.svg?height=200&width=200&text=제주공항",
      caption: "제주공항 도착!",
      date: "2024-03-15",
      likes: 12,
      author: "김여행",
    },
    {
      id: "2",
      url: "/placeholder.svg?height=200&width=200&text=협재해수욕장",
      caption: "협재해수욕장 석양",
      date: "2024-03-15",
      likes: 24,
      author: "박모험",
    },
    {
      id: "3",
      url: "/placeholder.svg?height=200&width=200&text=흑돼지",
      caption: "흑돼지 맛집",
      date: "2024-03-15",
      likes: 18,
      author: "이탐험",
    },
    {
      id: "4",
      url: "/placeholder.svg?height=200&width=200&text=한라산",
      caption: "한라산 정상",
      date: "2024-03-16",
      likes: 35,
      author: "김여행",
    },
  ],
  checklist: [
    { id: "1", text: "항공권 예약", completed: true, assignee: "김여행" },
    { id: "2", text: "숙소 예약", completed: true, assignee: "박모험" },
    { id: "3", text: "렌터카 예약", completed: true, assignee: "이탐험" },
    { id: "4", text: "여행자보험 가입", completed: false, assignee: "김여행" },
    { id: "5", text: "카메라 배터리 충전", completed: false, assignee: "박모험" },
    { id: "6", text: "현지 맛집 리스트 작성", completed: true, assignee: "이탐험" },
  ],
  expenses: [
    { id: "1", category: "교통", item: "항공료", amount: 180000, paidBy: "김여행", date: "2024-03-10" },
    { id: "2", category: "숙박", item: "리조트 숙박비", amount: 240000, paidBy: "박모험", date: "2024-03-12" },
    { id: "3", category: "식비", item: "첫날 점심", amount: 45000, paidBy: "이탐험", date: "2024-03-15" },
    { id: "4", category: "교통", item: "렌터카", amount: 80000, paidBy: "김여행", date: "2024-03-15" },
  ],
}

const statusConfig = {
  planning: { label: "계획중", color: "bg-yellow-100 text-yellow-800" },
  upcoming: { label: "예정", color: "bg-blue-100 text-blue-800" },
  ongoing: { label: "여행중", color: "bg-green-100 text-green-800" },
  completed: { label: "완료", color: "bg-gray-100 text-gray-800" },
}

const activityTypeConfig = {
  transport: { icon: "🚗", color: "bg-blue-100 text-blue-800", label: "이동" },
  food: { icon: "🍽️", color: "bg-orange-100 text-orange-800", label: "식사" },
  activity: { icon: "🏃", color: "bg-green-100 text-green-800", label: "활동" },
  accommodation: { icon: "🏨", color: "bg-purple-100 text-purple-800", label: "숙박" },
  rest: { icon: "😴", color: "bg-gray-100 text-gray-800", label: "휴식" },
}

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth() // 현재 로그인한 사용자 정보
  const [activeTab, setActiveTab] = useState("overview")
  const [likedPhotos, setLikedPhotos] = useState<string[]>([])
  const [tripData, setTripData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 탭별 실제 데이터 상태 (API에서 불러온 데이터)
  const [itinerariesData, setItinerariesData] = useState<any[]>([])
  const [photosData, setPhotosData] = useState<any[]>([])
  const [checklistsData, setChecklistsData] = useState<any[]>([])
  const [expensesData, setExpensesData] = useState<any[]>([])
  const [tabLoading, setTabLoading] = useState(false)

  // 체크리스트 관련 상태
  const [showAddChecklist, setShowAddChecklist] = useState(false)
  const [newChecklistTask, setNewChecklistTask] = useState("")
  const [addingChecklist, setAddingChecklist] = useState(false)

  // API 호출
  useEffect(() => {
    const fetchTripDetail = async () => {
      try {
        setLoading(true)
        console.log('🔥 프론트엔드: API 호출 시작 - tripId:', params.id)
        const data = await getTripDetail(Number(params.id))
        console.log('✅ 프론트엔드: API 응답 받음:', data)
        setTripData(data)
        setError(null)
      } catch (err: any) {
        console.error('❌ 프론트엔드: API 호출 실패:', err)
        setError(err.response?.data?.message || '여행 정보를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchTripDetail()
  }, [params.id])

  // 탭 전환 시 해당 탭 데이터 로드
  useEffect(() => {
    const loadTabData = async () => {
      if (!params.id) return

      try {
        setTabLoading(true)

        switch (activeTab) {
          case 'itinerary':
            if (itinerariesData.length === 0) {
              console.log('🔥 일정 데이터 로딩 시작')
              const data = await getItineraries(Number(params.id))
              console.log('✅ 일정 데이터 로딩 완료:', data)
              setItinerariesData(data || [])
            }
            break
          case 'photos':
            if (photosData.length === 0) {
              console.log('🔥 사진 데이터 로딩 시작')
              const data = await getPhotos(Number(params.id))
              console.log('✅ 사진 데이터 로딩 완료:', data)
              setPhotosData(data || [])
            }
            break
          case 'checklist':
            if (checklistsData.length === 0) {
              console.log('🔥 체크리스트 데이터 로딩 시작')
              const data = await getChecklists(Number(params.id))
              console.log('✅ 체크리스트 데이터 로딩 완료:', data)
              setChecklistsData(data || [])
            }
            break
          case 'expenses':
            if (expensesData.length === 0) {
              console.log('🔥 경비 데이터 로딩 시작')
              const data = await getExpenses(Number(params.id))
              console.log('✅ 경비 데이터 로딩 완료:', data)
              setExpensesData(data || [])
            }
            break
        }
      } catch (err) {
        console.error(`❌ ${activeTab} 탭 데이터 로딩 실패:`, err)
        // 에러 발생해도 mock 데이터 사용하므로 무시
      } finally {
        setTabLoading(false)
      }
    }

    loadTabData()
  }, [activeTab, params.id])

  const handleLikePhoto = (photoId: string) => {
    setLikedPhotos((prev) => (prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]))
  }

  // 체크리스트 항목 추가
  const handleAddChecklist = async () => {
    if (!newChecklistTask.trim()) return
    if (!user?.id) {
      alert('로그인이 필요합니다.')
      return
    }

    try {
      setAddingChecklist(true)

      // 현재 체크리스트의 최대 displayOrder 계산
      const maxOrder = checklistsData.length > 0
        ? Math.max(...checklistsData.map((item: any) => item.displayOrder || 0))
        : 0

      const newItem = await createChecklist(
        Number(params.id),
        newChecklistTask.trim(),
        user.id, // 현재 로그인한 사용자 ID
        maxOrder + 1 // 새로운 항목은 마지막에 추가
      )

      // 성공하면 체크리스트 데이터 새로고침
      const updatedChecklists = await getChecklists(Number(params.id))
      setChecklistsData(updatedChecklists)

      // 입력 필드 초기화
      setNewChecklistTask("")
      setShowAddChecklist(false)
    } catch (err) {
      console.error('체크리스트 추가 실패:', err)
      alert('체크리스트 추가에 실패했습니다.')
    } finally {
      setAddingChecklist(false)
    }
  }

  // 체크리스트 항목 체크/체크 해제
  const handleToggleChecklist = async (checklistId: number) => {
    try {
      const updatedItem = await toggleChecklist(checklistId)

      // 로컬 상태 업데이트
      setChecklistsData((prev) =>
        prev.map((item) =>
          item.id === checklistId
            ? { ...item, completed: updatedItem.completed, completedAt: updatedItem.completedAt }
            : item
        )
      )
    } catch (err) {
      console.error('체크리스트 토글 실패:', err)
      alert('체크리스트 수정에 실패했습니다.')
    }
  }

  // 체크리스트 항목 삭제
  const handleDeleteChecklist = async (checklistId: number) => {
    if (!confirm('이 항목을 삭제하시겠습니까?')) return

    try {
      await deleteChecklist(checklistId)

      // 로컬 상태에서 삭제
      setChecklistsData((prev) => prev.filter((item) => item.id !== checklistId))
    } catch (err) {
      console.error('체크리스트 삭제 실패:', err)
      alert('체크리스트 삭제에 실패했습니다.')
    }
  }

  // 백엔드 데이터를 프론트엔드 형식으로 변환
  const transformItinerary = (data: any[]) => {
    return data.map((item, index) => ({
      date: item.date,
      day: `Day ${item.dayNumber}`,
      dayNumber: item.dayNumber,
      title: item.title,
      activities: (item.activities || []).map((act: any) => ({
        id: act.id,
        time: act.time,
        title: act.title,
        location: act.location,
        type: act.activityType?.toLowerCase() || 'activity',
        duration: `${act.durationMinutes || 0}분`,
        cost: act.cost || 0,
        notes: act.notes
      }))
    }))
  }

  const transformPhotos = (data: any[]) => {
    return data.map((item) => ({
      id: item.id,
      url: item.imageUrl,
      caption: item.caption,
      date: item.takenAt,
      likes: item.likesCount || 0,
      author: item.userName || '알 수 없음'
    }))
  }

  const transformChecklist = (data: any[]) => {
    return data
      .map((item) => ({
        id: item.id,
        text: item.task,
        completed: item.completed,
        assignee: item.assigneeName || '미지정',
        assigneeUserId: item.assigneeUserId,
        completedAt: item.completedAt,
        displayOrder: item.displayOrder || 0
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder) // displayOrder로 정렬
  }

  const transformExpenses = (data: any[]) => {
    return data.map((item) => ({
      id: item.id,
      category: item.category,
      item: item.item,
      amount: item.amount,
      paidBy: item.paidByUserName || '알 수 없음',
      date: item.expenseDate,
      notes: item.notes
    }))
  }

  // 실제 데이터 또는 mock 데이터 사용 (fallback)
  const displayTrip = tripData || mockTrip
  const displayItinerary = itinerariesData.length > 0 ? transformItinerary(itinerariesData) : mockTrip.itinerary
  const displayPhotos = photosData.length > 0 ? transformPhotos(photosData) : mockTrip.photos
  const displayChecklist = checklistsData.length > 0 ? transformChecklist(checklistsData) : mockTrip.checklist
  const displayExpenses = expensesData.length > 0 ? transformExpenses(expensesData) : mockTrip.expenses

  const completedTasks = tripData?.statistics?.completedChecklistCount ?? displayChecklist.filter((item: any) => item.completed).length
  const totalTasks = tripData?.statistics?.totalChecklistCount ?? displayChecklist.length
  const budgetProgress = tripData?.statistics?.budgetUsagePercentage || (mockTrip.spent / mockTrip.budget) * 100

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">여행 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 에러 발생
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/trips">
            <button className="text-blue-600 hover:text-blue-700">여행 목록으로 돌아가기</button>
          </Link>
        </div>
      </div>
    )
  }

  // API 응답 데이터 확인
  console.log('📊 프론트엔드: 렌더링 데이터:', tripData)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/trips" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>여행 목록으로 돌아가기</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                내보내기
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
              {displayTrip.isOwner && (
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  편집
                </Button>
              )}
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
          src={displayTrip.imageUrl || displayTrip.coverImage || "/placeholder.svg"}
          alt={displayTrip.title}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Badge className={statusConfig[(displayTrip.status || 'planning') as keyof typeof statusConfig]?.color || 'bg-gray-100'}>
                    {statusConfig[(displayTrip.status || 'planning') as keyof typeof statusConfig]?.label || displayTrip.statusDescription || '계획중'}
                  </Badge>
                  {displayTrip.isOwner && <Badge className="bg-blue-600 text-white">내 여행</Badge>}
                  <Badge variant="outline" className="text-white border-white/50">
                    {(displayTrip.visibility === 'PUBLIC' || displayTrip.isPublic) ? "공개" : "비공개"}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{displayTrip.title}</h1>
                <div className="flex items-center space-x-6 text-lg">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {displayTrip.destination}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {new Date(displayTrip.startDate).toLocaleDateString("ko-KR")} -{" "}
                    {new Date(displayTrip.endDate).toLocaleDateString("ko-KR")}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    {displayTrip.participants?.length || 0}명
                  </div>
                </div>
              </div>

              {/* Participant Avatars */}
              <div className="flex -space-x-2">
                {(displayTrip.participants || mockTrip.participants).map((participant: any) => (
                  <Avatar key={participant.participantId || participant.id} className="w-10 h-10 border-2 border-white">
                    <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.userName || participant.name} />
                    <AvatarFallback>{(participant.userName || participant.name)?.[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{displayItinerary.length}</div>
              <div className="text-sm text-gray-600">일정</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{displayPhotos.length}</div>
              <div className="text-sm text-gray-600">사진</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {completedTasks}/{totalTasks}
              </div>
              <div className="text-sm text-gray-600">체크리스트</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(budgetProgress)}%</div>
              <div className="text-sm text-gray-600">예산 사용</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="itinerary">일정</TabsTrigger>
            <TabsTrigger value="photos">사진</TabsTrigger>
            <TabsTrigger value="checklist">체크리스트</TabsTrigger>
            <TabsTrigger value="expenses">경비</TabsTrigger>
            <TabsTrigger value="members">멤버</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Trip Info */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>여행 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{displayTrip.description}</p>

                  {/* Budget Overview */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">예산 현황</h4>
                      <span className="text-sm text-gray-600">
                        ₩{(tripData?.statistics?.totalExpenses || mockTrip.spent).toLocaleString()} / ₩{(tripData?.statistics?.estimatedBudget || mockTrip.budget).toLocaleString()}
                      </span>
                    </div>
                    <Progress value={budgetProgress} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>사용: {Math.round(budgetProgress)}%</span>
                      <span>남은 예산: ₩{((tripData?.statistics?.estimatedBudget || mockTrip.budget) - (tripData?.statistics?.totalExpenses || mockTrip.spent)).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>빠른 작업</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    일정 추가
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    사진 업로드
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    멤버 초대
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    지출 추가
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32&text=김" />
                      <AvatarFallback>김</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">김여행</span>님이 새로운 사진을 추가했습니다.
                      </p>
                      <p className="text-xs text-gray-500">2시간 전</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32&text=박" />
                      <AvatarFallback>박</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">박모험</span>님이 체크리스트 항목을 완료했습니다.
                      </p>
                      <p className="text-xs text-gray-500">5시간 전</p>
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
              {displayItinerary.map((day: any, dayIndex: number) => (
                <Card key={dayIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        {day.day} -{" "}
                        {new Date(day.date).toLocaleDateString("ko-KR", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.activities.map((activity, activityIndex) => (
                        <div
                          key={activityIndex}
                          className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="text-sm font-medium text-blue-600 min-w-[60px]">{activity.time}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900">{activity.title}</h4>
                              <Badge
                                className={activityTypeConfig[activity.type as keyof typeof activityTypeConfig].color}
                              >
                                {activityTypeConfig[activity.type as keyof typeof activityTypeConfig].icon}
                                {activityTypeConfig[activity.type as keyof typeof activityTypeConfig].label}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 flex items-center mb-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {activity.location}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {activity.duration}
                              </div>
                              {activity.cost > 0 && (
                                <div className="flex items-center">
                                  <DollarSign className="w-3 h-3 mr-1" />₩{activity.cost.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
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
                <Camera className="w-4 h-4 mr-2" />
                사진 추가
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayPhotos.map((photo: any) => (
                <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative">
                    <img
                      src={photo.url || "/placeholder.svg"}
                      alt={photo.caption}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        onClick={() => handleLikePhoto(photo.id)}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            likedPhotos.includes(photo.id) ? "text-red-500 fill-current" : "text-gray-600"
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm mb-1 truncate">{photo.caption}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>by {photo.author}</span>
                      <span>{new Date(photo.date).toLocaleDateString("ko-KR")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 mr-1 text-red-500" />
                          <span className="text-xs">{photo.likes + (likedPhotos.includes(photo.id) ? 1 : 0)}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1 text-gray-400" />
                          <span className="text-xs">0</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">체크리스트</h2>
                <p className="text-gray-600">
                  {completedTasks}/{totalTasks} 완료 ({Math.round((completedTasks / totalTasks) * 100)}%)
                </p>
              </div>
              <Button
                className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 shadow-md hover:shadow-lg transition-all"
                onClick={() => setShowAddChecklist(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                항목 추가
              </Button>
            </div>

            {/* 항목 추가 Dialog */}
            <Dialog open={showAddChecklist} onOpenChange={setShowAddChecklist}>
              <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50">
                {/* 장식 요소 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-orange-400/20 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

                <DialogHeader className="p-6 pb-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                        새로운 할 일 추가
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        여행 준비를 위한 항목을 추가해보세요
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="px-6 py-4 space-y-6">
                  {/* 입력 필드 */}
                  <div className="space-y-3">
                    <Label htmlFor="task" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      <span>할 일 내용</span>
                    </Label>
                    <Input
                      id="task"
                      placeholder="예) 여권 유효기간 확인하기"
                      value={newChecklistTask}
                      onChange={(e) => setNewChecklistTask(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !addingChecklist && newChecklistTask.trim()) {
                          handleAddChecklist()
                        }
                      }}
                      disabled={addingChecklist}
                      className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                      autoFocus
                    />
                  </div>

                  {/* 사용자 정보 표시 */}
                  <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
                    <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                        {user?.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">담당자</p>
                      <p className="text-sm text-gray-600">{user?.name || '알 수 없음'}</p>
                    </div>
                  </div>

                  {/* 힌트 */}
                  <div className="flex items-start space-x-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      <strong>Tip:</strong> Enter 키를 눌러 빠르게 추가할 수 있어요!
                    </p>
                  </div>
                </div>

                <DialogFooter className="p-6 pt-0 flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddChecklist(false)
                      setNewChecklistTask("")
                    }}
                    disabled={addingChecklist}
                    className="w-full sm:w-auto border-2 hover:bg-gray-50"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleAddChecklist}
                    disabled={addingChecklist || !newChecklistTask.trim()}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 shadow-md hover:shadow-lg transition-all"
                  >
                    {addingChecklist ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        추가 중...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        추가하기
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Card>
              <CardContent className="p-6">
                {/* 체크리스트 항목들 */}
                <div className="space-y-3">
                  {displayChecklist.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-orange-100 mb-4">
                        <CheckCircle2 className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">아직 체크리스트가 없습니다</h3>
                      <p className="text-sm text-gray-500 mb-6">
                        여행 준비를 위한 할 일을 추가하고<br />체계적으로 관리해보세요!
                      </p>
                      <Button
                        onClick={() => setShowAddChecklist(true)}
                        variant="outline"
                        className="border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        첫 번째 항목 추가하기
                      </Button>
                    </div>
                  ) : (
                    displayChecklist.map((item: any) => (
                      <div
                        key={item.id}
                        className={`flex items-center space-x-3 p-4 rounded-xl transition-all ${
                          item.completed
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200"
                            : "bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleToggleChecklist(item.id)}
                            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-0 cursor-pointer transition-all"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className={`font-medium ${
                              item.completed ? "text-gray-500 line-through" : "text-gray-900"
                            }`}
                          >
                            {item.text}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                              {item.assignee[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600 font-medium hidden sm:inline">{item.assignee}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full">
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() => handleDeleteChecklist(item.id)}
                              className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              삭제하기
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">경비 관리</h2>
              <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
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
                      <p className="text-3xl font-bold text-blue-600">₩{(tripData?.statistics?.totalExpenses || mockTrip.spent).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">사용 금액</p>
                    </div>
                    <Progress value={budgetProgress} className="h-3" />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>총 예산</span>
                        <span className="font-medium">₩{(tripData?.statistics?.estimatedBudget || mockTrip.budget).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>남은 예산</span>
                        <span className="font-medium text-green-600">
                          ₩{((tripData?.statistics?.estimatedBudget || mockTrip.budget) - (tripData?.statistics?.totalExpenses || mockTrip.spent)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>사용률</span>
                        <span className="font-medium">{Math.round(budgetProgress)}%</span>
                      </div>
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
                    {displayExpenses.map((expense: any) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{expense.item}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Badge variant="outline" className="text-xs">
                                {expense.category}
                              </Badge>
                              <span>•</span>
                              <span>{expense.paidBy}</span>
                              <span>•</span>
                              <span>{new Date(expense.date).toLocaleDateString("ko-KR")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-lg">₩{expense.amount.toLocaleString()}</span>
                          <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
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
              <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                <Users className="w-4 h-4 mr-2" />
                멤버 초대
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(displayTrip.participants || mockTrip.participants).map((participant: any) => (
                <Card key={participant.participantId || participant.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.userName || participant.name} />
                        <AvatarFallback>{(participant.userName || participant.name)?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{participant.userName || participant.name}</h3>
                          <Badge
                            variant={
                              (participant.role === "OWNER" || participant.role === "owner")
                                ? "default"
                                : (participant.role === "EDITOR" || participant.role === "editor")
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {(participant.role === "OWNER" || participant.role === "owner") ? "방장" : (participant.role === "EDITOR" || participant.role === "editor") ? "편집자" : "뷰어"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{participant.userEmail || participant.email}</p>
                      </div>
                      {participant.role !== "OWNER" && participant.role !== "owner" && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Role Permissions Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">권한 안내</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Badge>방장</Badge>
                    <span>모든 권한 (편집, 삭제, 멤버 관리)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">편집자</Badge>
                    <span>일정 편집, 사진 업로드, 체크리스트 관리</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">뷰어</Badge>
                    <span>조회만 가능</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

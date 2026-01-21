"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getTripDetail, getTripOverview, getItineraries, getPhotos, getSharedChecklists, getPersonalChecklists, getExpenses, createChecklist, toggleChecklist, deleteChecklist, createItinerary, deleteItinerary, createActivity, updateActivity, deleteActivity, getAlbums, createAlbum, uploadPhotoToAlbum, deleteAlbum, getTripInvitations } from "@/lib/api"
import { TripInvitationStatus } from "@/lib/types"
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
  Cloud,
  CloudRain,
  Sun,
  TrendingUp,
  ImageIcon,
  UserPlus,
  CalendarPlus,
  Receipt,
  CheckSquare,
  LayoutDashboard,
  Hotel,
  // GripVertical, // TODO: 드래그 앤 드롭 기능용 - 나중에 구현
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateAlbumDialog } from "@/components/trip/create-album-dialog"
import ReservationTabs from "@/components/reservations/ReservationTabs"
import { PhotoUploadDialog } from "@/components/trip/photo-upload-dialog"
import { AlbumCard } from "@/components/trip/album-card"
import { InviteMemberDialog } from "@/components/trip/invite-member-dialog"
import ExpenseTabs from "@/components/expenses/ExpenseTabs"
// TODO: 드래그 앤 드롭 기능 - 나중에 구현
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core'
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable'
// import { CSS } from '@dnd-kit/utilities'

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
  planning: { label: "계획중", color: "bg-yellow-500 text-white" },
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

// 요약 탭용 추가 Mock 데이터
const weatherData = [
  { date: "2024-03-15", day: "금", high: 18, low: 12, condition: "sunny" },
  { date: "2024-03-16", day: "토", high: 16, low: 10, condition: "cloudy" },
  { date: "2024-03-17", day: "일", high: 14, low: 8, condition: "rainy" },
  { date: "2024-03-18", day: "월", high: 17, low: 11, condition: "sunny" },
]

const recentActivities = [
  {
    id: "1",
    user: "김여행",
    action: "새로운 사진을 추가했습니다",
    time: "2시간 전",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    user: "박모험",
    action: "체크리스트 항목을 완료했습니다",
    time: "5시간 전",
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    user: "이탐험",
    action: "일정에 '한라산 등반'을 추가했습니다",
    time: "1일 전",
    avatar: "/placeholder.svg",
  },
  {
    id: "4",
    user: "김여행",
    action: "지출 내역을 등록했습니다 (₩30,000)",
    time: "1일 전",
    avatar: "/placeholder.svg",
  },
]

const todaySchedule = [
  { time: "09:00", title: "제주공항 도착", location: "제주국제공항" },
  { time: "14:00", title: "성산일출봉", location: "성산일출봉" },
  { time: "18:00", title: "저녁식사", location: "올레국수" },
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

// TODO: 드래그 앤 드롭 기능 - 나중에 구현
// // 드래그 가능한 활동 아이템 컴포넌트
// function SortableActivityItem({ activity, onDelete }: { activity: any; onDelete: (id: string) => void }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: activity.id })

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   }

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors ${
//         isDragging ? 'shadow-lg z-50' : ''
//       }`}
//     >
//       {/* 드래그 핸들 */}
//       <div
//         {...attributes}
//         {...listeners}
//         className="cursor-grab active:cursor-grabbing pt-1 text-gray-400 hover:text-gray-600 transition-colors"
//       >
//         <GripVertical className="w-5 h-5" />
//       </div>

//       <div className="text-sm font-medium text-blue-600 min-w-[60px] pt-1">{activity.time}</div>
//       <div className="flex-1">
//         <div className="flex items-center space-x-2 mb-1">
//           <h4 className="font-medium text-gray-900">{activity.title}</h4>
//           <Badge className={activityTypeConfig[activity.type as keyof typeof activityTypeConfig].color}>
//             {activityTypeConfig[activity.type as keyof typeof activityTypeConfig].icon}
//             {activityTypeConfig[activity.type as keyof typeof activityTypeConfig].label}
//           </Badge>
//         </div>
//         <p className="text-sm text-gray-600 flex items-center mb-1">
//           <MapPin className="w-3 h-3 mr-1" />
//           {activity.location}
//         </p>
//         <div className="flex items-center space-x-4 text-xs text-gray-500">
//           <div className="flex items-center">
//             <Clock className="w-3 h-3 mr-1" />
//             {activity.duration}
//           </div>
//           {activity.cost > 0 && (
//             <div className="flex items-center">
//               <DollarSign className="w-3 h-3 mr-1" />₩{activity.cost.toLocaleString()}
//             </div>
//           )}
//         </div>
//         {activity.notes && (
//           <p className="text-xs text-gray-500 mt-2 flex items-start">
//             <MessageCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
//             <span>{activity.notes}</span>
//           </p>
//         )}
//       </div>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full">
//             <MoreHorizontal className="w-4 h-4 text-gray-500" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end" className="w-44">
//           <DropdownMenuItem
//             onClick={() => onDelete(activity.id)}
//             className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
//           >
//             <Trash2 className="w-4 h-4 mr-2" />
//             삭제하기
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   )
// }

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth() // 현재 로그인한 사용자 정보
  const [activeTab, setActiveTab] = useState("overview")
  const [likedPhotos, setLikedPhotos] = useState<string[]>([])
  const [tripData, setTripData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 탭별 실제 데이터 상태 (API에서 불러온 데이터)
  const [overviewData, setOverviewData] = useState<any>(null)
  const [itinerariesData, setItinerariesData] = useState<any[]>([])
  const [photosData, setPhotosData] = useState<any[]>([])
  const [sharedChecklistsData, setSharedChecklistsData] = useState<any[]>([])
  const [personalChecklistsData, setPersonalChecklistsData] = useState<any[]>([])
  const [expensesData, setExpensesData] = useState<any[]>([])
  const [tabLoading, setTabLoading] = useState(false)

  // 체크리스트 관련 상태
  const [showAddChecklist, setShowAddChecklist] = useState(false)
  const [checklistType, setChecklistType] = useState<'shared' | 'personal'>('shared')
  const [newChecklistTask, setNewChecklistTask] = useState("")
  const [selectedPriority, setSelectedPriority] = useState<string>("")
  const [addingChecklist, setAddingChecklist] = useState(false)

  // 일정(하루) 관련 상태
  const [showAddItinerary, setShowAddItinerary] = useState(false)
  const [newItinerary, setNewItinerary] = useState({
    dayNumber: 1,
    date: ""
  })
  const [addingItinerary, setAddingItinerary] = useState(false)

  // 활동 관련 상태
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [selectedDayForActivity, setSelectedDayForActivity] = useState<any>(null)
  const [newActivity, setNewActivity] = useState({
    time: "",
    title: "",
    location: "",
    type: "activity",
    durationHours: 0,
    durationMinutes: 0,
    cost: 0,
    notes: ""
  })

  // 활동 수정 관련 상태
  const [showEditActivity, setShowEditActivity] = useState(false)
  const [editingActivity, setEditingActivity] = useState<any>(null)
  const [updatingActivity, setUpdatingActivity] = useState(false)

  // 앨범/사진 관련 상태
  const [albums, setAlbums] = useState<any[]>([])
  const [showCreateAlbum, setShowCreateAlbum] = useState(false)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null)

  // 초대 목록 상태
  const [invitations, setInvitations] = useState<TripInvitationStatus[]>([])
  const [invitationsLoading, setInvitationsLoading] = useState(false)

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
    window.scrollTo(0, 0); // Add this line
    const loadTabData = async () => {
      if (!params.id) return

      try {
        setTabLoading(true)

        switch (activeTab) {
          case 'overview':
            if (!overviewData) {
              console.log('🔥 개요 데이터 로딩 시작')
              const data = await getTripOverview(Number(params.id))
              console.log('✅ 개요 데이터 로딩 완료:', data)
              setOverviewData(data)
            }
            break
          case 'itinerary':
            if (itinerariesData.length === 0) {
              console.log('🔥 일정 데이터 로딩 시작')
              const data = await getItineraries(Number(params.id))
              console.log('✅ 일정 데이터 로딩 완료:', data)
              setItinerariesData(data || [])
            }
            break
          case 'photos':
            if (!albums || albums.length === 0) {
              console.log('🔥 앨범 데이터 로딩 시작')
              const data = await getAlbums(Number(params.id))
              console.log('✅ 앨범 데이터 로딩 완료:', data)
              setAlbums(data || [])
            }
            break
          case 'checklist':
            if (sharedChecklistsData.length === 0 && personalChecklistsData.length === 0) {
              console.log('🔥 체크리스트 데이터 로딩 시작')
              const [sharedData, personalData] = await Promise.all([
                getSharedChecklists(Number(params.id)),
                getPersonalChecklists(Number(params.id))
              ])
              console.log('✅ 공용 체크리스트:', sharedData)
              console.log('✅ 개인 체크리스트:', personalData)
              setSharedChecklistsData(sharedData || [])
              setPersonalChecklistsData(personalData || [])
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
          case 'members':
            console.log('🔥 초대 목록 로딩 시작')
            const invitationsData = await getTripInvitations(Number(params.id))
            console.log('✅ 초대 목록 로딩 완료:', invitationsData)
            setInvitations(invitationsData || [])
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

  // 앨범 생성
  const handleCreateAlbum = async (data: { albumTitle: string; albumDate: string }) => {
    try {
      await createAlbum(Number(params.id), data)
      // 앨범 목록 새로고침
      const updatedAlbums = await getAlbums(Number(params.id))
      setAlbums(updatedAlbums)
    } catch (error) {
      console.error('앨범 생성 실패:', error)
      alert('앨범 생성에 실패했습니다.')
      throw error
    }
  }

  // 사진 업로드
  const handlePhotoUpload = async (albumId: number, file: File) => {
    try {
      await uploadPhotoToAlbum(Number(params.id), albumId, file)
      // 앨범 목록 새로고침
      const updatedAlbums = await getAlbums(Number(params.id))
      setAlbums(updatedAlbums)
    } catch (error) {
      console.error('사진 업로드 실패:', error)
      throw error
    }
  }

  // 앨범 삭제
  const handleDeleteAlbum = async (albumId: number) => {
    if (!confirm('이 앨범과 모든 사진을 삭제하시겠습니까?')) return

    try {
      await deleteAlbum(Number(params.id), albumId)
      // 로컬 상태에서 제거
      setAlbums((prev) => prev.filter((album) => album.id !== albumId))
    } catch (error) {
      console.error('앨범 삭제 실패:', error)
      alert('앨범 삭제에 실패했습니다.')
    }
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

      const isShared = checklistType === 'shared'

      // 체크리스트 생성
      const newItem = await createChecklist(
        Number(params.id),
        newChecklistTask.trim(),
        isShared,
        isShared ? undefined : user.id  // 공용이면 assigneeUserId 없음, 개인이면 현재 사용자
      )

      // 성공하면 해당 타입의 체크리스트 데이터 새로고침
      if (isShared) {
        const updatedShared = await getSharedChecklists(Number(params.id))
        setSharedChecklistsData(updatedShared)
      } else {
        const updatedPersonal = await getPersonalChecklists(Number(params.id))
        setPersonalChecklistsData(updatedPersonal)
      }

      // 입력 필드 초기화
      setNewChecklistTask("")
      setSelectedPriority("")
      setShowAddChecklist(false)
    } catch (err) {
      console.error('체크리스트 추가 실패:', err)
      alert('체크리스트 추가에 실패했습니다.')
    } finally {
      setAddingChecklist(false)
    }
  }

  // 체크리스트 항목 체크/체크 해제
  const handleToggleChecklist = async (checklistId: number, isShared: boolean) => {
    try {
      const updatedItem = await toggleChecklist(checklistId)

      // 로컬 상태 업데이트 (공용/개인 분리)
      if (isShared) {
        setSharedChecklistsData((prev) =>
          prev.map((item) =>
            item.id === checklistId
              ? { ...item, completed: updatedItem.completed, completedAt: updatedItem.completedAt }
              : item
          )
        )
      } else {
        setPersonalChecklistsData((prev) =>
          prev.map((item) =>
            item.id === checklistId
              ? { ...item, completed: updatedItem.completed, completedAt: updatedItem.completedAt }
              : item
          )
        )
      }
    } catch (err) {
      console.error('체크리스트 토글 실패:', err)
      alert('체크리스트 수정에 실패했습니다.')
    }
  }

  // 체크리스트 항목 삭제
  const handleDeleteChecklist = async (checklistId: number, isShared: boolean) => {
    if (!confirm('이 항목을 삭제하시겠습니까?')) return

    try {
      await deleteChecklist(checklistId)

      // 로컬 상태에서 삭제 (공용/개인 분리)
      if (isShared) {
        setSharedChecklistsData((prev) => prev.filter((item) => item.id !== checklistId))
      } else {
        setPersonalChecklistsData((prev) => prev.filter((item) => item.id !== checklistId))
      }
    } catch (err) {
      console.error('체크리스트 삭제 실패:', err)
      alert('체크리스트 삭제에 실패했습니다.')
    }
  }

  // 일정(하루) 추가
  const handleAddItinerary = async () => {
    if (!newItinerary.date) {
      alert('날짜는 필수입니다.')
      return
    }

    try {
      setAddingItinerary(true)

      const response = await createItinerary(
        Number(params.id),
        newItinerary.dayNumber,
        newItinerary.date
      )

      console.log('일정 생성 성공:', response)

      // 일정 목록 새로고침
      const updatedItineraries = await getItineraries(Number(params.id))
      setItinerariesData(updatedItineraries)

      // 입력 필드 초기화
      setNewItinerary({
        dayNumber: displayItinerary.length + 1,
        date: ""
      })
      setShowAddItinerary(false)

      alert(`Day ${response.dayNumber} 일정이 추가되었습니다!`)
    } catch (err: any) {
      console.error('일정 추가 실패:', err)
      alert(err.response?.data?.message || '일정 추가에 실패했습니다.')
    } finally {
      setAddingItinerary(false)
    }
  }

  // 일정(하루) 삭제
  const handleDeleteItinerary = async (itineraryId: number, dayNumber: number) => {
    if (!confirm(`Day ${dayNumber} 일정을 삭제하시겠습니까?\n모든 활동도 함께 삭제됩니다.`)) {
      return
    }

    try {
      const response = await deleteItinerary(itineraryId)
      console.log('일정 삭제 성공:', response)

      // 일정 목록 새로고침
      const updatedItineraries = await getItineraries(Number(params.id))
      setItinerariesData(updatedItineraries)

      alert(`Day ${response.dayNumber} 일정이 삭제되었습니다.`)
    } catch (err: any) {
      console.error('일정 삭제 실패:', err)
      alert(err.response?.data?.message || '일정 삭제에 실패했습니다.')
    }
  }

  // 활동 추가
  const handleAddActivity = async () => {
    if (!newActivity.title.trim() || !newActivity.time) {
      alert('시간과 활동명은 필수입니다.')
      return
    }

    if (!selectedDayForActivity?.id) {
      alert('일정을 선택해주세요.')
      return
    }

    try {
      // 소요시간을 분 단위로 변환
      const totalMinutes = (newActivity.durationHours * 60) + newActivity.durationMinutes

      const activityData = {
        time: newActivity.time + ":00", // 초 단위 추가 (HH:mm:ss 형식)
        title: newActivity.title,
        location: newActivity.location || undefined,
        activityType: newActivity.type?.toUpperCase(),
        durationMinutes: totalMinutes > 0 ? totalMinutes : undefined,
        cost: newActivity.cost || 0,
        notes: newActivity.notes || undefined,
      }

      await createActivity(selectedDayForActivity.id, activityData)

      // 일정 목록 새로고침
      const updatedItineraries = await getItineraries(Number(params.id))
      setItinerariesData(updatedItineraries)

      // 입력 필드 초기화
      setNewActivity({
        time: "",
        title: "",
        location: "",
        type: "activity",
        durationHours: 0,
        durationMinutes: 0,
        cost: 0,
        notes: ""
      })
      setShowAddActivity(false)
      setSelectedDayForActivity(null)

      alert('활동이 추가되었습니다!')
    } catch (err: any) {
      console.error('활동 추가 실패:', err)
      alert(err.response?.data?.message || '활동 추가에 실패했습니다.')
    }
  }

  // 활동 수정 Dialog 열기
  const handleOpenEditActivity = (activity: any) => {
    // HH:mm:ss 형식에서 HH:mm만 추출
    const timeWithoutSeconds = activity.time ? activity.time.substring(0, 5) : ''

    // 소요시간(분)을 시간과 분으로 분리
    const totalMinutes = activity.duration ? parseInt(activity.duration) : 0
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    setEditingActivity({
      ...activity,
      time: timeWithoutSeconds,
      durationHours: hours,
      durationMinutes: minutes,
    })
    setShowEditActivity(true)
  }

  // 활동 수정
  const handleUpdateActivity = async () => {
    if (!editingActivity?.title?.trim() || !editingActivity?.time) {
      alert('시간과 활동명은 필수입니다.')
      return
    }

    try {
      setUpdatingActivity(true)

      // 소요시간을 분 단위로 변환
      const totalMinutes = (editingActivity.durationHours * 60) + editingActivity.durationMinutes

      const updateData = {
        time: editingActivity.time + ":00", // 초 단위 추가 (HH:mm:ss 형식)
        title: editingActivity.title,
        location: editingActivity.location,
        activityType: editingActivity.type?.toUpperCase(),
        durationMinutes: totalMinutes > 0 ? totalMinutes : null,
        cost: editingActivity.cost || 0,
        notes: editingActivity.notes || null,
      }

      await updateActivity(editingActivity.id, updateData)

      // 일정 목록 새로고침
      const updatedItineraries = await getItineraries(Number(params.id))
      setItinerariesData(updatedItineraries)

      setShowEditActivity(false)
      setEditingActivity(null)
      alert('활동이 수정되었습니다!')
    } catch (err: any) {
      console.error('활동 수정 실패:', err)
      alert(err.response?.data?.message || '활동 수정에 실패했습니다.')
    } finally {
      setUpdatingActivity(false)
    }
  }

  // 활동 삭제
  const handleDeleteActivity = async (activityId: number, activityTitle: string) => {
    if (!confirm(`"${activityTitle}" 활동을 삭제하시겠습니까?`)) return

    try {
      await deleteActivity(activityId)

      // 일정 목록 새로고침
      const updatedItineraries = await getItineraries(Number(params.id))
      setItinerariesData(updatedItineraries)

      alert('활동이 삭제되었습니다!')
    } catch (err: any) {
      console.error('활동 삭제 실패:', err)
      alert(err.response?.data?.message || '활동 삭제에 실패했습니다.')
    }
  }

  // 시간을 오전/오후 형식으로 변환 (HH:mm:ss -> 오전/오후 HH:mm)
  const formatTime = (time: string) => {
    if (!time) return ''

    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const period = hour < 12 ? '오전' : '오후'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour

    return `${period} ${displayHour}:${minutes}`
  }

  // 소요시간(분)을 "~시간 ~분" 형식으로 변환
  const formatDuration = (minutes: number | null | undefined) => {
    if (!minutes || minutes === 0) return ''

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0 && mins > 0) {
      return `${hours}시간 ${mins}분`
    } else if (hours > 0) {
      return `${hours}시간`
    } else {
      return `${mins}분`
    }
  }

  // TODO: 드래그 앤 드롭 기능 - 나중에 구현
  // // 드래그 앤 드롭 센서 설정
  // const sensors = useSensors(
  //   useSensor(PointerSensor),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   })
  // )

  // // 드래그 종료 핸들러 (활동 순서 변경)
  // const handleDragEnd = (event: DragEndEvent, dayIndex: number) => {
  //   const { active, over } = event

  //   if (!over || active.id === over.id) {
  //     return
  //   }

  //   console.log('드래그 종료 (Mock):', {
  //     dayIndex,
  //     movedId: active.id,
  //     targetId: over.id,
  //   })

  //   // Mock: 실제로는 여기서 displayOrder 업데이트 API 호출
  //   alert(`Mock: 활동 순서가 변경되었습니다! (${active.id} → ${over.id})`)

  //   // TODO: 백엔드 연동 시 아래 로직 사용
  //   // const dayActivities = displayItinerary[dayIndex].activities
  //   // const oldIndex = dayActivities.findIndex((act: any) => act.id === active.id)
  //   // const newIndex = dayActivities.findIndex((act: any) => act.id === over.id)
  //   // const newOrder = arrayMove(dayActivities, oldIndex, newIndex)
  //   // updateActivityOrder(dayIndex, newOrder) // API 호출
  // }

  // 백엔드 데이터를 프론트엔드 형식으로 변환
  const transformItinerary = (data: any[]) => {
    return data.map((item, index) => ({
      id: item.id,  // ✅ 일정 ID 추가 (삭제 시 필요)
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
        duration: act.durationMinutes || 0,
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
        isShared: item.isShared,
        assignee: item.assigneeName || (item.isShared ? '공용' : '미지정'),
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
  // 일정과 체크리스트는 Mock 데이터 사용 안 함 (실제 API 데이터만 사용)
  const displayItinerary = itinerariesData.length > 0 ? transformItinerary(itinerariesData) : []  // mockTrip.itinerary
  const totalPhotoCount = albums?.reduce((total, album) => total + (album.photoCount || 0), 0) || 0
  const displaySharedChecklist = sharedChecklistsData.length > 0 ? transformChecklist(sharedChecklistsData) : []
  const displayPersonalChecklist = personalChecklistsData.length > 0 ? transformChecklist(personalChecklistsData) : []
  const displayExpenses = expensesData.length > 0 ? transformExpenses(expensesData) : mockTrip.expenses

  const completedSharedTasks = displaySharedChecklist.filter((item: any) => item.completed).length
  const totalSharedTasks = displaySharedChecklist.length
  const completedPersonalTasks = displayPersonalChecklist.filter((item: any) => item.completed).length
  const totalPersonalTasks = displayPersonalChecklist.length
  const budgetProgress = tripData?.statistics?.budgetUsagePercentage || (mockTrip.spent / mockTrip.budget) * 100

  // 요약 탭용 추가 변수들
  const daysUntilTrip = Math.ceil(
    (new Date(mockTrip.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  const completedChecklist = checklistData.filter((item) => item.completed).length
  const checklistProgress = Math.round((completedChecklist / checklistData.length) * 100)

  const budgetPercentage = Math.round((mockTrip.spent / mockTrip.budget) * 100)
  const remainingBudget = mockTrip.budget - mockTrip.spent

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="w-6 h-6 text-yellow-500" />
      case "cloudy":
        return <Cloud className="w-6 h-6 text-gray-400" />
      case "rainy":
        return <CloudRain className="w-6 h-6 text-blue-500" />
      default:
        return <Sun className="w-6 h-6 text-yellow-500" />
    }
  }

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
        {/* Responsive Navigation */}
        <div className="flex gap-6">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="sticky top-4 space-y-1 bg-white rounded-lg border p-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "overview"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>개요</span>
              </button>
              <button
                onClick={() => setActiveTab("itinerary")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "itinerary"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>일정</span>
              </button>
              <button
                onClick={() => setActiveTab("photos")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "photos"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Camera className="w-5 h-5" />
                <span>사진</span>
              </button>
              <button
                onClick={() => setActiveTab("checklist")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "checklist"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <CheckSquare className="w-5 h-5" />
                <span>체크리스트</span>
              </button>
              <button
                onClick={() => setActiveTab("reservations")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "reservations"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Hotel className="w-5 h-5" />
                <span>예약</span>
              </button>
              <button
                onClick={() => setActiveTab("expenses")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "expenses"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Receipt className="w-5 h-5" />
                <span>경비</span>
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "members"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Users className="w-5 h-5" />
                <span>멤버</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Hide default TabsList */}
          <TabsList className="hidden">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="itinerary">일정</TabsTrigger>
            <TabsTrigger value="photos">사진</TabsTrigger>
            <TabsTrigger value="checklist">체크리스트</TabsTrigger>
            <TabsTrigger value="reservations">예약</TabsTrigger>
            <TabsTrigger value="expenses">경비</TabsTrigger>
            <TabsTrigger value="members">멤버</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {tabLoading && !overviewData ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">개요 불러오는 중...</p>
                </div>
              </div>
            ) : overviewData ? (
              <>
            {/* D-Day Counter & Trip Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* D-Day Card */}
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm opacity-90 mb-2">여행까지</p>
                    <p className="text-5xl font-bold mb-2">
                      {overviewData.daysUntilTrip !== null ? `D-${overviewData.daysUntilTrip}` : '진행중'}
                    </p>
                    <p className="text-sm opacity-90">
                      {new Date(overviewData.startDate).toLocaleDateString("ko-KR", {
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      출발
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Trip Duration */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <Badge variant="outline">여행 기간</Badge>
                  </div>
                  <p className="text-2xl font-bold mb-1">{overviewData.tripDuration - 1}박 {overviewData.tripDuration}일</p>
                  <p className="text-sm text-gray-600">
                    {new Date(overviewData.startDate).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })} - {new Date(overviewData.endDate).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Budget Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>예산 현황</span>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("expenses")}>
                    자세히 보기
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">총 예산</p>
                    <p className="text-2xl font-bold">₩{overviewData.budgetStatus.totalBudget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">사용 금액</p>
                    <p className="text-2xl font-bold text-blue-600">₩{overviewData.budgetStatus.spentAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">남은 예산</p>
                    <p className="text-2xl font-bold text-green-600">₩{overviewData.budgetStatus.remainingBudget.toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>사용률</span>
                    <span className="font-medium">{overviewData.budgetStatus.usagePercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={overviewData.budgetStatus.usagePercentage} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Weather Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cloud className="w-5 h-5 mr-2" />
                    날씨 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {weatherData.map((day, index) => (
                      <div key={index} className="text-center">
                        <p className="text-xs text-gray-600 mb-2">{day.day}</p>
                        <div className="flex justify-center mb-2">{getWeatherIcon(day.condition)}</div>
                        <p className="text-sm font-medium">
                          {day.high}° / {day.low}°
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Checklist Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckSquare className="w-5 h-5 mr-2" />
                      미완료 체크리스트
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("checklist")}>
                      전체 보기
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">진행률</span>
                      <span className="font-semibold text-blue-600">
                        {overviewData.checklistProgress.completedItems} / {overviewData.checklistProgress.totalItems} 완료 ({overviewData.checklistProgress.completionPercentage}%)
                      </span>
                    </div>
                    <Progress value={overviewData.checklistProgress.completionPercentage} className="h-2.5" />
                  </div>

                  {overviewData.checklistProgress.incompleteItems && overviewData.checklistProgress.incompleteItems.length > 0 ? (
                    <div className="space-y-2.5">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">남은 항목 {overviewData.checklistProgress.totalItems - overviewData.checklistProgress.completedItems}개</p>
                      {overviewData.checklistProgress.incompleteItems.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.task}</p>
                          </div>
                          {item.isShared && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                              공동
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">
                        {overviewData.checklistProgress.totalItems === 0
                          ? "체크리스트가 아직 없습니다"
                          : "모든 체크리스트를 완료했습니다!"}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("checklist")}
                        className="mt-2"
                      >
                        체크리스트 관리
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    오늘의 일정
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("itinerary")}>
                    전체 일정
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {overviewData.todaySchedule && overviewData.todaySchedule.length > 0 ? (
                  <div className="space-y-3">
                    {overviewData.todaySchedule.map((schedule: any) => (
                      <div key={schedule.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 text-sm font-medium text-gray-600 flex-shrink-0">{schedule.time}</div>
                        <div className="flex-1">
                          <p className="font-medium">{schedule.title}</p>
                          <p className="text-sm text-gray-600">{schedule.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>오늘 예정된 일정이 없습니다</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 작업</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col space-y-2 bg-transparent"
                    onClick={() => setActiveTab("itinerary")}
                  >
                    <CalendarPlus className="w-6 h-6" />
                    <span className="text-sm">일정 추가</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col space-y-2 bg-transparent"
                    onClick={() => setActiveTab("photos")}
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-sm">사진 업로드</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col space-y-2 bg-transparent"
                    onClick={() => setActiveTab("members")}
                  >
                    <UserPlus className="w-6 h-6" />
                    <span className="text-sm">멤버 초대</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col space-y-2 bg-transparent"
                    onClick={() => setActiveTab("expenses")}
                  >
                    <Receipt className="w-6 h-6" />
                    <span className="text-sm">지출 추가</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Photo Gallery Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    앨범 미리보기
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("photos")}>
                    전체 보기
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {overviewData.albumPreview && overviewData.albumPreview.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {overviewData.albumPreview.slice(0, 5).map((album: any) => (
                      <div
                        key={album.albumId}
                        className="rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setActiveTab("photos")}
                      >
                        <div className="aspect-square relative">
                          {album.thumbnailUrl ? (
                            <img
                              src={album.thumbnailUrl}
                              alt={album.albumTitle}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="text-white text-xs font-medium truncate">{album.albumTitle}</p>
                            <p className="text-white/80 text-xs">{album.photoCount}장</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {overviewData.albumPreview.length > 5 && (
                      <div
                        className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => setActiveTab("photos")}
                      >
                        <div className="text-center">
                          <Plus className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500">+{overviewData.albumPreview.length - 5}개</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>아직 앨범이 없습니다</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("photos")}
                      className="mt-2"
                    >
                      앨범 만들기
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    동행자 ({overviewData.members.length}명)
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("members")}>
                    관리하기
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {overviewData.members && overviewData.members.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {overviewData.members.map((member: any) => (
                      <div key={member.userId} className="text-center">
                        <Avatar className="w-12 h-12 mx-auto mb-2">
                          <AvatarImage src={member.profileImage || "/placeholder.svg"} />
                          <AvatarFallback>{member.userName[0]}</AvatarFallback>
                        </Avatar>
                        <p className="text-xs font-medium">{member.userName}</p>
                        <p className="text-xs text-gray-500">
                          {member.role === "OWNER" ? "방장" : member.role === "EDITOR" ? "편집자" : "멤버"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>동행자가 없습니다</p>
                  </div>
                )}
              </CardContent>
            </Card>
              </>
            ) : null}
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">여행 일정</h2>
              <Button
                onClick={() => {
                  setNewItinerary({
                    dayNumber: displayItinerary.length + 1,
                    date: ""
                  })
                  setShowAddItinerary(true)
                }}
                className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                일정 추가
              </Button>
            </div>

            {/* 일정(하루) 추가 Dialog */}
            <Dialog open={showAddItinerary} onOpenChange={setShowAddItinerary}>
              <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50">
                {/* 장식 요소 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-orange-400/20 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

                <DialogHeader className="p-6 pb-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 shadow-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                        새로운 일정 추가
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        여행의 하루를 추가해보세요
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="px-6 py-4 space-y-5">
                  {/* 일차 */}
                  <div className="space-y-2">
                    <Label htmlFor="dayNumber" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>Day {newItinerary.dayNumber}</span>
                    </Label>
                    <p className="text-xs text-gray-500">
                      {displayItinerary.length + 1}일차로 자동 설정됩니다
                    </p>
                  </div>

                  {/* 날짜 */}
                  <div className="space-y-2">
                    <Label htmlFor="itinerary-date" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span>날짜 *</span>
                    </Label>
                    <Input
                      id="itinerary-date"
                      type="date"
                      value={newItinerary.date}
                      onChange={(e) => setNewItinerary({...newItinerary, date: e.target.value})}
                      disabled={addingItinerary}
                      className="h-11 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                      autoFocus
                    />
                  </div>
                </div>

                <DialogFooter className="p-6 pt-4 flex-col sm:flex-row gap-3 bg-gradient-to-r from-gray-50/50 to-orange-50/50">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddItinerary(false)
                      setNewItinerary({
                        dayNumber: 1,
                        date: ""
                      })
                    }}
                    disabled={addingItinerary}
                    className="w-full sm:w-auto border-2 hover:bg-gray-50"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleAddItinerary}
                    disabled={addingItinerary || !newItinerary.date}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingItinerary ? (
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

            {/* 활동 추가 Dialog */}
            <Dialog open={showAddActivity} onOpenChange={setShowAddActivity}>
              <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 max-h-[90vh] overflow-y-auto">
                {/* 장식 요소 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-orange-400/20 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

                <DialogHeader className="p-6 pb-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 shadow-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                        새로운 활동 추가
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        {selectedDayForActivity ? `${selectedDayForActivity.day}의 일정을 추가해보세요` : '일정을 추가해보세요'}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="px-6 py-4 space-y-5">
                  {/* 시간 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>시간 *</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">시간</Label>
                        <Select
                          value={newActivity.time.split(':')[0] || ''}
                          onValueChange={(value) => {
                            const currentMinute = newActivity.time.split(':')[1] || '00'
                            setNewActivity({...newActivity, time: `${value}:${currentMinute}`})
                          }}
                        >
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-400">
                            <SelectValue placeholder="시" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                              <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
                                {hour}시
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">분</Label>
                        <Select
                          value={newActivity.time.split(':')[1] || ''}
                          onValueChange={(value) => {
                            const currentHour = newActivity.time.split(':')[0] || '00'
                            setNewActivity({...newActivity, time: `${currentHour}:${value}`})
                          }}
                        >
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-400">
                            <SelectValue placeholder="분" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 10, 20, 30, 40, 50].map(minute => (
                              <SelectItem key={minute} value={minute.toString().padStart(2, '0')}>
                                {minute}분
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* 활동명 */}
                  <div className="space-y-2">
                    <Label htmlFor="activity-title" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <span>활동명 *</span>
                    </Label>
                    <Input
                      id="activity-title"
                      placeholder="예) 성산일출봉 트래킹"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                      className="h-11 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                      autoFocus
                    />
                  </div>

                  {/* 장소 */}
                  <div className="space-y-2">
                    <Label htmlFor="activity-location" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>장소</span>
                    </Label>
                    <Input
                      id="activity-location"
                      placeholder="예) 성산일출봉"
                      value={newActivity.location}
                      onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                      className="h-11 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                    />
                  </div>

                  {/* 활동 유형 */}
                  <div className="space-y-2">
                    <Label htmlFor="activity-type" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Badge className="w-4 h-4 bg-purple-500" />
                      <span>유형</span>
                    </Label>
                    <Select value={newActivity.type} onValueChange={(value) => setNewActivity({...newActivity, type: value})}>
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400">
                        <SelectValue placeholder="활동 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activity">
                          <div className="flex items-center space-x-2">
                            <span>🎯</span>
                            <span>관광/활동</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="food">
                          <div className="flex items-center space-x-2">
                            <span>🍽️</span>
                            <span>식사</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="transport">
                          <div className="flex items-center space-x-2">
                            <span>🚗</span>
                            <span>이동</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="accommodation">
                          <div className="flex items-center space-x-2">
                            <span>🏨</span>
                            <span>숙박</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="rest">
                          <div className="flex items-center space-x-2">
                            <span>☕</span>
                            <span>휴식</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 소요시간 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>소요시간</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">시간</Label>
                        <Select
                          value={newActivity.durationHours.toString()}
                          onValueChange={(value) => setNewActivity({...newActivity, durationHours: parseInt(value)})}
                        >
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-400">
                            <SelectValue placeholder="시간" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 25 }, (_, i) => i).map(hour => (
                              <SelectItem key={hour} value={hour.toString()}>
                                {hour}시간
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">분</Label>
                        <Select
                          value={newActivity.durationMinutes.toString()}
                          onValueChange={(value) => setNewActivity({...newActivity, durationMinutes: parseInt(value)})}
                        >
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-400">
                            <SelectValue placeholder="분" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 10, 20, 30, 40, 50].map(minute => (
                              <SelectItem key={minute} value={minute.toString()}>
                                {minute}분
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* 비용 */}
                  <div className="space-y-2">
                    <Label htmlFor="activity-cost" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-yellow-500" />
                      <span>비용 (원)</span>
                    </Label>
                    <Input
                      id="activity-cost"
                      type="number"
                      placeholder="0"
                      value={newActivity.cost || ""}
                      onChange={(e) => setNewActivity({...newActivity, cost: parseInt(e.target.value) || 0})}
                      className="h-11 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                    />
                  </div>

                  {/* 메모 */}
                  <div className="space-y-2">
                    <Label htmlFor="activity-notes" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-indigo-500" />
                      <span>메모</span>
                    </Label>
                    <textarea
                      id="activity-notes"
                      placeholder="예) 사전 예약 필요, 일출 시간대 추천 등"
                      value={newActivity.notes}
                      onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 text-base border-2 border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <DialogFooter className="p-6 pt-4 flex-col sm:flex-row gap-3 bg-gradient-to-r from-gray-50/50 to-orange-50/50">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddActivity(false)
                      setSelectedDayForActivity(null)
                      setNewActivity({
                        time: "",
                        title: "",
                        location: "",
                        type: "activity",
                        durationHours: 0,
                        durationMinutes: 0,
                        cost: 0,
                        notes: ""
                      })
                    }}
                    className="w-full sm:w-auto border-2 hover:bg-gray-50"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleAddActivity}
                    disabled={!newActivity.title.trim() || !newActivity.time}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    추가하기
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* 활동 수정 Dialog */}
            <Dialog open={showEditActivity} onOpenChange={setShowEditActivity}>
              <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 max-h-[90vh] overflow-y-auto">
                {/* 장식 요소 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-orange-400/20 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

                <DialogHeader className="p-6 pb-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 shadow-lg">
                      <Edit className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                        활동 수정
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        활동 정보를 수정해보세요
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                {editingActivity && (
                  <div className="px-6 py-4 space-y-5">
                    {/* 시간 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>시간 *</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">시간</Label>
                          <Select
                            value={editingActivity.time?.split(':')[0] || ''}
                            onValueChange={(value) => {
                              const currentMinute = editingActivity.time?.split(':')[1] || '00'
                              setEditingActivity({...editingActivity, time: `${value}:${currentMinute}`})
                            }}
                          >
                            <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-400">
                              <SelectValue placeholder="시" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                                <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
                                  {hour}시
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">분</Label>
                          <Select
                            value={editingActivity.time?.split(':')[1] || ''}
                            onValueChange={(value) => {
                              const currentHour = editingActivity.time?.split(':')[0] || '00'
                              setEditingActivity({...editingActivity, time: `${currentHour}:${value}`})
                            }}
                          >
                            <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-400">
                              <SelectValue placeholder="분" />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 10, 20, 30, 40, 50].map(minute => (
                                <SelectItem key={minute} value={minute.toString().padStart(2, '0')}>
                                  {minute}분
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* 활동명 */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-activity-title" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span>활동명 *</span>
                      </Label>
                      <Input
                        id="edit-activity-title"
                        placeholder="예) 성산일출봉 트래킹"
                        value={editingActivity.title || ""}
                        onChange={(e) => setEditingActivity({...editingActivity, title: e.target.value})}
                        className="h-11 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                        autoFocus
                      />
                    </div>

                    {/* 장소 */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-activity-location" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>장소</span>
                      </Label>
                      <Input
                        id="edit-activity-location"
                        placeholder="예) 성산일출봉"
                        value={editingActivity.location || ""}
                        onChange={(e) => setEditingActivity({...editingActivity, location: e.target.value})}
                        className="h-11 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                      />
                    </div>

                    {/* 활동 유형 */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-activity-type" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <Badge className="w-4 h-4 bg-purple-500" />
                        <span>유형</span>
                      </Label>
                      <Select value={editingActivity.type} onValueChange={(value) => setEditingActivity({...editingActivity, type: value})}>
                        <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400">
                          <SelectValue placeholder="활동 유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="activity">
                            <div className="flex items-center space-x-2">
                              <span>🎯</span>
                              <span>관광/활동</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="food">
                            <div className="flex items-center space-x-2">
                              <span>🍽️</span>
                              <span>식사</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="transport">
                            <div className="flex items-center space-x-2">
                              <span>🚗</span>
                              <span>이동</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="accommodation">
                            <div className="flex items-center space-x-2">
                              <span>🏨</span>
                              <span>숙박</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="rest">
                            <div className="flex items-center space-x-2">
                              <span>☕</span>
                              <span>휴식</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 소요시간 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span>소요시간</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">시간</Label>
                          <Select
                            value={editingActivity.durationHours?.toString() || '0'}
                            onValueChange={(value) => setEditingActivity({...editingActivity, durationHours: parseInt(value)})}
                          >
                            <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-400">
                              <SelectValue placeholder="시간" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 25 }, (_, i) => i).map(hour => (
                                <SelectItem key={hour} value={hour.toString()}>
                                  {hour}시간
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">분</Label>
                          <Select
                            value={editingActivity.durationMinutes?.toString() || '0'}
                            onValueChange={(value) => setEditingActivity({...editingActivity, durationMinutes: parseInt(value)})}
                          >
                            <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-400">
                              <SelectValue placeholder="분" />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 10, 20, 30, 40, 50].map(minute => (
                                <SelectItem key={minute} value={minute.toString()}>
                                  {minute}분
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* 비용 */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-activity-cost" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-yellow-500" />
                        <span>비용 (원)</span>
                      </Label>
                      <Input
                        id="edit-activity-cost"
                        type="number"
                        placeholder="0"
                        value={editingActivity.cost || ""}
                        onChange={(e) => setEditingActivity({...editingActivity, cost: parseInt(e.target.value) || 0})}
                        className="h-11 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                      />
                    </div>

                    {/* 메모 */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-activity-notes" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-indigo-500" />
                        <span>메모</span>
                      </Label>
                      <textarea
                        id="edit-activity-notes"
                        placeholder="예) 사전 예약 필요, 일출 시간대 추천 등"
                        value={editingActivity.notes || ""}
                        onChange={(e) => setEditingActivity({...editingActivity, notes: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 text-base border-2 border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                )}

                <DialogFooter className="p-6 pt-4 flex-col sm:flex-row gap-3 bg-gradient-to-r from-gray-50/50 to-orange-50/50">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditActivity(false)
                      setEditingActivity(null)
                    }}
                    disabled={updatingActivity}
                    className="w-full sm:w-auto border-2 hover:bg-gray-50"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleUpdateActivity}
                    disabled={!editingActivity?.title?.trim() || !editingActivity?.time || updatingActivity}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingActivity ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        수정 중...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        수정 완료
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {displayItinerary.length === 0 ? (
              <Card className="py-24 px-12 text-center bg-gradient-to-br from-blue-50 to-orange-50 min-h-[400px] flex flex-col items-center justify-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">아직 일정이 없습니다</h3>
                <p className="text-sm text-gray-600 mb-6">
                  첫 일정을 추가하고 여행 계획을 시작해보세요
                </p>
                <Button
                  onClick={() => {
                    setNewItinerary({
                      dayNumber: displayItinerary.length + 1,
                      date: ""
                    })
                    setShowAddItinerary(true)
                  }}
                  className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  첫 일정 추가하기
                </Button>
              </Card>
            ) : (
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
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDayForActivity(day)
                              setShowAddActivity(true)
                            }}
                            className="bg-gradient-to-r from-blue-50 to-orange-50 hover:from-blue-100 hover:to-orange-100 border-2 border-blue-200 hover:border-blue-300 transition-all"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            활동 추가
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={() => handleDeleteItinerary(day.id, day.dayNumber)}
                                className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                일정 삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {day.activities.map((activity: any, activityIndex: number) => (
                          <div
                            key={activityIndex}
                            className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="text-sm font-medium text-blue-600 min-w-[60px]">{formatTime(activity.time)}</div>
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
                                {activity.duration > 0 && (
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formatDuration(activity.duration)}
                                  </div>
                                )}
                                {activity.cost > 0 && (
                                  <div className="flex items-center">
                                    <DollarSign className="w-3 h-3 mr-1" />₩{activity.cost.toLocaleString()}
                                  </div>
                                )}
                              </div>
                              {activity.notes && (
                                <p className="text-xs text-gray-500 mt-2 flex items-start">
                                  <MessageCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                  <span>{activity.notes}</span>
                                </p>
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full">
                                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  onClick={() => handleOpenEditActivity(activity)}
                                  className="focus:bg-blue-50 cursor-pointer"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  수정하기
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteActivity(activity.id, activity.title)}
                                  className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  삭제하기
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">여행 앨범</h2>
              <Button
                onClick={() => setShowCreateAlbum(true)}
                className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                앨범 만들기
              </Button>
            </div>

            {tabLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">앨범을 불러오는 중...</div>
              </div>
            ) : !albums || albums.length === 0 ? (
              <Card className="py-24 px-12 text-center bg-gradient-to-br from-blue-50 to-orange-50 min-h-[400px] flex flex-col items-center justify-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">아직 앨범이 없습니다</h3>
                <p className="text-sm text-gray-600 mb-6">
                  첫 앨범을 만들고 여행의 소중한 순간을 기록해보세요
                </p>
                <Button
                  onClick={() => setShowCreateAlbum(true)}
                  className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  첫 앨범 만들기
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album) => (
                  <AlbumCard
                    key={album.id}
                    tripId={Number(params.id)}
                    album={album}
                    onUploadClick={(e) => {
                      e.preventDefault()
                      setSelectedAlbum(album)
                      setShowPhotoUpload(true)
                    }}
                    onDeleteAlbum={(e) => {
                      e.preventDefault()
                      handleDeleteAlbum(album.id)
                    }}
                  />
                ))}
              </div>
            )}

            {/* 앨범 생성 다이얼로그 */}
            <CreateAlbumDialog
              open={showCreateAlbum}
              onOpenChange={setShowCreateAlbum}
              onSubmit={handleCreateAlbum}
            />

            {/* 사진 업로드 다이얼로그 */}
            {selectedAlbum && (
              <PhotoUploadDialog
                open={showPhotoUpload}
                onOpenChange={setShowPhotoUpload}
                albumId={selectedAlbum.id}
                albumTitle={selectedAlbum.albumTitle}
                onUpload={handlePhotoUpload}
              />
            )}
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">체크리스트</h2>
              <p className="text-sm text-gray-600 mt-1">
                팀 전체와 개인별 준비사항을 관리하세요
              </p>
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
                        {checklistType === 'shared' ? '공용 체크리스트 추가' : '개인 체크리스트 추가'}
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        {checklistType === 'shared'
                          ? '팀 전체가 함께 준비할 항목을 추가하세요'
                          : '개인적으로 준비할 항목을 추가하세요'}
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
                      placeholder={checklistType === 'shared'
                        ? "예) 숙소 예약, 렌터카 예약"
                        : "예) 여권 챙기기, 옷 준비하기"}
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

                  {/* 우선순위 선택 - displayOrder는 백엔드에서 자동 할당되므로 UI 제거 */}
                  {/* <div className="space-y-3">
                    <Label htmlFor="priority" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-[8px] text-white font-bold">
                        #
                      </div>
                      <span>우선순위</span>
                    </Label>
                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-400 transition-all">
                        <SelectValue placeholder="우선순위를 선택하세요 (기본: 마지막)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-xs text-white font-bold">
                              1
                            </div>
                            <span>최우선 (맨 위)</span>
                          </div>
                        </SelectItem>
                        {displayChecklist.length > 0 && displayChecklist.map((item: any, index: number) => (
                          <SelectItem key={item.id} value={String((item.displayOrder || index + 1) + 1)}>
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-700 font-bold">
                                {(item.displayOrder || index + 1) + 1}
                              </div>
                              <span className="text-gray-600 truncate max-w-[200px]">{item.text} 다음</span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="last">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 font-bold">
                              {displayChecklist.length + 1}
                            </div>
                            <span>마지막 (기본)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">선택하지 않으면 마지막에 추가됩니다</p>
                  </div> */}

                  {/* 사용자 정보 표시 (개인 체크리스트만) */}
                  {checklistType === 'personal' && (
                    <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
                      <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold">
                          {user?.name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">담당자</p>
                        <p className="text-sm text-gray-600">{user?.name || '알 수 없음'}</p>
                      </div>
                    </div>
                  )}

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

            {/* 공용 체크리스트 */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">공동 준비사항</CardTitle>
                      <p className="text-xs text-gray-600 mt-0.5">
                        팀 전체가 함께 준비할 항목 • {completedSharedTasks}/{totalSharedTasks} 완료
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {totalSharedTasks > 0 && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round((completedSharedTasks / totalSharedTasks) * 100)}%
                        </div>
                      </div>
                    )}
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => {
                        setChecklistType('shared')
                        setShowAddChecklist(true)
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      추가
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {displaySharedChecklist.length === 0 ? (
                  <div className="text-center py-12 bg-white/50 rounded-lg border-2 border-dashed border-gray-300">
                    <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600">공용 체크리스트가 없습니다</p>
                    <p className="text-xs text-gray-500 mt-1">우측 상단 "추가" 버튼을 눌러 항목을 추가하세요</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {displaySharedChecklist.map((item: any, index: number) => (
                      <div
                        key={item.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                          item.completed
                            ? "bg-green-50 border border-green-200"
                            : "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleChecklist(item.id, true)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium ${item.completed ? "text-gray-500 line-through" : "text-gray-900"}`}>
                            {item.text}
                          </span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDeleteChecklist(item.id, true)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 개인 체크리스트 */}
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">내 준비사항</CardTitle>
                      <p className="text-xs text-gray-600 mt-0.5">
                        개인적으로 준비할 항목 • {completedPersonalTasks}/{totalPersonalTasks} 완료
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {totalPersonalTasks > 0 && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">
                          {Math.round((completedPersonalTasks / totalPersonalTasks) * 100)}%
                        </div>
                      </div>
                    )}
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      onClick={() => {
                        setChecklistType('personal')
                        setShowAddChecklist(true)
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      추가
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {displayPersonalChecklist.length === 0 ? (
                  <div className="text-center py-12 bg-white/50 rounded-lg border-2 border-dashed border-gray-300">
                    <CheckCircle2 className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600">개인 체크리스트가 없습니다</p>
                    <p className="text-xs text-gray-500 mt-1">우측 상단 "추가" 버튼을 눌러 항목을 추가하세요</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {displayPersonalChecklist.map((item: any, index: number) => (
                      <div
                        key={item.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                          item.completed
                            ? "bg-green-50 border border-green-200"
                            : "bg-white border border-gray-200 hover:border-orange-300 hover:shadow-sm"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleChecklist(item.id, false)}
                          className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-2 focus:ring-orange-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium ${item.completed ? "text-gray-500 line-through" : "text-gray-900"}`}>
                            {item.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 border">
                            <AvatarFallback className="text-xs bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                              {item.assignee[0]}
                            </AvatarFallback>
                          </Avatar>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleDeleteChecklist(item.id, false)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <ExpenseTabs tripId={Number(params.id)} />
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">동행자 관리</h2>
              <InviteMemberDialog
                tripId={Number(params.id)}
                tripTitle={displayTrip.title || '여행'}
                onInviteSuccess={async () => {
                  // 초대 후 목록 새로고침
                  try {
                    const data = await getTripInvitations(Number(params.id))
                    setInvitations(data)
                  } catch (e) {
                    console.error('초대 목록 새로고침 실패:', e)
                  }
                }}
              />
            </div>

            {/* 합류한 동행자 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  합류한 동행자 ({(displayTrip.participants || []).length}명)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(displayTrip.participants || mockTrip.participants).map((participant: any) => (
                    <div key={participant.participantId || participant.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
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
                            {(participant.role === "OWNER" || participant.role === "owner") ? "방장" : (participant.role === "EDITOR" || participant.role === "editor") ? "편집자" : "멤버"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{participant.userEmail || participant.email}</p>
                      </div>
                      {participant.role !== "OWNER" && participant.role !== "owner" && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 초대 대기중 */}
            {invitations.filter(inv => inv.status === 'PENDING').length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    초대 대기중 ({invitations.filter(inv => inv.status === 'PENDING').length}명)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {invitations.filter(inv => inv.status === 'PENDING').map((invitation) => (
                      <div key={invitation.id} className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Avatar className="w-12 h-12 bg-yellow-100">
                          <AvatarFallback className="bg-yellow-100 text-yellow-700">
                            {invitation.name?.[0] || invitation.invitedEmail[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {invitation.name || invitation.invitedEmail}
                            </h3>
                            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">
                              대기중
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{invitation.invitedEmail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 거절됨/만료됨 */}
            {invitations.filter(inv => inv.status === 'REJECTED' || inv.status === 'EXPIRED').length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-500">
                    <X className="w-5 h-5" />
                    거절/만료 ({invitations.filter(inv => inv.status === 'REJECTED' || inv.status === 'EXPIRED').length}명)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {invitations.filter(inv => inv.status === 'REJECTED' || inv.status === 'EXPIRED').map((invitation) => (
                      <div key={invitation.id} className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg opacity-60">
                        <Avatar className="w-12 h-12 bg-gray-200">
                          <AvatarFallback className="bg-gray-200 text-gray-500">
                            {invitation.name?.[0] || invitation.invitedEmail[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-600">
                              {invitation.name || invitation.invitedEmail}
                            </h3>
                            <Badge variant="outline" className="text-xs bg-gray-200 text-gray-500">
                              {invitation.status === 'REJECTED' ? '거절됨' : '만료됨'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">{invitation.invitedEmail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
                    <Badge variant="outline">멤버</Badge>
                    <span>조회 및 기본 참여</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <ReservationTabs />
          </TabsContent>
        </Tabs>
          </div>
        </div>

        {/* Mobile Bottom Navigation - Horizontal Scroll */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 safe-area-inset-bottom">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex flex-col items-center justify-center gap-1 min-w-[80px] h-16 flex-shrink-0 ${
                activeTab === "overview" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs">개요</span>
            </button>
            <button
              onClick={() => setActiveTab("itinerary")}
              className={`flex flex-col items-center justify-center gap-1 min-w-[80px] h-16 flex-shrink-0 ${
                activeTab === "itinerary" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">일정</span>
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`flex flex-col items-center justify-center gap-1 min-w-[80px] h-16 flex-shrink-0 ${
                activeTab === "photos" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <Camera className="w-5 h-5" />
              <span className="text-xs">사진</span>
            </button>
            <button
              onClick={() => setActiveTab("checklist")}
              className={`flex flex-col items-center justify-center gap-1 min-w-[80px] h-16 flex-shrink-0 ${
                activeTab === "checklist" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <CheckSquare className="w-5 h-5" />
              <span className="text-xs">체크리스트</span>
            </button>
            <button
              onClick={() => setActiveTab("reservations")}
              className={`flex flex-col items-center justify-center gap-1 min-w-[80px] h-16 flex-shrink-0 ${
                activeTab === "reservations" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <Hotel className="w-5 h-5" />
              <span className="text-xs">예약</span>
            </button>
            <button
              onClick={() => setActiveTab("expenses")}
              className={`flex flex-col items-center justify-center gap-1 min-w-[80px] h-16 flex-shrink-0 ${
                activeTab === "expenses" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <Receipt className="w-5 h-5" />
              <span className="text-xs">경비</span>
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`flex flex-col items-center justify-center gap-1 min-w-[80px] h-16 flex-shrink-0 ${
                activeTab === "members" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">멤버</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}

// 중앙화된 Mock 데이터
import type { Trip, User, Schedule, Album, ChecklistItem } from "./types"

export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "김여행",
    email: "kim@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=김",
  },
  {
    id: "2",
    name: "박모험",
    email: "park@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=박",
  },
  // ... 더 많은 사용자
]

export const MOCK_TRIPS: Trip[] = [
  {
    id: "1",
    title: "제주도 힐링 여행",
    destination: "제주도",
    startDate: "2024-03-15",
    endDate: "2024-03-18",
    status: "upcoming",
    coverImage: "/placeholder.svg?height=200&width=300&text=제주도+힐링+여행",
    participants: 3,
    photos: 0,
    budget: 800000,
    spent: 320000,
    isOwner: true,
    isPublic: false,
  },
  // ... 더 많은 여행
]

export const MOCK_SCHEDULES: Schedule[] = [
  // ... 더 많은 일정
]

export const MOCK_ALBUMS: Album[] = [
  // ... 더 많은 앨범
]

export const MOCK_CHECKLIST: ChecklistItem[] = [
  // ... 더 많은 체크리스트 항목
]

// 여행별 상세 데이터
export const getTripDetail = (id: string) => {
  // 실제 구현에서는 API 호출
  return {
    ...MOCK_TRIPS.find((trip) => trip.id === id),
    schedules: MOCK_SCHEDULES.filter((s) => s.tripId === id),
    albums: MOCK_ALBUMS.filter((a) => a.tripId === id),
    checklist: MOCK_CHECKLIST.filter((c) => c.tripId === id),
  }
}

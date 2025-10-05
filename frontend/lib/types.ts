export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Trip {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  status: "planning" | "upcoming" | "ongoing" | "completed"
  coverImage?: string
  participants: number
  photos: number
  description?: string
}

export interface TripCreate {
  title: string
  destination: string
  startDate: string
  endDate: string
  description?: string
}

// 백엔드 여행 계획 응답 타입
export interface TravelPlanResponse {
  id: number
  title: string
  description?: string
  destination: string
  startDate: string
  endDate: string
  imageUrl?: string
  estimatedCost?: number
  createdAt: string
  visibility: string
  tags?: string
  travelStyle?: string
  budgetLevel?: string
}

// 여행 상태 enum
export enum TravelPlanStatus {
  PLANNING = 'PLANNING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED'
}

// 여행 상태 응답 타입
export interface TravelPlanStatusResponse {
  tripId: number
  status: TravelPlanStatus
  statusDescription: string
}

export interface PopularTrip {
  id: string
  title: string
  destination: string
  author: string
  likes: number
  coverImage?: string
}

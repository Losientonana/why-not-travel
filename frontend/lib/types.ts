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

// ============================================
// 초대(Invitation) 관련 타입
// ============================================

export interface InvitationDetailResponse {
  invitationId: number
  tripId: number
  tripTitle: string
  tripDestination: string
  tripStartDate: string
  tripEndDate: string
  inviterName: string
  invitedEmail: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  expiresAt: string
  createdAt: string
}

export interface InvitationAcceptResponse {
  message: string
  invitationId: number
  tripId: number
  status: string
  acceptedAt: string
}

export interface InvitationRejectResponse {
  message: string
  invitationId: number
  status: string
}

export interface InvitationResponse {
  invitationId: number
  tripTitle: string
  inviterName: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  invitedEmail: string
  createdAt: string
  expiresAt: string
}

// ============================================
// 알림(Notification) 관련 타입
// ============================================

export type NotificationType = 'INVITATION' | 'TRIP_UPDATE' | 'COMMENT' | 'SYSTEM'

export interface AppNotification {
  id: number
  userId: number
  type: NotificationType
  title: string
  content: string
  relatedData?: string  // invitation token or other related data
  isRead: boolean
  createdAt: string
  readAt?: string
}

export interface SSENotificationEvent {
  id: string  // event ID (e.g., "notif-123")
  type: string  // event type (e.g., "invitation", "trip_update")
  data: AppNotification
}

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
  isOwner?: boolean
  budget?: number
  spent?: number
}

export interface TripCreate {
  title: string
  destination: string
  startDate: string
  endDate: string
  description?: string
}

// ============================================
// 공동 경비(SharedFund) 관련 타입
// ============================================

// 공동 경비 계좌
export interface SharedFund {
  id: number
  tripId: number
  currentBalance: number  // camelCase
  createdAt: string
  updatedAt: string
}

// 거래 내역
export interface SharedFundTransaction {
  id: number
  tripId: number
  type: "DEPOSIT" | "EXPENSE"
  amount: number
  balanceAfter: number
  description: string
  category?: string
  createdBy: {
    userId: number
    userName: string
  }
  createdAt: string
}

// 입금 요청
export interface SharedFundDepositRequest {
  amountPerPerson: number
  description?: string
}

// 지출 요청
export interface SharedFundExpenseRequest {
  date: string  // yyyy-MM-dd
  category: string
  amount: number
  description: string
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
  imageUrl?: string
  participants?: number
  duration?: string
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

export type NotificationType = 'INVITATION' | 'TRIP_UPDATE' | 'COMMENT' | 'SYSTEM' | 'SETTLEMENT_REQUEST' | 'SETTLEMENT_APPROVED' | 'SETTLEMENT_REJECTED' | 'SETTLEMENT_COMPLETED'

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

// ============================================
// 경비 관련 타입
// ============================================

export interface TripMember {
  userId: number
  userName: string
  profileImage?: string
}

export interface SharedFundTransaction {
  id: number
  tripId: number
  type: "DEPOSIT" | "EXPENSE"
  amount: number
  balanceAfter: number
  description: string
  category?: string
  createdAt: string
  createdBy: {
    userId: number
    userName: string
  }
}

export interface ExpenseParticipant {
  userId: number
  userName: string
  shareAmount: number
  paidAmount: number
  owedAmount: number
}

export interface IndividualExpense {
  id: number
  tripId: number
  expenseType: "PERSONAL" | "PARTIAL_SHARED"
  totalAmount: number
  description: string
  category: string
  date: string
  splitMethod: "EQUAL" | "CUSTOM"
  createdBy: {
    userId: number
    userName: string
  }
  participants: ExpenseParticipant[]
  receiptUrl?: string
}

export interface DebtSummary {
  creditors: Array<{
    userId: number
    userName: string
    amount: number
  }>
  debtors: Array<{
    userId: number
    userName: string
    amount: number
  }>
  totalToReceive: number
  totalToPay: number
}

export interface SettlementResponse {
  id: number
  tripId: number
  fromUserId: number
  fromUserName: string
  toUserId: number
  toUserName: string
  amount: number
  status: "PENDING" | "APPROVED" | "REJECTED"
  requestedBy: number
  requestedByName: string
  completedAt?: string
  createdAt: string
  memo?: string
}

export interface SettlementListResponse {
  settlements: SettlementResponse[]
}

export interface CreateSettlementRequest {
  fromUserId: number
  toUserId: number
  amount: number
  memo?: string
}

// 정산 플랜 응답 (그리디 알고리즘 결과)
export interface SettlementPlanResponse {
  senderId: number
  senderName: string
  receiverId: number
  receiverName: string
  amount: number
}

// 정산 요약 응답 (개별정산 집계 + 그리디 알고리즘)
export interface BalanceSummaryResponse {
  totalToReceive: number
  totalToPay: number
  creditors: Array<{
    userId: number
    userName: string
    amount: number
  }>
  debtors: Array<{
    userId: number
    userName: string
    amount: number
  }>
  optimalPlan: SettlementPlanResponse[]
}

export interface ExpenseStatistics {
  myTotalExpense: number
  averagePerPerson: number
  categoryBreakdown: Array<{
    category: string
    amount: number
    percentage: number
    color: string
  }>
  personalBreakdown: Array<{
    userId: number
    userName: string
    amount: number
    percentage: number
  }>
  dailyExpenses: Array<{
    date: string
    amount: number
  }>
}

// ============================================
// 여행 개요(Overview) 관련 타입
// ============================================

export interface TripOverview {
  tripId: number
  title: string
  destination: string
  startDate: string
  endDate: string
  description?: string
  imageUrl?: string
  daysUntilTrip: number | null  // D-Day (과거면 null)
  tripDuration: number  // 여행 기간 (일수)
  budgetStatus: BudgetStatus
  checklistProgress: ChecklistProgress
  todaySchedule: TodayScheduleItem[]
  albumPreview: AlbumPreview[]
  members: TripMember[]
}

export interface BudgetStatus {
  totalBudget: number
  spentAmount: number
  remainingBudget: number
  usagePercentage: number
}

export interface ChecklistProgress {
  totalItems: number
  completedItems: number
  completionPercentage: number
  incompleteItems: ChecklistPreviewItem[]
}

export interface ChecklistPreviewItem {
  id: number
  task: string
  isShared: boolean
}

export interface TodayScheduleItem {
  id: number
  time: string
  title: string
  location: string
}

export interface AlbumPreview {
  albumId: number
  albumTitle: string
  albumDate: string
  thumbnailUrl: string | null
  photoCount: number
}

export interface TripMember {
  userId: number
  userName: string
  email: string
  profileImage?: string
  role: string
}

// ============================================
// 체크리스트 관련 타입
// ============================================

export interface ChecklistItem {
  id: number
  task: string
  completed: boolean
  isShared: boolean  // true: 공용, false: 개인
  assigneeUserId?: number
  assigneeName?: string
  completedAt?: string
  displayOrder: number
}

export interface CreateChecklistRequest {
  task: string
  isShared: boolean
  assigneeUserId?: number
}

// ============================================
// 예약(Reservation) 관련 타입
// ============================================

export type ReservationType = "flight" | "accommodation" | "attraction" | "transport" | "restaurant" | "activity"

export type ReservationStatus = "confirmed" | "pending" | "cancelled"

export interface Location {
  address: string
  latitude?: number
  longitude?: number
  placeId?: string // For Google Maps API integration
}

export interface Reservation {
  id: number
  tripId: number
  type: ReservationType
  title: string
  description?: string
  status: ReservationStatus
  startDate: string
  endDate?: string
  startTime?: string
  endTime?: string
  location?: Location
  price?: number
  currency?: string
  confirmationNumber?: string
  bookingPlatform?: string
  bookingUrl?: string
  notes?: string
  attachments?: string[]
  createdBy: {
    userId: number
    userName: string
  }
  createdAt: string
  updatedAt: string
  // For flights
  flightNumber?: string
  airline?: string
  departureAirport?: string
  arrivalAirport?: string
  // For accommodations
  checkInTime?: string
  checkOutTime?: string
  roomType?: string
  guestCount?: number
  // For restaurants
  reservationTime?: string
  partySize?: number
  // For transport
  transportType?: "bus" | "train" | "subway" | "taxi" | "rental"
  pickupLocation?: Location
  dropoffLocation?: Location
}

export interface ReservationSummary {
  totalReservations: number
  byType: {
    [key in ReservationType]: number
  }
  upcoming: number
  confirmed: number
  pending: number
}

// ============================================
// Schedule (일정) 관련 타입
// ============================================

export interface Schedule {
  id: number
  itineraryId: number
  time: string
  title: string
  location?: string
  activityType?: string
  durationMinutes?: number
  cost?: number
  notes?: string
  displayOrder?: number
}

export interface Itinerary {
  id: number
  tripId: number
  dayNumber: number
  date: string
  activities: Schedule[]
}

export interface Album {
  id: number
  tripId: number
  albumTitle: string
  albumDate: string
  displayOrder?: number
  photos: Photo[]
}

export interface Photo {
  id: number
  albumId: number
  imageUrl: string
  uploadedAt: string
  uploadedBy: {
    userId: number
    userName: string
  }
}

// Settlement 별칭 (SettlementResponse와 동일)
export type Settlement = SettlementResponse

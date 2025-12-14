import type {
  TripMember,
  SharedFundTransaction,
  IndividualExpense,
  DebtSummary,
  Settlement,
  ExpenseStatistics,
} from "@/lib/types"

// 여행 멤버 (현재 로그인 사용자는 userId: 1)
export const tripMembers: TripMember[] = [
  { userId: 1, userName: "김철수", profileImage: "👨" },
  { userId: 2, userName: "이영희", profileImage: "👩" },
  { userId: 3, userName: "박민수", profileImage: "🧑" },
]

// 공동 경비 거래 내역
export const sharedFundTransactions: SharedFundTransaction[] = [
  {
    id: 1,
    tripId: 1,
    type: "DEPOSIT",
    amount: 300000,
    balanceAfter: 300000,
    description: "초기 공동 경비 입금",
    createdAt: "2025-12-10T10:00:00Z",
    createdBy: { userId: 1, userName: "김철수" },
  },
  {
    id: 2,
    tripId: 1,
    type: "EXPENSE",
    amount: 120000,
    balanceAfter: 180000,
    description: "제주공항에서 렌터카 대여",
    category: "교통",
    createdAt: "2025-12-11T14:30:00Z",
    createdBy: { userId: 2, userName: "이영희" },
  },
  {
    id: 3,
    tripId: 1,
    type: "EXPENSE",
    amount: 85000,
    balanceAfter: 95000,
    description: "성산일출봉 입장료 및 주차비",
    category: "관광",
    createdAt: "2025-12-11T16:20:00Z",
    createdBy: { userId: 3, userName: "박민수" },
  },
  {
    id: 4,
    tripId: 1,
    type: "EXPENSE",
    amount: 45000,
    balanceAfter: 50000,
    description: "올레국수 저녁식사",
    category: "식비",
    createdAt: "2025-12-11T18:45:00Z",
    createdBy: { userId: 1, userName: "김철수" },
  },
]

// 개별 경비 내역
export const individualExpenses: IndividualExpense[] = [
  {
    id: 1,
    tripId: 1,
    expenseType: "PERSONAL",
    totalAmount: 15000,
    description: "개인 기념품 구매",
    category: "쇼핑",
    date: "2025-12-11",
    splitMethod: "EQUAL",
    createdBy: { userId: 1, userName: "김철수" },
    participants: [
      {
        userId: 1,
        userName: "김철수",
        shareAmount: 15000,
        paidAmount: 15000,
        owedAmount: 0,
      },
    ],
  },
  {
    id: 2,
    tripId: 1,
    expenseType: "PARTIAL_SHARED",
    totalAmount: 60000,
    description: "한라산 케이블카 (2명)",
    category: "관광",
    date: "2025-12-12",
    splitMethod: "EQUAL",
    createdBy: { userId: 2, userName: "이영희" },
    participants: [
      {
        userId: 1,
        userName: "김철수",
        shareAmount: 30000,
        paidAmount: 0,
        owedAmount: 30000,
      },
      {
        userId: 2,
        userName: "이영희",
        shareAmount: 30000,
        paidAmount: 60000,
        owedAmount: -30000,
      },
    ],
  },
  {
    id: 3,
    tripId: 1,
    expenseType: "PARTIAL_SHARED",
    totalAmount: 90000,
    description: "흑돼지 구이 (3명)",
    category: "식비",
    date: "2025-12-12",
    splitMethod: "EQUAL",
    createdBy: { userId: 3, userName: "박민수" },
    participants: [
      {
        userId: 1,
        userName: "김철수",
        shareAmount: 30000,
        paidAmount: 0,
        owedAmount: 30000,
      },
      {
        userId: 2,
        userName: "이영희",
        shareAmount: 30000,
        paidAmount: 0,
        owedAmount: 30000,
      },
      {
        userId: 3,
        userName: "박민수",
        shareAmount: 30000,
        paidAmount: 90000,
        owedAmount: -60000,
      },
    ],
  },
  {
    id: 4,
    tripId: 1,
    expenseType: "PARTIAL_SHARED",
    totalAmount: 80000,
    description: "카페 및 간식 (2명)",
    category: "식비",
    date: "2025-12-12",
    splitMethod: "CUSTOM",
    createdBy: { userId: 1, userName: "김철수" },
    participants: [
      {
        userId: 1,
        userName: "김철수",
        shareAmount: 30000,
        paidAmount: 80000,
        owedAmount: -50000,
      },
      {
        userId: 3,
        userName: "박민수",
        shareAmount: 50000,
        paidAmount: 0,
        owedAmount: 50000,
      },
    ],
  },
]

// 정산 요약 (현재 사용자 기준)
export const debtSummary: DebtSummary = {
  creditors: [
    { userId: 2, userName: "이영희", amount: 30000 },
    { userId: 3, userName: "박민수", amount: 50000 },
  ],
  debtors: [{ userId: 3, userName: "박민수", amount: 20000 }],
  totalToReceive: 80000,
  totalToPay: 20000,
}

// 정산 내역
export const settlements: Settlement[] = [
  {
    id: 1,
    tripId: 1,
    fromUserId: 2,
    fromUserName: "이영희",
    toUserId: 1,
    toUserName: "김철수",
    amount: 50000,
    status: "APPROVED",
    requestedAt: "2025-12-12T10:00:00Z",
    approvedAt: "2025-12-12T11:30:00Z",
    memo: "한라산 케이블카 비용 정산",
    relatedExpenses: [2],
  },
  {
    id: 2,
    tripId: 1,
    fromUserId: 3,
    fromUserName: "박민수",
    toUserId: 1,
    toUserName: "김철수",
    amount: 30000,
    status: "PENDING",
    requestedAt: "2025-12-12T15:00:00Z",
    memo: "카페 비용 정산 요청",
    relatedExpenses: [4],
  },
]

// 통계 데이터
export const expenseStatistics: ExpenseStatistics = {
  totalExpense: 495000,
  averagePerPerson: 165000,
  categoryBreakdown: [
    { category: "식비", amount: 135000, percentage: 27.3, color: "#ef4444" },
    { category: "교통", amount: 120000, percentage: 24.2, color: "#3b82f6" },
    { category: "숙박", amount: 0, percentage: 0, color: "#8b5cf6" },
    { category: "관광", amount: 145000, percentage: 29.3, color: "#10b981" },
    { category: "쇼핑", amount: 15000, percentage: 3.0, color: "#f59e0b" },
    { category: "기타", amount: 80000, percentage: 16.2, color: "#6b7280" },
  ],
  personalBreakdown: [
    { userId: 1, userName: "김철수", amount: 190000, percentage: 38.4 },
    { userId: 2, userName: "이영희", amount: 150000, percentage: 30.3 },
    { userId: 3, userName: "박민수", amount: 155000, percentage: 31.3 },
  ],
  dailyExpenses: [
    { date: "2025-12-10", amount: 300000 },
    { date: "2025-12-11", amount: 265000 },
    { date: "2025-12-12", amount: 230000 },
    { date: "2025-12-13", amount: 0 },
  ],
}

// 현재 로그인한 사용자 ID
export const currentUserId = 1

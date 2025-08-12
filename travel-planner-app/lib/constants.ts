// 공통 상수 및 설정
export const STATUS_CONFIG = {
  planning: { label: "계획중", color: "bg-yellow-100 text-yellow-800" },
  upcoming: { label: "예정", color: "bg-blue-100 text-blue-800" },
  ongoing: { label: "여행중", color: "bg-green-100 text-green-800" },
  completed: { label: "완료", color: "bg-gray-100 text-gray-800" },
} as const

export const TRIP_TEMPLATES = [
  {
    id: "healing",
    name: "힐링 여행",
    description: "휴식과 재충전을 위한 여행",
    icon: "🌿",
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    id: "food",
    name: "맛집 투어",
    description: "현지 음식을 즐기는 여행",
    icon: "🍽️",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  },
  // ... 더 많은 템플릿
] as const

export const ACTIVITY_TYPE_CONFIG = {
  transport: { icon: "🚗", color: "bg-blue-100 text-blue-800", label: "이동" },
  food: { icon: "🍽️", color: "bg-orange-100 text-orange-800", label: "식사" },
  activity: { icon: "🏃", color: "bg-green-100 text-green-800", label: "활동" },
  accommodation: { icon: "🏨", color: "bg-purple-100 text-purple-800", label: "숙박" },
  rest: { icon: "😴", color: "bg-gray-100 text-gray-800", label: "휴식" },
} as const

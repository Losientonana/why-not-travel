import { Badge } from "@/components/ui/badge"
// 재사용 가능한 여행 카드 컴포넌트
import Link from "next/link"
import { Calendar, MapPin, Users, Camera } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatDate, calculateProgress } from "@/lib/utils"
import type { Trip } from "@/lib/types"

interface TripCardProps {
  trip: Trip
  viewMode?: "grid" | "list"
  showBudget?: boolean
}

export function TripCard({ trip, viewMode = "grid", showBudget = false }: TripCardProps) {
  return (
    <Link href={`/trips/${trip.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md">
        <CardContent className="p-0">
          {viewMode === "grid" ? (
            <>
              <div className="relative">
                <img
                  src={trip.coverImage || "/placeholder.svg"}
                  alt={trip.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <StatusBadge status={trip.status} className="absolute top-3 right-3" />
                {trip.isOwner && <Badge className="absolute top-3 left-3 bg-blue-600 text-white">내 여행</Badge>}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{trip.title}</h3>
                <p className="text-sm text-gray-600 mb-3 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {trip.destination}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(trip.startDate, "ko-KR")}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {trip.participants}
                    </div>
                    <div className="flex items-center">
                      <Camera className="w-3 h-3 mr-1" />
                      {trip.photos}
                    </div>
                  </div>
                </div>
                {showBudget && trip.budget && trip.budget > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>예산 사용</span>
                      <span>{calculateProgress(trip.spent || 0, trip.budget)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{
                          width: `${Math.min(calculateProgress(trip.spent || 0, trip.budget), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            // List view implementation
            <div className="flex items-center p-4 space-x-4">{/* List view content */}</div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plane,
  Hotel,
  MapPin,
  Bus,
  UtensilsCrossed,
  Ticket,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  MapPinned,
} from "lucide-react"
import { reservations, reservationSummary } from "@/lib/mock/reservationMockData"
import type { Reservation, ReservationType } from "@/lib/types"
import { toast } from "sonner"

export default function ReservationTabs() {
  const [selectedType, setSelectedType] = useState<ReservationType | "all">("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filteredReservations =
    selectedType === "all" ? reservations : reservations.filter((r) => r.type === selectedType)

  const getTypeIcon = (type: ReservationType) => {
    const iconClass = "w-5 h-5"
    switch (type) {
      case "flight":
        return <Plane className={iconClass} />
      case "accommodation":
        return <Hotel className={iconClass} />
      case "attraction":
        return <MapPin className={iconClass} />
      case "transport":
        return <Bus className={iconClass} />
      case "restaurant":
        return <UtensilsCrossed className={iconClass} />
      case "activity":
        return <Ticket className={iconClass} />
    }
  }

  const getTypeLabel = (type: ReservationType) => {
    switch (type) {
      case "flight":
        return "항공"
      case "accommodation":
        return "숙소"
      case "attraction":
        return "관광지"
      case "transport":
        return "교통"
      case "restaurant":
        return "레스토랑"
      case "activity":
        return "액티비티"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            예약확정
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            <AlertCircle className="w-3 h-3 mr-1" />
            대기중
          </Badge>
        )
      case "cancelled":
        return <Badge variant="destructive">취소됨</Badge>
    }
  }

  const handleAddReservation = () => {
    setIsAddModalOpen(true)
    toast.success("예약 등록 모달이 곧 추가됩니다")
  }

  const handleViewDetail = (reservation: Reservation) => {
    toast.info(`${reservation.title} 상세 정보`)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">전체 예약</p>
                <p className="text-2xl font-bold">{reservationSummary.totalReservations}</p>
              </div>
              <Ticket className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">예약 확정</p>
                <p className="text-2xl font-bold text-green-600">{reservationSummary.confirmed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">대기중</p>
                <p className="text-2xl font-bold text-yellow-600">{reservationSummary.pending}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">다가오는 예약</p>
                <p className="text-2xl font-bold text-blue-600">{reservationSummary.upcoming}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Type Filter & Add Button */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("all")}
          >
            전체 ({reservationSummary.totalReservations})
          </Button>
          <Button
            variant={selectedType === "flight" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("flight")}
          >
            <Plane className="w-4 h-4 mr-1" />
            항공 ({reservationSummary.byType.flight})
          </Button>
          <Button
            variant={selectedType === "accommodation" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("accommodation")}
          >
            <Hotel className="w-4 h-4 mr-1" />
            숙소 ({reservationSummary.byType.accommodation})
          </Button>
          <Button
            variant={selectedType === "attraction" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("attraction")}
          >
            <MapPin className="w-4 h-4 mr-1" />
            관광 ({reservationSummary.byType.attraction})
          </Button>
          <Button
            variant={selectedType === "transport" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("transport")}
          >
            <Bus className="w-4 h-4 mr-1" />
            교통 ({reservationSummary.byType.transport})
          </Button>
          <Button
            variant={selectedType === "restaurant" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("restaurant")}
          >
            <UtensilsCrossed className="w-4 h-4 mr-1" />
            식당 ({reservationSummary.byType.restaurant})
          </Button>
          <Button
            variant={selectedType === "activity" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("activity")}
          >
            <Ticket className="w-4 h-4 mr-1" />
            체험 ({reservationSummary.byType.activity})
          </Button>
        </div>
        <Button onClick={handleAddReservation} className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          예약 추가
        </Button>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.map((reservation) => (
          <Card key={reservation.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-blue-50 rounded-lg">{getTypeIcon(reservation.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-lg">{reservation.title}</h3>
                      {getStatusBadge(reservation.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{reservation.description}</p>

                    {/* Date & Time Info */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(reservation.startDate).toLocaleDateString("ko-KR")}
                        {reservation.endDate && ` ~ ${new Date(reservation.endDate).toLocaleDateString("ko-KR")}`}
                      </div>
                      {reservation.startTime && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {reservation.startTime}
                          {reservation.endTime && ` - ${reservation.endTime}`}
                        </div>
                      )}
                      {reservation.price && (
                        <div className="flex items-center font-medium text-blue-600">
                          <DollarSign className="w-4 h-4 mr-1" />₩{reservation.price.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Location Info (for Maps API integration) */}
                    {reservation.location && (
                      <div className="flex items-start text-sm text-gray-600 mt-2">
                        <MapPinned className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{reservation.location.address}</span>
                      </div>
                    )}

                    {/* Flight specific info */}
                    {reservation.type === "flight" && reservation.flightNumber && (
                      <div className="flex items-center space-x-4 text-sm mt-2">
                        <Badge variant="outline">
                          {reservation.airline} {reservation.flightNumber}
                        </Badge>
                        <span className="text-gray-600">
                          {reservation.departureAirport} → {reservation.arrivalAirport}
                        </span>
                      </div>
                    )}

                    {/* Accommodation specific info */}
                    {reservation.type === "accommodation" && (
                      <div className="flex items-center space-x-4 text-sm mt-2 text-gray-600">
                        {reservation.roomType && <span>객실: {reservation.roomType}</span>}
                        {reservation.guestCount && <span>인원: {reservation.guestCount}명</span>}
                      </div>
                    )}

                    {/* Transport specific info */}
                    {reservation.type === "transport" && reservation.transportType && (
                      <Badge variant="outline" className="mt-2">
                        {reservation.transportType === "bus" && "버스"}
                        {reservation.transportType === "train" && "기차"}
                        {reservation.transportType === "subway" && "지하철"}
                        {reservation.transportType === "taxi" && "택시"}
                        {reservation.transportType === "rental" && "렌터카"}
                      </Badge>
                    )}

                    {/* Confirmation Number */}
                    {reservation.confirmationNumber && (
                      <div className="text-xs text-gray-500 mt-2">예약번호: {reservation.confirmationNumber}</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetail(reservation)}>
                    상세
                  </Button>
                  {reservation.bookingUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={reservation.bookingUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Notes */}
              {reservation.notes && (
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-gray-700">
                  💡 {reservation.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Ticket className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">아직 등록된 예약이 없습니다</p>
            <Button onClick={handleAddReservation}>
              <Plus className="w-4 h-4 mr-2" />첫 예약 추가하기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  Loader2,
  Trash2,
  Pencil,
} from "lucide-react"
import { getReservations, getReservationSummary, deleteReservation } from "@/lib/api"
import type { Reservation, ReservationType, ReservationSummary } from "@/lib/types"
import { toast } from "sonner"
import ReservationRegistrationModal from "./ReservationRegistrationModal"

interface Props {
  tripId: number
}

const defaultSummary: ReservationSummary = {
  totalReservations: 0,
  byType: {
    flight: 0,
    accommodation: 0,
    attraction: 0,
    transport: 0,
    restaurant: 0,
    activity: 0,
  },
  upcoming: 0,
  confirmed: 0,
  pending: 0,
}

export default function ReservationTabs({ tripId }: Props) {
  const [selectedType, setSelectedType] = useState<ReservationType | "all">("all")
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [reservationSummary, setReservationSummary] = useState<ReservationSummary>(defaultSummary)
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [editReservation, setEditReservation] = useState<Reservation | null>(null)
  const [deleting, setDeleting] = useState(false)

  // 시간 포맷 (초 제거, HH:mm만)
  const formatTime = (time?: string) => {
    if (!time) return null
    // "HH:mm:ss" -> "HH:mm" 또는 이미 "HH:mm"이면 그대로
    return time.substring(0, 5)
  }

  // 예약 데이터 로드
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true)
        const [reservationsData, summaryData] = await Promise.all([
          getReservations(tripId),
          getReservationSummary(tripId),
        ])
        setReservations(reservationsData)
        setReservationSummary(summaryData)
      } catch (error) {
        console.error("예약 데이터 로드 실패:", error)
        toast.error("예약 정보를 불러오는데 실패했습니다")
      } finally {
        setLoading(false)
      }
    }

    if (tripId) {
      fetchReservations()
    }
  }, [tripId])

  // 백엔드에서 대문자로 올 수 있으므로 소문자로 변환
  const normalizeType = (type: string): ReservationType => {
    return type.toLowerCase() as ReservationType
  }

  const filteredReservations =
    selectedType === "all"
      ? reservations
      : reservations.filter((r) => normalizeType(r.type) === selectedType)

  const getTypeIcon = (type: ReservationType | string) => {
    const iconClass = "w-5 h-5"
    const normalizedType = normalizeType(type)
    switch (normalizedType) {
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
      default:
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
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
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
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const refreshReservations = async () => {
    try {
      const [reservationsData, summaryData] = await Promise.all([
        getReservations(tripId),
        getReservationSummary(tripId),
      ])
      setReservations(reservationsData)
      setReservationSummary(summaryData)
    } catch (error) {
      console.error("예약 데이터 새로고침 실패:", error)
    }
  }

  const handleAddReservation = () => {
    setIsAddModalOpen(true)
  }

  const handleViewDetail = (reservation: Reservation) => {
    setSelectedReservation(reservation)
  }

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(null)
    setEditReservation(reservation)
    setIsAddModalOpen(true)
  }

  const handleDelete = async (reservation: Reservation) => {
    if (!confirm(`"${reservation.title}" 예약을 삭제하시겠습니까?`)) return

    setDeleting(true)
    try {
      await deleteReservation(tripId, reservation.id)
      toast.success("예약이 삭제되었습니다")
      setSelectedReservation(null)
      refreshReservations()
    } catch (error: any) {
      console.error("예약 삭제 실패:", error)
      toast.error(error.response?.data?.message || "삭제에 실패했습니다")
    } finally {
      setDeleting(false)
    }
  }

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">예약 정보를 불러오는 중...</span>
      </div>
    )
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
                      <div className="text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(reservation.startDate).toLocaleDateString("ko-KR")}
                          {reservation.endDate && ` ~ ${new Date(reservation.endDate).toLocaleDateString("ko-KR")}`}
                        </div>
                        {reservation.startTime && (
                          <div className="flex items-center mt-1 ml-5">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(reservation.startTime)}
                            {reservation.endTime && ` - ${formatTime(reservation.endTime)}`}
                          </div>
                        )}
                      </div>
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
                    {normalizeType(reservation.type) === "flight" && reservation.flightNumber && (
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
                    {normalizeType(reservation.type) === "accommodation" && (
                      <div className="flex items-center space-x-4 text-sm mt-2 text-gray-600">
                        {reservation.roomType && <span>객실: {reservation.roomType}</span>}
                        {reservation.guestCount && <span>인원: {reservation.guestCount}명</span>}
                      </div>
                    )}

                    {/* Transport specific info */}
                    {normalizeType(reservation.type) === "transport" && reservation.transportType && (
                      <div className="flex items-center space-x-4 text-sm mt-2">
                        <Badge variant="outline">
                          {reservation.transportType.toLowerCase() === "bus" && "버스"}
                          {reservation.transportType.toLowerCase() === "train" && "기차"}
                          {reservation.transportType.toLowerCase() === "subway" && "지하철"}
                          {reservation.transportType.toLowerCase() === "taxi" && "택시"}
                          {reservation.transportType.toLowerCase() === "rental" && "렌터카"}
                        </Badge>
                        {reservation.transportType.toLowerCase() === "train" && reservation.departureStation && reservation.arrivalStation && (
                          <span className="text-gray-600">
                            {reservation.departureStation} → {reservation.arrivalStation}
                          </span>
                        )}
                      </div>
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

      {/* 예약 등록/수정 모달 */}
      <ReservationRegistrationModal
        tripId={tripId}
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open)
          if (!open) setEditReservation(null)
        }}
        onSuccess={refreshReservations}
        reservation={editReservation}
      />

      {/* 예약 상세 모달 */}
      <Dialog open={!!selectedReservation} onOpenChange={(open) => !open && setSelectedReservation(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedReservation && getTypeIcon(selectedReservation.type)}
              {selectedReservation?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              {/* 상태 */}
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedReservation.status)}
              </div>

              {/* 설명 */}
              {selectedReservation.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500">설명</p>
                  <p className="text-sm">{selectedReservation.description}</p>
                </div>
              )}

              {/* 날짜/시간 */}
              <div>
                <p className="text-sm font-medium text-gray-500">날짜</p>
                <p className="text-sm">
                  {new Date(selectedReservation.startDate).toLocaleDateString("ko-KR")}
                  {selectedReservation.endDate && ` ~ ${new Date(selectedReservation.endDate).toLocaleDateString("ko-KR")}`}
                </p>
                {selectedReservation.startTime && (
                  <p className="text-sm text-gray-600 mt-1">
                    {formatTime(selectedReservation.startTime)}
                    {selectedReservation.endTime && ` - ${formatTime(selectedReservation.endTime)}`}
                  </p>
                )}
              </div>

              {/* 가격 */}
              {selectedReservation.price && (
                <div>
                  <p className="text-sm font-medium text-gray-500">가격</p>
                  <p className="text-sm font-bold text-blue-600">₩{selectedReservation.price.toLocaleString()}</p>
                </div>
              )}

              {/* 위치 */}
              {selectedReservation.location && (
                <div>
                  <p className="text-sm font-medium text-gray-500">위치</p>
                  <p className="text-sm">{selectedReservation.location.address}</p>
                </div>
              )}

              {/* 항공 전용 */}
              {normalizeType(selectedReservation.type) === "flight" && (
                <div className="p-3 bg-blue-50 rounded-lg space-y-2">
                  <p className="font-medium text-blue-900">항공편 정보</p>
                  {selectedReservation.airline && <p className="text-sm">항공사: {selectedReservation.airline}</p>}
                  {selectedReservation.flightNumber && <p className="text-sm">편명: {selectedReservation.flightNumber}</p>}
                  {selectedReservation.departureAirport && selectedReservation.arrivalAirport && (
                    <p className="text-sm">경로: {selectedReservation.departureAirport} → {selectedReservation.arrivalAirport}</p>
                  )}
                  {selectedReservation.flightDuration && (
                    <p className="text-sm">비행시간: {Math.floor(selectedReservation.flightDuration / 60)}시간 {selectedReservation.flightDuration % 60}분</p>
                  )}
                  {selectedReservation.checkInDeadline && (
                    <p className="text-sm">수속마감: {formatTime(selectedReservation.checkInDeadline)}</p>
                  )}
                  {selectedReservation.checkedBaggageEnabled && (
                    <p className="text-sm">위탁수화물: {selectedReservation.checkedBaggageWeight || '-'}kg</p>
                  )}
                  {selectedReservation.carryOnBaggageEnabled && (
                    <p className="text-sm">기내수화물: {selectedReservation.carryOnBaggageWeight || '-'}kg</p>
                  )}
                  {selectedReservation.seatAssigned && selectedReservation.seatNumber && (
                    <p className="text-sm">좌석: {selectedReservation.seatNumber}</p>
                  )}
                </div>
              )}

              {/* 숙소 전용 */}
              {normalizeType(selectedReservation.type) === "accommodation" && (
                <div className="p-3 bg-purple-50 rounded-lg space-y-2">
                  <p className="font-medium text-purple-900">숙소 정보</p>
                  {selectedReservation.roomType && <p className="text-sm">객실: {selectedReservation.roomType}</p>}
                  {selectedReservation.guestCount && <p className="text-sm">인원: {selectedReservation.guestCount}명</p>}
                  {selectedReservation.checkInTime && <p className="text-sm">체크인: {formatTime(selectedReservation.checkInTime)}</p>}
                  {selectedReservation.checkOutTime && <p className="text-sm">체크아웃: {formatTime(selectedReservation.checkOutTime)}</p>}
                  {selectedReservation.hotelPhone && <p className="text-sm">전화번호: {selectedReservation.hotelPhone}</p>}
                  {selectedReservation.breakfastIncluded && <p className="text-sm">조식 포함</p>}
                </div>
              )}

              {/* 교통 전용 */}
              {normalizeType(selectedReservation.type) === "transport" && selectedReservation.transportType && (
                <div className="p-3 bg-green-50 rounded-lg space-y-2">
                  <p className="font-medium text-green-900">교통 정보</p>
                  <p className="text-sm">
                    교통수단: {
                      selectedReservation.transportType.toLowerCase() === "bus" ? "버스" :
                      selectedReservation.transportType.toLowerCase() === "train" ? "기차" :
                      selectedReservation.transportType.toLowerCase() === "subway" ? "지하철" :
                      selectedReservation.transportType.toLowerCase() === "taxi" ? "택시" :
                      selectedReservation.transportType.toLowerCase() === "rental" ? "렌터카" : selectedReservation.transportType
                    }
                  </p>
                  {/* 기차 전용 정보 */}
                  {selectedReservation.transportType.toLowerCase() === "train" && (
                    <>
                      {selectedReservation.departureStation && selectedReservation.arrivalStation && (
                        <p className="text-sm">경로: {selectedReservation.departureStation} → {selectedReservation.arrivalStation}</p>
                      )}
                      {selectedReservation.trainDuration && (
                        <p className="text-sm">소요시간: {Math.floor(selectedReservation.trainDuration / 60)}시간 {selectedReservation.trainDuration % 60}분</p>
                      )}
                      {selectedReservation.trainSeatClass && (
                        <p className="text-sm">좌석등급: {selectedReservation.trainSeatClass}</p>
                      )}
                      {selectedReservation.trainSeatNumber && (
                        <p className="text-sm">좌석번호: {selectedReservation.trainSeatNumber}</p>
                      )}
                    </>
                  )}
                  {/* 픽업/드롭오프 위치 */}
                  {selectedReservation.pickupLocation?.address && (
                    <p className="text-sm">픽업: {selectedReservation.pickupLocation.address}</p>
                  )}
                  {selectedReservation.dropoffLocation?.address && (
                    <p className="text-sm">하차: {selectedReservation.dropoffLocation.address}</p>
                  )}
                </div>
              )}

              {/* 식당 전용 */}
              {normalizeType(selectedReservation.type) === "restaurant" && (
                <div className="p-3 bg-orange-50 rounded-lg space-y-2">
                  <p className="font-medium text-orange-900">식당 예약 정보</p>
                  {selectedReservation.reservationTime && <p className="text-sm">예약 시간: {formatTime(selectedReservation.reservationTime)}</p>}
                  {selectedReservation.partySize && <p className="text-sm">인원: {selectedReservation.partySize}명</p>}
                </div>
              )}

              {/* 예약 정보 */}
              {(selectedReservation.confirmationNumber || selectedReservation.bookingPlatform || selectedReservation.bookingUrl) && (
                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <p className="font-medium text-gray-900">예약 정보</p>
                  {selectedReservation.confirmationNumber && <p className="text-sm">예약번호: {selectedReservation.confirmationNumber}</p>}
                  {selectedReservation.bookingPlatform && <p className="text-sm">예약처: {selectedReservation.bookingPlatform}</p>}
                  {selectedReservation.bookingUrl && (
                    <a href={selectedReservation.bookingUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      예약 링크 <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* 메모 */}
              {selectedReservation.notes && (
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <p className="text-sm">💡 {selectedReservation.notes}</p>
                </div>
              )}

              {/* 수정/삭제 버튼 */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEdit(selectedReservation)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  수정
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(selectedReservation)}
                  disabled={deleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleting ? "삭제 중..." : "삭제"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createReservation, updateReservation } from "@/lib/api"
import type { ReservationType, ReservationStatus, Reservation } from "@/lib/types"
import { toast } from "sonner"
import { Plane, Hotel, MapPin, Bus, UtensilsCrossed, Ticket } from "lucide-react"

interface Props {
  tripId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  reservation?: Reservation | null  // 수정 모드일 때
}

export default function ReservationRegistrationModal({ tripId, open, onOpenChange, onSuccess, reservation }: Props) {
  const isEditMode = !!reservation
  const contentRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 공통 필드
  const [type, setType] = useState<ReservationType>("accommodation")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<ReservationStatus>("pending")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [price, setPrice] = useState("")
  const [address, setAddress] = useState("")
  const [confirmationNumber, setConfirmationNumber] = useState("")
  const [bookingPlatform, setBookingPlatform] = useState("")
  const [bookingUrl, setBookingUrl] = useState("")
  const [notes, setNotes] = useState("")

  // 항공 전용
  const [flightNumber, setFlightNumber] = useState("")
  const [airline, setAirline] = useState("")
  const [departureAirport, setDepartureAirport] = useState("")
  const [arrivalAirport, setArrivalAirport] = useState("")

  // 숙박 전용
  const [checkInTime, setCheckInTime] = useState("")
  const [checkOutTime, setCheckOutTime] = useState("")
  const [roomType, setRoomType] = useState("")
  const [guestCount, setGuestCount] = useState("")

  // 식당 전용
  const [reservationTime, setReservationTime] = useState("")
  const [partySize, setPartySize] = useState("")

  // 교통 전용
  const [transportType, setTransportType] = useState<"bus" | "train" | "subway" | "taxi" | "rental">("bus")

  // 수정 모드일 때 초기값 로드
  useEffect(() => {
    if (open && reservation) {
      setType(reservation.type.toLowerCase() as ReservationType)
      setTitle(reservation.title || "")
      setDescription(reservation.description || "")
      setStatus(reservation.status.toLowerCase() as ReservationStatus)
      setStartDate(reservation.startDate || "")
      setEndDate(reservation.endDate || "")
      setStartTime(reservation.startTime?.substring(0, 5) || "")
      setEndTime(reservation.endTime?.substring(0, 5) || "")
      setPrice(reservation.price?.toString() || "")
      setAddress(reservation.location?.address || "")
      setConfirmationNumber(reservation.confirmationNumber || "")
      setBookingPlatform(reservation.bookingPlatform || "")
      setBookingUrl(reservation.bookingUrl || "")
      setNotes(reservation.notes || "")
      // 항공
      setFlightNumber(reservation.flightNumber || "")
      setAirline(reservation.airline || "")
      setDepartureAirport(reservation.departureAirport || "")
      setArrivalAirport(reservation.arrivalAirport || "")
      // 숙박
      setCheckInTime(reservation.checkInTime?.substring(0, 5) || "")
      setCheckOutTime(reservation.checkOutTime?.substring(0, 5) || "")
      setRoomType(reservation.roomType || "")
      setGuestCount(reservation.guestCount?.toString() || "")
      // 식당
      setReservationTime(reservation.reservationTime?.substring(0, 5) || "")
      setPartySize(reservation.partySize?.toString() || "")
      // 교통
      if (reservation.transportType) {
        setTransportType(reservation.transportType.toLowerCase() as any)
      }
    } else if (open && !reservation) {
      resetForm()
    }
  }, [open, reservation])

  const resetForm = () => {
    setType("accommodation")
    setTitle("")
    setDescription("")
    setStatus("pending")
    setStartDate(new Date().toISOString().split("T")[0])
    setEndDate("")
    setStartTime("")
    setEndTime("")
    setPrice("")
    setAddress("")
    setConfirmationNumber("")
    setBookingPlatform("")
    setBookingUrl("")
    setNotes("")
    setFlightNumber("")
    setAirline("")
    setDepartureAirport("")
    setArrivalAirport("")
    setCheckInTime("")
    setCheckOutTime("")
    setRoomType("")
    setGuestCount("")
    setReservationTime("")
    setPartySize("")
    setTransportType("bus")
    setErrorMessage(null)
  }

  const handleSubmit = async () => {
    setErrorMessage(null)

    // 기본 검증
    if (!title.trim()) {
      toast.error("제목을 입력해주세요")
      return
    }
    if (!startDate) {
      toast.error("날짜를 선택해주세요")
      return
    }

    setLoading(true)
    try {
      const data: any = {
        type,
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        startDate,
        endDate: endDate || undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        price: price ? Number(price) : undefined,
        location: address ? { address } : undefined,
        confirmationNumber: confirmationNumber || undefined,
        bookingPlatform: bookingPlatform || undefined,
        bookingUrl: bookingUrl || undefined,
        notes: notes || undefined,
      }

      // 타입별 추가 필드
      if (type === "flight") {
        data.flightNumber = flightNumber || undefined
        data.airline = airline || undefined
        data.departureAirport = departureAirport || undefined
        data.arrivalAirport = arrivalAirport || undefined
      } else if (type === "accommodation") {
        data.checkInTime = checkInTime || undefined
        data.checkOutTime = checkOutTime || undefined
        data.roomType = roomType || undefined
        data.guestCount = guestCount ? Number(guestCount) : undefined
      } else if (type === "restaurant") {
        data.reservationTime = reservationTime || undefined
        data.partySize = partySize ? Number(partySize) : undefined
      } else if (type === "transport") {
        data.transportType = transportType
      }

      if (isEditMode && reservation) {
        await updateReservation(tripId, reservation.id, data)
        toast.success("예약이 수정되었습니다")
      } else {
        await createReservation(tripId, data)
        toast.success("예약이 등록되었습니다")
      }
      onOpenChange(false)
      resetForm()
      onSuccess?.()
    } catch (error: any) {
      console.error(isEditMode ? "예약 수정 실패:" : "예약 등록 실패:", error)
      const message = error.response?.data?.message || error.message || "다시 시도해주세요"
      setErrorMessage(message)
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (t: ReservationType) => {
    const iconClass = "w-4 h-4"
    switch (t) {
      case "flight": return <Plane className={iconClass} />
      case "accommodation": return <Hotel className={iconClass} />
      case "attraction": return <MapPin className={iconClass} />
      case "transport": return <Bus className={iconClass} />
      case "restaurant": return <UtensilsCrossed className={iconClass} />
      case "activity": return <Ticket className={iconClass} />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={contentRef} className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "예약 수정" : "예약 등록"}</DialogTitle>
        </DialogHeader>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <div className="flex-1">
              <p className="font-medium text-sm">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 text-lg leading-none"
            >
              ✕
            </button>
          </div>
        )}

        <div className="space-y-6 py-4">
          {/* 예약 유형 */}
          <div className="space-y-2">
            <Label>예약 유형</Label>
            <Select value={type} onValueChange={(v) => setType(v as ReservationType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">
                  <div className="flex items-center gap-2"><Plane className="w-4 h-4" /> 항공</div>
                </SelectItem>
                <SelectItem value="accommodation">
                  <div className="flex items-center gap-2"><Hotel className="w-4 h-4" /> 숙소</div>
                </SelectItem>
                <SelectItem value="attraction">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 관광지</div>
                </SelectItem>
                <SelectItem value="transport">
                  <div className="flex items-center gap-2"><Bus className="w-4 h-4" /> 교통</div>
                </SelectItem>
                <SelectItem value="restaurant">
                  <div className="flex items-center gap-2"><UtensilsCrossed className="w-4 h-4" /> 식당</div>
                </SelectItem>
                <SelectItem value="activity">
                  <div className="flex items-center gap-2"><Ticket className="w-4 h-4" /> 액티비티</div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <Label>제목 *</Label>
            <Input
              placeholder="예: 인천-오사카 왕복 항공권"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <Label>설명</Label>
            <Textarea
              placeholder="예약에 대한 설명을 입력하세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* 상태 */}
          <div className="space-y-2">
            <Label>예약 상태</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ReservationStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">예약 확정</SelectItem>
                <SelectItem value="pending">대기중</SelectItem>
                <SelectItem value="cancelled">취소됨</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>시작 날짜 *</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>종료 날짜</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* 시간 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>시작 시간</Label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>종료 시간</Label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          {/* 가격 */}
          <div className="space-y-2">
            <Label>가격 (원)</Label>
            <Input
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* 주소 */}
          <div className="space-y-2">
            <Label>주소/위치</Label>
            <Input
              placeholder="예: 오사카시 중앙구..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* 항공 전용 필드 */}
          {type === "flight" && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">항공편 정보</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>항공사</Label>
                  <Input placeholder="대한항공" value={airline} onChange={(e) => setAirline(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>편명</Label>
                  <Input placeholder="KE123" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>출발 공항</Label>
                  <Input placeholder="ICN" value={departureAirport} onChange={(e) => setDepartureAirport(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>도착 공항</Label>
                  <Input placeholder="KIX" value={arrivalAirport} onChange={(e) => setArrivalAirport(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* 숙박 전용 필드 */}
          {type === "accommodation" && (
            <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">숙소 정보</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>체크인 시간</Label>
                  <Input type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>체크아웃 시간</Label>
                  <Input type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>객실 타입</Label>
                  <Input placeholder="더블룸" value={roomType} onChange={(e) => setRoomType(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>인원수</Label>
                  <Input type="number" placeholder="2" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* 식당 전용 필드 */}
          {type === "restaurant" && (
            <div className="space-y-4 p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900">식당 예약 정보</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>예약 시간</Label>
                  <Input type="time" value={reservationTime} onChange={(e) => setReservationTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>인원수</Label>
                  <Input type="number" placeholder="4" value={partySize} onChange={(e) => setPartySize(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* 교통 전용 필드 */}
          {type === "transport" && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">교통 정보</h4>
              <div className="space-y-2">
                <Label>교통 수단</Label>
                <Select value={transportType} onValueChange={(v) => setTransportType(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bus">버스</SelectItem>
                    <SelectItem value="train">기차</SelectItem>
                    <SelectItem value="subway">지하철</SelectItem>
                    <SelectItem value="taxi">택시</SelectItem>
                    <SelectItem value="rental">렌터카</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* 예약 정보 */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">예약 정보</h4>
            <div className="space-y-2">
              <Label>예약 번호</Label>
              <Input
                placeholder="ABC123456"
                value={confirmationNumber}
                onChange={(e) => setConfirmationNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>예약 플랫폼</Label>
              <Input
                placeholder="Booking.com, 야놀자 등"
                value={bookingPlatform}
                onChange={(e) => setBookingPlatform(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>예약 링크</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={bookingUrl}
                onChange={(e) => setBookingUrl(e.target.value)}
              />
            </div>
          </div>

          {/* 메모 */}
          <div className="space-y-2">
            <Label>메모</Label>
            <Textarea
              placeholder="추가 메모사항을 입력하세요"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (isEditMode ? "수정 중..." : "등록 중...") : (isEditMode ? "수정" : "등록")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

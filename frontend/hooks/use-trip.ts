"use client"

// 여행 데이터 관리 커스텀 훅
import { useState, useEffect } from "react"
import { getTripDetail } from "@/lib/mock-data"
import type { Trip } from "@/lib/types"

export function useTrip(id: string) {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrip = async () => {
    try {
      setLoading(true)
      // 실제 구현에서는 API 호출
      const tripData = getTripDetail(id)
      setTrip(tripData as Trip)
    } catch (err) {
      setError("여행 정보를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchTrip()
    }
  }, [id])

  return { trip, loading, error, refetch: fetchTrip }
}

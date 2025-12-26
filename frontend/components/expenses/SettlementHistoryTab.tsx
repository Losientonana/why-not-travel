"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Loader2, TrendingDown, TrendingUp, Lightbulb, Check, X } from "lucide-react"
import { BalanceSummaryResponse, SettlementListResponse, SettlementResponse } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { getBalanceSummary, getSettlements, createSettlement, approveSettlement, rejectSettlement } from "@/lib/api"

interface SettlementHistoryTabProps {
  tripId: number
}

type SettlementStatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED"

export default function SettlementHistoryTab({ tripId }: SettlementHistoryTabProps) {
  const { user } = useAuth()
  const [summary, setSummary] = useState<BalanceSummaryResponse | null>(null)
  const [settlements, setSettlements] = useState<SettlementResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<SettlementStatusFilter>("ALL")
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [tripId, statusFilter])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [summaryData, settlementsData] = await Promise.all([
        getBalanceSummary(tripId),
        getSettlements(tripId, statusFilter === "ALL" ? undefined : statusFilter as any)
      ])
      setSummary(summaryData)
      setSettlements(settlementsData.settlements || [])
    } catch (err: any) {
      console.error("정산 데이터 조회 실패:", err)
      setError(err.response?.data?.message || err.message || "데이터를 불러오는데 실패했습니다")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSettlement = async (fromUserId: number, toUserId: number, amount: number) => {
    if (!user) return

    try {
      setActionLoading(fromUserId + toUserId)
      await createSettlement(tripId, { fromUserId, toUserId, amount })
      await fetchData()
    } catch (err: any) {
      console.error("정산 생성 실패:", err)
      alert(err.response?.data?.message || "정산 생성에 실패했습니다")
    } finally {
      setActionLoading(null)
    }
  }

  const handleApprove = async (settlementId: number) => {
    try {
      setActionLoading(settlementId)
      await approveSettlement(tripId, settlementId)
      await fetchData()
    } catch (err: any) {
      console.error("정산 승인 실패:", err)
      alert(err.response?.data?.message || "정산 승인에 실패했습니다")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (settlementId: number) => {
    const reason = prompt("거절 사유를 입력해주세요 (선택사항)")
    try {
      setActionLoading(settlementId)
      await rejectSettlement(tripId, settlementId, reason || undefined)
      await fetchData()
    } catch (err: any) {
      console.error("정산 거절 실패:", err)
      alert(err.response?.data?.message || "정산 거절에 실패했습니다")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-red-500">
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!summary) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* 상태 필터 */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">정산 내역</h3>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SettlementStatusFilter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체</SelectItem>
            <SelectItem value="PENDING">대기중</SelectItem>
            <SelectItem value="APPROVED">승인됨</SelectItem>
            <SelectItem value="REJECTED">거절됨</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 내 요약 */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">💰 내 정산 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600">받을 돈</p>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {summary.totalToReceive.toLocaleString()}
                <span className="text-base ml-1">원</span>
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <p className="text-sm text-gray-600">줄 돈</p>
              </div>
              <p className="text-3xl font-bold text-red-600">
                {summary.totalToPay.toLocaleString()}
                <span className="text-base ml-1">원</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 그리디 알고리즘 최적 정산 가이드 */}
      {summary.optimalPlan.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <CardTitle className="text-lg">최적 정산 가이드</CardTitle>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              복잡한 빚 관계를 최소한의 거래로 정산하는 방법입니다
            </p>
            {settlements.some(s => s.status === "PENDING") && (
              <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">
                  ⚠️ 대기중인 정산이 있습니다
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  모든 정산이 승인/거절 처리될 때까지 새로운 지출을 추가하지 마세요. 지출이 추가되면 정산 계획이 변경될 수 있습니다.
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.optimalPlan.map((plan, idx) => {
                const isMyTransaction =
                  plan.senderId === user?.id || plan.receiverId === user?.id
                const isMySending = plan.senderId === user?.id
                const isMyReceiving = plan.receiverId === user?.id

                // 이미 PENDING 정산이 있는지 확인 (경로 + 금액 일치)
                const hasPendingSettlement = settlements.some(s =>
                  s.status === "PENDING" &&
                  s.fromUserId === plan.senderId &&
                  s.toUserId === plan.receiverId &&
                  s.amount === plan.amount
                )

                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-lg p-4 border-l-4 ${
                      isMyTransaction
                        ? isMySending
                          ? "border-red-500"
                          : "border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${
                              isMySending ? "bg-red-100" : "bg-gray-100"
                            }`}
                          >
                            <span className="text-lg font-semibold">
                              {plan.senderName[0]}
                            </span>
                          </div>
                          <p
                            className={`text-xs ${
                              isMySending ? "font-bold text-red-700" : "text-gray-600"
                            }`}
                          >
                            {plan.senderName}
                          </p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                        <div className="text-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${
                              isMyReceiving ? "bg-green-100" : "bg-gray-100"
                            }`}
                          >
                            <span className="text-lg font-semibold">
                              {plan.receiverName[0]}
                            </span>
                          </div>
                          <p
                            className={`text-xs ${
                              isMyReceiving ? "font-bold text-green-700" : "text-gray-600"
                            }`}
                          >
                            {plan.receiverName}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p
                          className={`text-2xl font-bold ${
                            isMyTransaction
                              ? isMySending
                                ? "text-red-600"
                                : "text-green-600"
                              : "text-gray-700"
                          }`}
                        >
                          {plan.amount.toLocaleString()}
                          <span className="text-sm ml-1">원</span>
                        </p>
                        {isMyTransaction && (
                          <div className="flex gap-2">
                            {isMySending && (
                              <Button
                                size="sm"
                                variant="outline"
                                className={hasPendingSettlement
                                  ? "text-yellow-600 border-yellow-300 bg-yellow-50 cursor-not-allowed"
                                  : "text-red-600 border-red-300 hover:bg-red-50"
                                }
                                onClick={() => !hasPendingSettlement && handleCreateSettlement(plan.senderId, plan.receiverId, plan.amount)}
                                disabled={actionLoading === plan.senderId + plan.receiverId || hasPendingSettlement}
                              >
                                {actionLoading === plan.senderId + plan.receiverId ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : hasPendingSettlement ? (
                                  "대기중"
                                ) : (
                                  "돈 줬어요"
                                )}
                              </Button>
                            )}
                            {isMyReceiving && (
                              <Button
                                size="sm"
                                variant="outline"
                                className={hasPendingSettlement
                                  ? "text-yellow-600 border-yellow-300 bg-yellow-50 cursor-not-allowed"
                                  : "text-green-600 border-green-300 hover:bg-green-50"
                                }
                                onClick={() => !hasPendingSettlement && handleCreateSettlement(plan.senderId, plan.receiverId, plan.amount)}
                                disabled={actionLoading === plan.senderId + plan.receiverId || hasPendingSettlement}
                              >
                                {actionLoading === plan.senderId + plan.receiverId ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : hasPendingSettlement ? (
                                  "대기중"
                                ) : (
                                  "돈 받았어요"
                                )}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {summary.optimalPlan.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">정산할 내역이 없습니다</p>
            <p className="text-sm mt-2">모든 정산이 완료되었습니다! 🎉</p>
          </CardContent>
        </Card>
      )}

      {/* 정산 내역 리스트 */}
      {settlements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {statusFilter === "ALL" ? "모든 정산 내역" :
               statusFilter === "PENDING" ? "대기중인 정산" :
               statusFilter === "APPROVED" ? "승인된 정산" : "거절된 정산"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {settlements.map((settlement) => {
                const isCreditor = settlement.toUserId === user?.id
                const isDebtor = settlement.fromUserId === user?.id
                const canApprove = isCreditor && settlement.status === "PENDING"
                const canReject = isCreditor && settlement.status === "PENDING"

                return (
                  <div
                    key={settlement.id}
                    className={`p-4 rounded-lg border ${
                      settlement.status === "PENDING" ? "bg-yellow-50 border-yellow-200" :
                      settlement.status === "APPROVED" ? "bg-green-50 border-green-200" :
                      "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{settlement.fromUserName}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">{settlement.toUserName}</span>
                          <Badge className={
                            settlement.status === "PENDING" ? "bg-yellow-500" :
                            settlement.status === "APPROVED" ? "bg-green-500" : "bg-red-500"
                          }>
                            {settlement.status === "PENDING" ? "대기중" :
                             settlement.status === "APPROVED" ? "승인됨" : "거절됨"}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {settlement.amount.toLocaleString()}원
                        </p>
                        {settlement.memo && (
                          <p className="text-sm text-gray-600 mt-1">{settlement.memo}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          신청: {settlement.requestedByName} • {new Date(settlement.createdAt).toLocaleDateString()}
                        </p>
                        {settlement.completedAt && (
                          <p className="text-xs text-gray-500">
                            완료: {new Date(settlement.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {(canApprove || canReject) && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-300 hover:bg-green-50"
                            onClick={() => handleApprove(settlement.id)}
                            disabled={actionLoading === settlement.id}
                          >
                            {actionLoading === settlement.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                승인
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => handleReject(settlement.id)}
                            disabled={actionLoading === settlement.id}
                          >
                            {actionLoading === settlement.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-1" />
                                거절
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {settlements.length === 0 && statusFilter !== "ALL" && (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <p className="text-lg font-medium">해당 상태의 정산 내역이 없습니다</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

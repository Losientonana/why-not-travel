"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Plus } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import ExpenseRegistrationModal from "./ExpenseRegistrationModal"
import ExpenseDetailModal from "./ExpenseDetailModal"
import type { IndividualExpense } from "@/lib/types"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  getAllIndividualExpenses,
  getPersonalExpenses,
  getSharedExpenses,
  getToReceive,
  getToPay,
} from "@/lib/api"

export default function IndividualExpenseTab() {
  const params = useParams()
  const tripId = Number(params.id)
  const { user } = useAuth()

  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<IndividualExpense | null>(null)
  const [filter, setFilter] = useState<"all" | "personal" | "shared">("all")
  const [showReceiveDetails, setShowReceiveDetails] = useState(false)
  const [showPayDetails, setShowPayDetails] = useState(false)

  const [expenses, setExpenses] = useState<IndividualExpense[]>([])
  const [toReceiveExpenses, setToReceiveExpenses] = useState<IndividualExpense[]>([])
  const [toPayExpenses, setToPayExpenses] = useState<IndividualExpense[]>([])
  const [loading, setLoading] = useState(true)

  // 데이터 새로고침
  const fetchData = async () => {
    try {
      setLoading(true)

      // 필터에 따라 적절한 API 호출
      let expensesData: IndividualExpense[]
      if (filter === "all") {
        expensesData = await getAllIndividualExpenses(tripId)
      } else if (filter === "personal") {
        expensesData = await getPersonalExpenses(tripId)
      } else {
        expensesData = await getSharedExpenses(tripId)
      }

      // 정산 요약 데이터
      const toReceiveData = await getToReceive(tripId)
      const toPayData = await getToPay(tripId)

      setExpenses(expensesData)
      setToReceiveExpenses(toReceiveData)
      setToPayExpenses(toPayData)
    } catch (error) {
      console.error("개별정산 데이터 로드 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  // 초기 데이터 로드
  useEffect(() => {
    if (tripId) {
      fetchData()
    }
  }, [tripId, filter])

  // 정산 요약 계산
  const totalToReceive = toReceiveExpenses.reduce((sum, expense) => {
    const myParticipation = expense.participants.find((p) => p.userId === user?.id)
    return sum + (myParticipation?.owedAmount || 0)
  }, 0)

  const totalToPay = toPayExpenses.reduce((sum, expense) => {
    const myParticipation = expense.participants.find((p) => p.userId === user?.id)
    return sum + Math.abs(myParticipation?.owedAmount || 0)
  }, 0)

  // 받을 돈 상세 (사람별 집계)
  const creditorsSummary = toReceiveExpenses.reduce((acc, expense) => {
    expense.participants.forEach((p) => {
      if (p.owedAmount < 0 && p.userId !== user?.id) {
        // 이 사람이 나에게 줘야 하는 돈
        const existing = acc.find((c) => c.userId === p.userId)
        if (existing) {
          existing.amount += Math.abs(p.owedAmount)
        } else {
          acc.push({
            userId: p.userId,
            userName: p.userName,
            amount: Math.abs(p.owedAmount),
          })
        }
      }
    })
    return acc
  }, [] as Array<{ userId: number; userName: string; amount: number }>)

  // 줄 돈 상세 (사람별 집계)
  const debtorsSummary = toPayExpenses.reduce((acc, expense) => {
    expense.participants.forEach((p) => {
      if (p.owedAmount > 0 && p.userId !== user?.id) {
        // 내가 이 사람에게 줘야 하는 돈
        const myParticipation = expense.participants.find((pp) => pp.userId === user?.id)
        if (myParticipation && myParticipation.owedAmount < 0) {
          const existing = acc.find((d) => d.userId === p.userId)
          const amountOwed = Math.abs(myParticipation.owedAmount)
          if (existing) {
            existing.amount += amountOwed
          } else {
            acc.push({
              userId: p.userId,
              userName: p.userName,
              amount: amountOwed,
            })
          }
        }
      }
    })
    return acc
  }, [] as Array<{ userId: number; userName: string; amount: number }>)

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "식비":
        return "🍴"
      case "교통":
        return "🚗"
      case "숙박":
        return "🏨"
      case "관광":
        return "🎡"
      case "쇼핑":
        return "🛍️"
      default:
        return "📝"
    }
  }

  const handleExpenseClick = (expense: IndividualExpense) => {
    setSelectedExpense(expense)
    setShowDetailModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">개별정산 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Settlement Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* To Receive */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-800">내가 받을 돈</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReceiveDetails(!showReceiveDetails)}
                className="text-green-700 hover:text-green-900"
              >
                {showReceiveDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-3xl font-bold text-green-700">+{totalToReceive.toLocaleString()}원</p>
            {showReceiveDetails && creditorsSummary.length > 0 && (
              <div className="mt-4 space-y-2 pt-4 border-t border-green-300">
                {creditorsSummary.map((creditor) => (
                  <div key={creditor.userId} className="flex justify-between items-center">
                    <span className="text-sm text-green-800">{creditor.userName}</span>
                    <span className="text-sm font-semibold text-green-700">+{creditor.amount.toLocaleString()}원</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* To Pay */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-800">내가 줄 돈</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPayDetails(!showPayDetails)}
                className="text-red-700 hover:text-red-900"
              >
                {showPayDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-3xl font-bold text-red-700">-{totalToPay.toLocaleString()}원</p>
            {showPayDetails && debtorsSummary.length > 0 && (
              <div className="mt-4 space-y-2 pt-4 border-t border-red-300">
                {debtorsSummary.map((debtor) => (
                  <div key={debtor.userId} className="flex justify-between items-center">
                    <span className="text-sm text-red-800">{debtor.userName}</span>
                    <span className="text-sm font-semibold text-red-700">-{debtor.amount.toLocaleString()}원</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="flex-1"
        >
          전체
        </Button>
        <Button
          variant={filter === "personal" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("personal")}
          className="flex-1"
        >
          개인지출
        </Button>
        <Button
          variant={filter === "shared" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("shared")}
          className="flex-1"
        >
          공유지출
        </Button>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {expenses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <p>아직 지출 내역이 없습니다.</p>
              <p className="text-sm mt-2">지출 등록 버튼을 눌러 추가해보세요.</p>
            </CardContent>
          </Card>
        ) : (
          expenses.map((expense) => {
            const myParticipation = expense.participants.find((p) => p.userId === user?.id)
            return (
              <Card
                key={expense.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleExpenseClick(expense)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <span className="text-2xl">{getCategoryEmoji(expense.category)}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{expense.description}</h4>
                          <Badge
                            variant={expense.expenseType === "PERSONAL" ? "secondary" : "default"}
                            className="text-xs"
                          >
                            {expense.expenseType === "PERSONAL" ? "나만" : `${expense.participants.length}명`}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{expense.category}</span>
                          <span>·</span>
                          <span>{format(new Date(expense.date), "yyyy년 MM월 dd일", { locale: ko })}</span>
                          <span>·</span>
                          <span>{expense.createdBy.userName}</span>
                        </div>
                        {myParticipation && expense.expenseType === "PARTIAL_SHARED" && (
                          <p className="text-sm text-blue-600 mt-1 font-medium">
                            내 분담액: {myParticipation.shareAmount.toLocaleString()}원
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{expense.totalAmount.toLocaleString()}원</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* FAB Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button size="lg" className="rounded-full shadow-lg h-14 px-6" onClick={() => setShowRegistrationModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          지출 등록
        </Button>
      </div>

      <ExpenseRegistrationModal
        open={showRegistrationModal}
        onOpenChange={setShowRegistrationModal}
        onSuccess={fetchData}
      />
      {selectedExpense && (
        <ExpenseDetailModal open={showDetailModal} onOpenChange={setShowDetailModal} expense={selectedExpense} />
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
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
} from "@/lib/api"

export default function IndividualExpenseTab() {
  const params = useParams()
  const tripId = Number(params.id)
  const { user } = useAuth()

  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<IndividualExpense | null>(null)
  const [filter, setFilter] = useState<"all" | "personal" | "shared">("all")

  const [expenses, setExpenses] = useState<IndividualExpense[]>([])
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

      setExpenses(expensesData)
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

  // 지불자 목록 가져오기 (paidAmount > 0인 사람들)
  const getPayers = (expense: IndividualExpense) => {
    const payers = expense.participants.filter((p) => p.paidAmount > 0)
    if (payers.length === 0) return "없음"
    if (payers.length === 1) return payers[0].userName
    return `${payers[0].userName} 외 ${payers.length - 1}명`
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
    <div className="space-y-6">
      {/* Action Button at Top */}
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setShowRegistrationModal(true)}>
          <Plus className="w-4 h-4 mr-1" />
          지출 등록
        </Button>
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
                          <span>{getPayers(expense)}</span>
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


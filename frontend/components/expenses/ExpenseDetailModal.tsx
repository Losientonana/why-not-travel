"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { IndividualExpense } from "@/lib/types"
import { currentUserId } from "@/lib/mock/expenseMockData"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense: IndividualExpense
}

export default function ExpenseDetailModal({ open, onOpenChange, expense }: Props) {
  const { toast } = useToast()
  const isMyExpense = expense.createdBy.userId === currentUserId

  // 지불자 목록 가져오기
  const getPayers = () => {
    const payers = expense.participants.filter((p) => p.paidAmount > 0)
    if (payers.length === 0) return "없음"
    return payers.map((p) => p.userName).join(", ")
  }

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

  const handleEdit = () => {
    toast({ title: "수정 기능은 개발 중입니다" })
  }

  const handleDelete = () => {
    toast({ title: "삭제되었습니다" })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>지출 상세</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getCategoryEmoji(expense.category)}</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{expense.description}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={expense.expenseType === "PERSONAL" ? "secondary" : "default"}>
                    {expense.expenseType === "PERSONAL" ? "개인 지출" : "공유 지출"}
                  </Badge>
                  <Badge variant="outline">{expense.category}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">날짜</p>
                <p className="font-medium">{format(new Date(expense.date), "yyyy년 MM월 dd일", { locale: ko })}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">지불자</p>
                <p className="font-medium">{getPayers()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">총 금액</p>
                <p className="font-bold text-xl">{expense.totalAmount.toLocaleString()}원</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">분담 방식</p>
                <p className="font-medium">{expense.splitMethod === "EQUAL" ? "균등 분할" : "직접 입력"}</p>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="space-y-3">
            <h4 className="font-semibold">참여자별 분담 내역</h4>
            <div className="space-y-2">
              {expense.participants.map((participant) => (
                <div key={participant.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{participant.userName}</span>
                  <div className="text-right">
                    <p className="font-semibold">{participant.shareAmount.toLocaleString()}원</p>
                    <p className="text-xs text-gray-600">
                      {participant.paidAmount > 0 && `지불: ${participant.paidAmount.toLocaleString()}원`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt */}
          {expense.receiptUrl && (
            <div className="space-y-2">
              <h4 className="font-semibold">영수증</h4>
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">영수증 이미지</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {isMyExpense ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                닫기
              </Button>
              <Button variant="outline" onClick={handleEdit}>
                수정
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                삭제
              </Button>
            </>
          ) : (
            <Button onClick={() => onOpenChange(false)}>닫기</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

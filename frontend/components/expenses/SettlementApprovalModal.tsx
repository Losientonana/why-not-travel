"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Settlement } from "@/lib/types"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight } from "lucide-react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  settlement: Settlement
}

export default function SettlementApprovalModal({ open, onOpenChange, settlement }: Props) {
  const { toast } = useToast()

  const handleApprove = () => {
    toast({ title: "정산이 승인되었습니다", description: "정산이 완료되었습니다" })
    onOpenChange(false)
  }

  const handleReject = () => {
    toast({ title: "정산이 거절되었습니다", variant: "destructive" })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>정산 요청 확인</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">{settlement.fromUserName[0]}</span>
              </div>
              <p className="font-medium">{settlement.fromUserName}</p>
            </div>
            <ArrowRight className="w-8 h-8 text-gray-400" />
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">{settlement.toUserName[0]}</span>
              </div>
              <p className="font-medium">{settlement.toUserName}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">정산 금액</p>
            <p className="text-3xl font-bold text-blue-600">{settlement.amount.toLocaleString()}원</p>
          </div>

          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">요청 일시</span>
              <span className="text-sm font-medium">
                {format(new Date(settlement.requestedAt), "yyyy년 MM월 dd일 HH:mm", { locale: ko })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">상태</span>
              <Badge variant="secondary">{settlement.status === "PENDING" ? "대기중" : "완료"}</Badge>
            </div>
          </div>

          {settlement.memo && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">메모</h4>
              <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">{settlement.memo}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={handleReject}>
            거절
          </Button>
          <Button className="flex-1" onClick={handleApprove}>
            승인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

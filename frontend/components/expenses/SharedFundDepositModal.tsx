"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { tripMembers } from "@/lib/mock/expenseMockData"
import { useToast } from "@/hooks/use-toast"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SharedFundDepositModal({ open, onOpenChange }: Props) {
  const { toast } = useToast()
  const [amountPerPerson, setAmountPerPerson] = useState("")
  const [memo, setMemo] = useState("")

  const totalAmount = amountPerPerson ? Number.parseFloat(amountPerPerson) * tripMembers.length : 0

  const handleSubmit = () => {
    if (!amountPerPerson || Number.parseFloat(amountPerPerson) <= 0) {
      toast({ title: "1인당 금액을 입력해주세요", variant: "destructive" })
      return
    }

    toast({ title: "공동 경비가 입금되었습니다" })
    onOpenChange(false)
    setAmountPerPerson("")
    setMemo("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>공동 경비 입금</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>1인당 입금액</Label>
            <Input
              type="number"
              placeholder="금액 입력"
              value={amountPerPerson}
              onChange={(e) => setAmountPerPerson(e.target.value)}
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">참여 인원</span>
              <span className="font-semibold">{tripMembers.length}명</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
              <span className="text-sm font-medium">총 입금액</span>
              <span className="text-xl font-bold text-blue-600">{totalAmount.toLocaleString()}원</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>메모 (선택)</Label>
            <Textarea placeholder="입금 관련 메모" value={memo} onChange={(e) => setMemo(e.target.value)} rows={3} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit}>입금</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tripMembers, currentUserId } from "@/lib/mock/expenseMockData"
import { useToast } from "@/hooks/use-toast"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SettlementRequestModal({ open, onOpenChange }: Props) {
  const { toast } = useToast()
  const [selectedUserId, setSelectedUserId] = useState("")
  const [amount, setAmount] = useState("")
  const [memo, setMemo] = useState("")

  const otherMembers = tripMembers.filter((m) => m.userId !== currentUserId)

  const handleSubmit = () => {
    if (!selectedUserId) {
      toast({ title: "정산 상대방을 선택해주세요", variant: "destructive" })
      return
    }
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({ title: "금액을 입력해주세요", variant: "destructive" })
      return
    }

    toast({ title: "정산 요청이 전송되었습니다" })
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setSelectedUserId("")
    setAmount("")
    setMemo("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>정산 요청</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>정산 상대방</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="상대방 선택" />
              </SelectTrigger>
              <SelectContent>
                {otherMembers.map((member) => (
                  <SelectItem key={member.userId} value={member.userId.toString()}>
                    {member.profileImage} {member.userName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>정산 금액</Label>
            <Input type="number" placeholder="금액 입력" value={amount} onChange={(e) => setAmount(e.target.value)} />
            {amount && <p className="text-sm text-gray-600">{Number.parseFloat(amount).toLocaleString()}원</p>}
          </div>

          <div className="space-y-2">
            <Label>메모 (선택)</Label>
            <Textarea placeholder="정산 관련 메모" value={memo} onChange={(e) => setMemo(e.target.value)} rows={3} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit}>요청</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

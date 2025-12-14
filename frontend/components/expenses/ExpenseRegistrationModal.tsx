"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { tripMembers } from "@/lib/mock/expenseMockData"
import { useToast } from "@/hooks/use-toast"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ExpenseRegistrationModal({ open, onOpenChange }: Props) {
  const { toast } = useToast()
  const [expenseMode, setExpenseMode] = useState<"shared" | "individual">("shared")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>(tripMembers.map((m) => m.userId))
  const [splitMethod, setSplitMethod] = useState<"equal" | "custom">("equal")
  const [customAmounts, setCustomAmounts] = useState<Record<number, string>>({})

  const handleParticipantToggle = (userId: number) => {
    setSelectedParticipants((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSubmit = () => {
    // Validation
    if (!category) {
      toast({ title: "카테고리를 선택해주세요", variant: "destructive" })
      return
    }
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({ title: "금액을 입력해주세요", variant: "destructive" })
      return
    }
    if (expenseMode === "shared" && selectedParticipants.length < 2) {
      toast({ title: "공동 지출은 최소 2명 이상이어야 합니다", variant: "destructive" })
      return
    }
    if (expenseMode === "shared" && splitMethod === "custom") {
      const total = selectedParticipants.reduce((sum, userId) => {
        return sum + (Number.parseFloat(customAmounts[userId]) || 0)
      }, 0)
      if (Math.abs(total - Number.parseFloat(amount)) > 0.01) {
        toast({ title: "분담 금액의 합계가 총 금액과 일치하지 않습니다", variant: "destructive" })
        return
      }
    }

    toast({ title: "지출이 등록되었습니다" })
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setExpenseMode("shared")
    setDate(new Date().toISOString().split("T")[0])
    setCategory("")
    setAmount("")
    setDescription("")
    setSelectedParticipants(tripMembers.map((m) => m.userId))
    setSplitMethod("equal")
    setCustomAmounts({})
  }

  const perPersonAmount =
    expenseMode === "shared" && selectedParticipants.length > 0 && amount
      ? (Number.parseFloat(amount) / selectedParticipants.length).toFixed(0)
      : "0"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>지출 등록</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Toggle: 공동 / 개별 */}
          <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
            <Button
              variant={expenseMode === "shared" ? "default" : "ghost"}
              className="flex-1"
              onClick={() => setExpenseMode("shared")}
            >
              공동
            </Button>
            <Button
              variant={expenseMode === "individual" ? "default" : "ghost"}
              className="flex-1"
              onClick={() => setExpenseMode("individual")}
            >
              개별
            </Button>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>날짜</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>카테고리</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="식비">🍴 식비</SelectItem>
                <SelectItem value="교통">🚗 교통</SelectItem>
                <SelectItem value="숙박">🏨 숙박</SelectItem>
                <SelectItem value="관광">🎡 관광</SelectItem>
                <SelectItem value="쇼핑">🛍️ 쇼핑</SelectItem>
                <SelectItem value="기타">📝 기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>금액</Label>
            <Input type="number" placeholder="금액 입력" value={amount} onChange={(e) => setAmount(e.target.value)} />
            {amount && <p className="text-sm text-gray-600">{Number.parseFloat(amount).toLocaleString()}원</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>설명</Label>
            <Textarea
              placeholder="지출 내용을 입력하세요 (최대 200자)"
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500 text-right">{description.length}/200</p>
          </div>

          {/* Conditional: Shared Mode */}
          {expenseMode === "shared" && (
            <>
              {/* Participants */}
              <div className="space-y-3">
                <Label>참여자 선택 (최소 2명)</Label>
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                  {tripMembers.map((member) => (
                    <div key={member.userId} className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedParticipants.includes(member.userId)}
                        onCheckedChange={() => handleParticipantToggle(member.userId)}
                      />
                      <span className="text-lg">{member.profileImage}</span>
                      <span>{member.userName}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">선택된 인원: {selectedParticipants.length}명</p>
              </div>

              {/* Split Method */}
              <div className="space-y-3">
                <Label>분담 방식</Label>
                <RadioGroup value={splitMethod} onValueChange={(v) => setSplitMethod(v as "equal" | "custom")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="equal" id="equal" />
                    <Label htmlFor="equal" className="font-normal cursor-pointer">
                      균등 분할 (1/n)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="font-normal cursor-pointer">
                      금액 직접 입력
                    </Label>
                  </div>
                </RadioGroup>

                {/* Equal Split Display */}
                {splitMethod === "equal" && selectedParticipants.length > 0 && amount && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      1인당 금액:{" "}
                      <span className="font-bold text-lg">{Number.parseFloat(perPersonAmount).toLocaleString()}원</span>
                    </p>
                  </div>
                )}

                {/* Custom Split Input */}
                {splitMethod === "custom" && selectedParticipants.length > 0 && (
                  <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                    {selectedParticipants.map((userId) => {
                      const member = tripMembers.find((m) => m.userId === userId)!
                      return (
                        <div key={userId} className="flex items-center space-x-3">
                          <span className="text-lg">{member.profileImage}</span>
                          <span className="w-20">{member.userName}</span>
                          <Input
                            type="number"
                            placeholder="금액"
                            value={customAmounts[userId] || ""}
                            onChange={(e) => setCustomAmounts((prev) => ({ ...prev, [userId]: e.target.value }))}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-600">원</span>
                        </div>
                      )
                    })}
                    <div className="pt-2 border-t mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">합계</span>
                        <span className="font-bold">
                          {selectedParticipants
                            .reduce((sum, userId) => sum + (Number.parseFloat(customAmounts[userId]) || 0), 0)
                            .toLocaleString()}
                          원
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                        <span>총 금액</span>
                        <span>{amount ? Number.parseFloat(amount).toLocaleString() : 0}원</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit}>등록</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

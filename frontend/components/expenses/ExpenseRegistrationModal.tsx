"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useParams } from "next/navigation"
import { createPersonalExpense, createSharedExpense } from "@/lib/api"
import { getTripDetail } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { CurrencySettings } from "@/lib/types"
import { hasForeignCurrency, convertToKRW, convertFromKRW } from "@/lib/currency"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  currencySettings?: CurrencySettings | null
}

export default function ExpenseRegistrationModal({ open, onOpenChange, onSuccess, currencySettings }: Props) {
  const { toast } = useToast()
  const params = useParams()
  const tripId = Number(params.id)
  const { user } = useAuth()

  const [tripMembers, setTripMembers] = useState<Array<{ userId: number; userName: string }>>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [expenseMode, setExpenseMode] = useState<"shared" | "individual">("shared")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [foreignAmount, setForeignAmount] = useState("")
  const [description, setDescription] = useState("")
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([])
  const [payerId, setPayerId] = useState<number | null>(null)
  const [splitMethod, setSplitMethod] = useState<"equal" | "custom">("equal")
  const [customAmounts, setCustomAmounts] = useState<Record<number, string>>({})

  const hasForeign = hasForeignCurrency(currencySettings)

  // 외화 입력 시 원화 자동 계산
  const handleForeignAmountChange = (value: string) => {
    setForeignAmount(value)
    if (value && currencySettings?.exchangeRate) {
      const krwAmount = convertToKRW(Number(value), currencySettings.exchangeRate)
      setAmount(String(krwAmount))
    } else if (!value) {
      setAmount("")
    }
  }

  // 원화 입력 시 외화 자동 계산
  const handleAmountChange = (value: string) => {
    setAmount(value)
    if (hasForeign && value && currencySettings?.exchangeRate) {
      const foreignAmt = convertFromKRW(Number(value), currencySettings.exchangeRate)
      setForeignAmount(String(foreignAmt))
    } else if (!value) {
      setForeignAmount("")
    }
  }

  // 여행 참여자 목록 불러오기
  useEffect(() => {
    const fetchTripMembers = async () => {
      try {
        const tripDetail = await getTripDetail(tripId)
        console.log("여행 상세:", tripDetail)
        const members = tripDetail.participants.map((p: any) => ({
          userId: p.userId,
          userName: p.userName,
        }))
        setTripMembers(members)
        setSelectedParticipants(members.map((m: any) => m.userId))

        // 지불자 초기값을 현재 로그인한 유저로 설정
        if (user?.id) {
          setPayerId(user.id)
        }
      } catch (error) {
        console.error("참여자 목록 로드 실패:", error)
      }
    }

    if (open && tripId) {
      fetchTripMembers()
    }
  }, [open, tripId, user?.id])

  const handleParticipantToggle = (userId: number) => {
    setSelectedParticipants((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSubmit = async () => {
    setErrorMessage(null) // 에러 초기화

    // Validation
    if (!category) {
      toast({ title: "카테고리를 선택해주세요", variant: "destructive" })
      return
    }
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({ title: "금액을 입력해주세요", variant: "destructive" })
      return
    }
    if (!description.trim()) {
      toast({ title: "설명을 입력해주세요", variant: "destructive" })
      return
    }
    if (expenseMode === "shared" && selectedParticipants.length < 2) {
      toast({ title: "공동 지출은 최소 2명 이상이어야 합니다", variant: "destructive" })
      return
    }
    if (expenseMode === "shared" && !payerId) {
      toast({ title: "지불자를 선택해주세요", variant: "destructive" })
      return
    }
    if (expenseMode === "shared" && payerId && !selectedParticipants.includes(payerId)) {
      toast({ title: "지불자는 참여자 중에서 선택해야 합니다", variant: "destructive" })
      return
    }
    // 프론트 검증 비활성화 - 백엔드 예외처리 테스트용
    // if (expenseMode === "shared" && splitMethod === "custom") {
    //   const total = selectedParticipants.reduce((sum, userId) => {
    //     return sum + (Number.parseFloat(customAmounts[userId]) || 0)
    //   }, 0)
    //   if (Math.abs(total - Number.parseFloat(amount)) > 0.01) {
    //     toast({ title: "분담 금액의 합계가 총 금액과 일치하지 않습니다", variant: "destructive" })
    //     return
    //   }
    // }

    setLoading(true)
    try {
      if (expenseMode === "individual") {
        // 개인지출 등록
        await createPersonalExpense(tripId, {
          date,
          category,
          amount: Number.parseFloat(amount),
          foreignCurrencyAmount: foreignAmount ? Number.parseFloat(foreignAmount) : undefined,
          description,
        })
      } else {
        // 공유지출 등록
        const totalAmount = Number.parseFloat(amount)
        const participantCount = selectedParticipants.length

        const participants = selectedParticipants.map((userId, index) => {
          let shareAmount

          if (splitMethod === "equal") {
            // 균등 분할: 나머지를 첫 번째 사람에게 몰아주기
            const baseAmount = Math.floor(totalAmount / participantCount)
            const remainder = totalAmount - (baseAmount * participantCount)
            shareAmount = index === 0 ? baseAmount + remainder : baseAmount
          } else {
            shareAmount = Number.parseFloat(customAmounts[userId] || "0")
          }

          // 선택된 지불자가 전액 지불한 것으로 설정
          const paidAmount = userId === payerId ? totalAmount : 0

          return {
            userId,
            shareAmount,
            paidAmount,
          }
        })

        await createSharedExpense(tripId, {
          date,
          category,
          amount: Number.parseFloat(amount),
          foreignCurrencyAmount: foreignAmount ? Number.parseFloat(foreignAmount) : undefined,
          description,
          splitMethod: splitMethod === "equal" ? "EQUAL" : "CUSTOM",
          participants,
        })
      }

      toast({ title: "지출이 등록되었습니다" })
      onOpenChange(false)
      resetForm()
      onSuccess?.()
    } catch (error: any) {
      console.error("지출 등록 실패:", error)
      const message = error.response?.data?.message || error.message || "다시 시도해주세요"
      setErrorMessage(message)
      // 스크롤 최상단으로 이동
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setExpenseMode("shared")
    setDate(new Date().toISOString().split("T")[0])
    setCategory("")
    setAmount("")
    setForeignAmount("")
    setDescription("")
    setSplitMethod("equal")
    setCustomAmounts({})
    setErrorMessage(null)
    if (user?.id) {
      setPayerId(user.id)
    }
  }

  const perPersonAmount =
    expenseMode === "shared" && selectedParticipants.length > 0 && amount
      ? (Number.parseFloat(amount) / selectedParticipants.length).toFixed(0)
      : "0"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={contentRef} className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>지출 등록</DialogTitle>
        </DialogHeader>

        {/* 에러 메시지 배너 */}
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

          {/* Foreign Amount (if enabled) */}
          {hasForeign && (
            <div className="space-y-2">
              <Label>금액 ({currencySettings?.currencySymbol})</Label>
              <Input
                type="number"
                placeholder={`${currencySettings?.currencySymbol} 금액 입력`}
                value={foreignAmount}
                onChange={(e) => handleForeignAmountChange(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                환율: 1{currencySettings?.currencySymbol} = {currencySettings?.exchangeRate}원
              </p>
            </div>
          )}

          {/* Amount (KRW) */}
          <div className="space-y-2">
            <Label>금액 (원화)</Label>
            <Input
              type="number"
              placeholder="금액 입력"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
            {amount && (
              <p className="text-sm text-gray-600">
                {Number.parseFloat(amount).toLocaleString()}원
                {hasForeign && foreignAmount && (
                  <span className="text-gray-500"> ({currencySettings?.currencySymbol}{Number.parseFloat(foreignAmount).toLocaleString()})</span>
                )}
              </p>
            )}
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
                      <span>{member.userName}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">선택된 인원: {selectedParticipants.length}명</p>
              </div>

              {/* Payer Selection */}
              <div className="space-y-2">
                <Label>지불자 선택</Label>
                <Select value={payerId?.toString() || ""} onValueChange={(v) => setPayerId(Number(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="지불자를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {tripMembers.map((member) => (
                      <SelectItem key={member.userId} value={member.userId.toString()}>
                        {member.userName}
                        {member.userId === user?.id && " (나)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">실제로 돈을 지불한 사람을 선택해주세요</p>
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
                      const member = tripMembers.find((m) => m.userId === userId)
                      if (!member) return null
                      return (
                        <div key={userId} className="flex items-center space-x-3">
                          <span className="w-24">{member.userName}</span>
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "등록 중..." : "등록"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

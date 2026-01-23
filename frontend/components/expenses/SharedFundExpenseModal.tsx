"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { expenseSharedFund } from "@/lib/api"
import { useParams } from "next/navigation"
import { CurrencySettings } from "@/lib/types"
import { hasForeignCurrency, convertToKRW, convertFromKRW } from "@/lib/currency"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentBalance?: number
  onSuccess?: () => void
  currencySettings?: CurrencySettings | null
}

export default function SharedFundExpenseModal({ open, onOpenChange, currentBalance = 0, onSuccess, currencySettings }: Props) {
  const { toast } = useToast()
  const params = useParams()
  const tripId = Number(params.id)

  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [foreignAmount, setForeignAmount] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

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

  const estimatedBalance = amount ? currentBalance - Number.parseFloat(amount) : currentBalance
  const isInsufficientBalance = estimatedBalance < 0

  const handleSubmit = async () => {
    if (!category) {
      toast({ title: "카테고리를 선택해주세요", variant: "destructive" })
      return
    }
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({ title: "금액을 입력해주세요", variant: "destructive" })
      return
    }
    if (!description) {
      toast({ title: "설명을 입력해주세요", variant: "destructive" })
      return
    }
    if (isInsufficientBalance) {
      toast({ title: "잔액이 부족합니다", variant: "destructive" })
      return
    }

    try {
      setLoading(true)
      await expenseSharedFund(tripId, {
        date,
        category,
        amount: Number.parseFloat(amount),
        foreignCurrencyAmount: foreignAmount ? Number.parseFloat(foreignAmount) : undefined,
        description
      })

      toast({ title: "공동 경비가 사용되었습니다" })
      onOpenChange(false)
      resetForm()

      // 성공 시 부모 컴포넌트에 알림
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("지출 실패:", error)
      toast({
        title: "지출 실패",
        description: error.response?.data?.message || "다시 시도해주세요",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setDate(new Date().toISOString().split("T")[0])
    setCategory("")
    setAmount("")
    setForeignAmount("")
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>공동 경비 지출</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">현재 잔액</span>
              <span className="text-lg font-bold text-blue-600">{currentBalance.toLocaleString()}원</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>날짜</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

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

          {/* 외화 입력 (설정된 경우) */}
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

          <div className="space-y-2">
            <Label>금액 (원화)</Label>
            <Input
              type="number"
              placeholder="금액 입력"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>설명</Label>
            <Textarea
              placeholder="지출 내용을 입력하세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {amount && (
            <div className={`p-4 rounded-lg ${isInsufficientBalance ? "bg-red-50" : "bg-green-50"}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">사용 후 예상 잔액</span>
                <span className={`text-lg font-bold ${isInsufficientBalance ? "text-red-600" : "text-green-600"}`}>
                  {estimatedBalance.toLocaleString()}원
                </span>
              </div>
              {isInsufficientBalance && (
                <div className="flex items-center space-x-2 mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">잔액이 부족합니다</span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isInsufficientBalance || loading}>
            {loading ? "처리 중..." : "사용"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

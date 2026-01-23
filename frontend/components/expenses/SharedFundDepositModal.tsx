"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { depositSharedFund } from "@/lib/api"
import { useParams } from "next/navigation"
import { CurrencySettings } from "@/lib/types"
import { hasForeignCurrency, convertToKRW, convertFromKRW } from "@/lib/currency"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void  // 성공 시 데이터 새로고침용 콜백
  participantCount?: number  // 참여 인원 (백엔드에서 계산하지만 UI 표시용)
  currencySettings?: CurrencySettings | null
}

export default function SharedFundDepositModal({ open, onOpenChange, onSuccess, participantCount = 1, currencySettings }: Props) {
  const { toast } = useToast()
  const params = useParams()
  const tripId = Number(params.id)

  const [amountPerPerson, setAmountPerPerson] = useState("")
  const [foreignAmountPerPerson, setForeignAmountPerPerson] = useState("")
  const [memo, setMemo] = useState("")
  const [loading, setLoading] = useState(false)

  const hasForeign = hasForeignCurrency(currencySettings)

  // 외화 입력 시 원화 자동 계산
  const handleForeignAmountChange = (value: string) => {
    setForeignAmountPerPerson(value)
    if (value && currencySettings?.exchangeRate) {
      const krwAmount = convertToKRW(Number(value), currencySettings.exchangeRate)
      setAmountPerPerson(String(krwAmount))
    } else if (!value) {
      setAmountPerPerson("")
    }
  }

  // 원화 입력 시 외화 자동 계산
  const handleAmountChange = (value: string) => {
    setAmountPerPerson(value)
    if (hasForeign && value && currencySettings?.exchangeRate) {
      const foreignAmt = convertFromKRW(Number(value), currencySettings.exchangeRate)
      setForeignAmountPerPerson(String(foreignAmt))
    } else if (!value) {
      setForeignAmountPerPerson("")
    }
  }

  const totalAmount = amountPerPerson ? Number.parseFloat(amountPerPerson) * participantCount : 0
  const totalForeignAmount = foreignAmountPerPerson ? Number.parseFloat(foreignAmountPerPerson) * participantCount : 0

  const handleSubmit = async () => {
    if (!amountPerPerson || Number.parseFloat(amountPerPerson) <= 0) {
      toast({ title: "1인당 금액을 입력해주세요", variant: "destructive" })
      return
    }

    try {
      setLoading(true)
      await depositSharedFund(tripId, {
        amountPerPerson: Number.parseFloat(amountPerPerson),
        foreignCurrencyAmountPerPerson: foreignAmountPerPerson ? Number.parseFloat(foreignAmountPerPerson) : undefined,
        description: memo || undefined
      })

      toast({ title: "공동 경비가 입금되었습니다" })
      onOpenChange(false)
      setAmountPerPerson("")
      setForeignAmountPerPerson("")
      setMemo("")

      // 성공 시 부모 컴포넌트에 알림 (데이터 새로고침용)
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("입금 실패:", error)
      toast({
        title: "입금 실패",
        description: error.response?.data?.message || "다시 시도해주세요",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>공동 경비 입금</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 외화 입력 (설정된 경우) */}
          {hasForeign && (
            <div className="space-y-2">
              <Label>1인당 입금액 ({currencySettings?.currencySymbol})</Label>
              <Input
                type="number"
                placeholder={`${currencySettings?.currencySymbol} 금액 입력`}
                value={foreignAmountPerPerson}
                onChange={(e) => handleForeignAmountChange(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                환율: 1{currencySettings?.currencySymbol} = {currencySettings?.exchangeRate}원
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>1인당 입금액 (원화){hasForeign ? "" : ""}</Label>
            <Input
              type="number"
              placeholder="금액 입력"
              value={amountPerPerson}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">참여 인원</span>
              <span className="font-semibold">{participantCount}명</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
              <span className="text-sm font-medium">총 입금액</span>
              <div className="text-right">
                <span className="text-xl font-bold text-blue-600">{totalAmount.toLocaleString()}원</span>
                {hasForeign && totalForeignAmount > 0 && (
                  <p className="text-sm text-gray-600">({currencySettings?.currencySymbol}{totalForeignAmount.toLocaleString()})</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>메모 (선택)</Label>
            <Textarea placeholder="입금 관련 메모" value={memo} onChange={(e) => setMemo(e.target.value)} rows={3} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "입금 중..." : "입금"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

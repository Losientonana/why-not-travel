"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Check, X } from "lucide-react"
import { getCurrencySettings, updateCurrencySettings } from "@/lib/api"
import type { CurrencySettings } from "@/lib/types"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { DEFAULT_JPY_RATE, CURRENCY_SYMBOLS, CURRENCY_NAMES } from "@/lib/currency"

interface Props {
  onSettingsChange?: (settings: CurrencySettings | null) => void
}

export default function CurrencySettingsCard({ onSettingsChange }: Props) {
  const params = useParams()
  const tripId = Number(params.id)

  const [settings, setSettings] = useState<CurrencySettings | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<string>("")
  const [exchangeRate, setExchangeRate] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getCurrencySettings(tripId)
        setSettings(data)
        if (data?.foreignCurrency) {
          setSelectedCurrency(data.foreignCurrency)
          setExchangeRate(String(data.exchangeRate || ""))
        }
        onSettingsChange?.(data)
      } catch (error) {
        // 설정이 없는 경우 무시
      }
    }

    if (tripId) {
      fetchSettings()
    }
  }, [tripId])

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value)
    // 기본 환율 설정
    if (value === "JPY") {
      setExchangeRate(String(DEFAULT_JPY_RATE))
    } else if (value === "USD") {
      setExchangeRate("1350") // 기본 달러 환율
    } else if (value === "none") {
      setExchangeRate("")
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const data = await updateCurrencySettings(tripId, {
        foreignCurrency: selectedCurrency === "none" ? null : selectedCurrency,
        exchangeRate: selectedCurrency === "none" ? null : Number(exchangeRate),
      })
      setSettings(data)
      onSettingsChange?.(data)
      setIsEditing(false)
      toast.success("외화 설정이 저장되었습니다")
    } catch (error) {
      toast.error("설정 저장에 실패했습니다")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (settings?.foreignCurrency) {
      setSelectedCurrency(settings.foreignCurrency)
      setExchangeRate(String(settings.exchangeRate || ""))
    } else {
      setSelectedCurrency("")
      setExchangeRate("")
    }
  }

  if (!isEditing && !settings?.foreignCurrency) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-4">
          <Button
            variant="ghost"
            className="w-full text-gray-600"
            onClick={() => setIsEditing(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            외화 설정 (해외여행 시)
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={isEditing ? "border-blue-300" : ""}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-semibold">외화 설정</Label>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={handleCancel} disabled={loading}>
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleSave} disabled={loading}>
                  <Check className="w-4 h-4 mr-1" />
                  저장
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>통화</Label>
                <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="통화 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">원화만 사용</SelectItem>
                    <SelectItem value="JPY">¥ 일본 엔 (JPY)</SelectItem>
                    <SelectItem value="USD">$ 미국 달러 (USD)</SelectItem>
                    <SelectItem value="EUR">€ 유로 (EUR)</SelectItem>
                    <SelectItem value="CNY">¥ 중국 위안 (CNY)</SelectItem>
                    <SelectItem value="THB">฿ 태국 바트 (THB)</SelectItem>
                    <SelectItem value="VND">₫ 베트남 동 (VND)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedCurrency && selectedCurrency !== "none" && (
                <div className="space-y-2">
                  <Label>환율 (1{CURRENCY_SYMBOLS[selectedCurrency]} = ?원)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(e.target.value)}
                    placeholder="예: 9.3"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">외화 설정</p>
              <p className="font-semibold">
                {settings?.currencySymbol} {CURRENCY_NAMES[settings?.foreignCurrency || ""] || settings?.foreignCurrency}
                <span className="text-gray-500 font-normal ml-2">
                  (1{settings?.currencySymbol} = {settings?.exchangeRate}원)
                </span>
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Settings className="w-4 h-4 mr-1" />
              변경
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

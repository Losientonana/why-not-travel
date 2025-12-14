"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle } from "lucide-react"
import { settlements } from "@/lib/mock/expenseMockData"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

export default function SettlementHistoryTab() {
  const approvedSettlements = settlements.filter((s) => s.status === "APPROVED")

  return (
    <div className="space-y-4">
      {approvedSettlements.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>아직 완료된 정산 내역이 없습니다.</p>
          </CardContent>
        </Card>
      ) : (
        approvedSettlements.map((settlement) => (
          <Card key={settlement.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-green-100 text-green-800">완료</Badge>
                <span className="text-sm text-gray-600">
                  {format(new Date(settlement.approvedAt!), "yyyy년 MM월 dd일 HH:mm", { locale: ko })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                      <span className="text-lg">{settlement.fromUserName[0]}</span>
                    </div>
                    <p className="text-xs text-gray-600">{settlement.fromUserName}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-1">
                      <span className="text-lg">{settlement.toUserName[0]}</span>
                    </div>
                    <p className="text-xs text-gray-600">{settlement.toUserName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{settlement.amount.toLocaleString()}원</p>
                </div>
              </div>
              {settlement.memo && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600">{settlement.memo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

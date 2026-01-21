"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDownCircle, ArrowUpCircle, Plus, Wallet } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import SharedFundDepositModal from "./SharedFundDepositModal"
import SharedFundExpenseModal from "./SharedFundExpenseModal"
import { getSharedFund, getSharedFundTransactions } from "@/lib/api"
import { SharedFund, SharedFundTransaction } from "@/lib/types"
import { useParams } from "next/navigation"

export default function SharedFundTab() {
    const params = useParams()
    const tripId = Number(params.id)

    const [showDepositModal, setShowDepositModal] = useState(false)
    const [showExpenseModal, setShowExpenseModal] = useState(false)
    const [sharedFund, setSharedFund] = useState<SharedFund | null>(null)
    const [transactions, setTransactions] = useState<SharedFundTransaction[]>([])
    const [loading, setLoading] = useState(true)
    const [participantCount, setParticipantCount] = useState(1) // TODO: 실제 참여자 수 API에서 가져오기

    const refreshData = async () => {
        try {
            const [fundData, transactionsData] = await Promise.all([
                getSharedFund(tripId),
                getSharedFundTransactions(tripId)
            ])
            setSharedFund(fundData)
            setTransactions(transactionsData)
        } catch (error) {
            console.error("공동 경비 데이터 새로고침 실패:", error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                await refreshData()
            } catch (error) {
                console.error("공동 경비 데이터 로딩 실패:", error)
            } finally {
                setLoading(false)
            }
        }

        if (tripId) {
            fetchData()
        }
    }, [tripId])

    const currentBalance = sharedFund?.currentBalance || 0

    const getCategoryEmoji = (category?: string) => {
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">공동 경비 불러오는 중...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-24">
            {/* Current Balance Card */}
            <Card className="bg-gradient-to-br from-blue-500 to-[#ea580c] text-white">
            <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm mb-1">현재 공동 경비 잔액</p>
                            <p className="text-3xl font-bold">{currentBalance.toLocaleString()}원</p>
                        </div>
                        <Wallet className="w-12 h-12 text-blue-200" />
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowDepositModal(true)}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    입금 추가
                </Button>

                <Button
                    className="flex-1 h-12 bg-red-600 hover:bg-red-700"
                    onClick={() => setShowExpenseModal(true)}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    지출 추가
                </Button>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
                {transactions.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-gray-500">
                            <p>아직 거래 내역이 없습니다.</p>
                            <p className="text-sm mt-2">입금 또는 지출을 추가해보세요.</p>
                        </CardContent>
                    </Card>
                ) : (
                    transactions.map((transaction) => (
                        <Card
                            key={transaction.id}
                            className={`hover:shadow-md transition-shadow ${
                                transaction.type === "DEPOSIT"
                                    ? "border-l-4 border-l-blue-500"
                                    : "border-l-4 border-l-red-500"
                            }`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                transaction.type === "DEPOSIT" ? "bg-blue-100" : "bg-red-100"
                                            }`}
                                        >
                                            {transaction.type === "DEPOSIT" ? (
                                                <ArrowDownCircle className="w-5 h-5 text-blue-600" />
                                            ) : (
                                                <ArrowUpCircle className="w-5 h-5 text-red-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                {transaction.category && (
                                                    <span className="text-lg">{getCategoryEmoji(transaction.category)}</span>
                                                )}
                                                <h4 className="font-semibold">{transaction.description}</h4>
                                            </div>
                                            {transaction.category && (
                                                <Badge variant="outline" className="text-xs mb-2">
                                                    {transaction.category}
                                                </Badge>
                                            )}
                                            <p className="text-sm text-gray-600">
                                                {transaction.createdBy.userName} ·{" "}
                                                {format(new Date(transaction.createdAt), "yyyy년 MM월 dd일 HH:mm", {
                                                    locale: ko
                                                })}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                거래 후 잔액: {transaction.balanceAfter.toLocaleString()}원
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`text-xl font-bold ${
                                                transaction.type === "DEPOSIT" ? "text-blue-600" : "text-red-600"
                                            }`}
                                        >
                                            {transaction.type === "DEPOSIT" ? "+" : "-"}
                                            {transaction.amount.toLocaleString()}원
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Modals */}
            <SharedFundDepositModal
                open={showDepositModal}
                onOpenChange={setShowDepositModal}
                participantCount={participantCount}
                onSuccess={refreshData}
            />

            <SharedFundExpenseModal
                open={showExpenseModal}
                onOpenChange={setShowExpenseModal}
                currentBalance={currentBalance}
                onSuccess={refreshData}
            />
        </div>
    )
}

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { ExpenseStatistics } from "@/lib/types"
import { getExpenseStatistics } from "@/lib/api"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts"

export default function StatisticsTab() {
  const params = useParams()
  const tripId = Number(params.id)

  const [statistics, setStatistics] = useState<ExpenseStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true)
        const data = await getExpenseStatistics(tripId)
        setStatistics(data)
      } catch (err: any) {
        console.error("통계 조회 실패:", err)
        setError(err.response?.data?.message || err.message || "통계를 불러오는데 실패했습니다")
      } finally {
        setLoading(false)
      }
    }

    if (tripId) {
      fetchStatistics()
    }
  }, [tripId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-red-500">
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!statistics) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-1">내 총 지출액</p>
            <p className="text-3xl font-bold text-blue-600">
              {statistics.myTotalExpense.toLocaleString()}원
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-1">1인당 평균 지출액</p>
            <p className="text-3xl font-bold text-green-600">
              {statistics.averagePerPerson.toLocaleString()}원
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown - Pie Chart */}
      {statistics.categoryBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>카테고리별 지출 (나 기준)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statistics.categoryBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ category, percentage }) => `${category} ${percentage.toFixed(1)}%`}
                >
                  {statistics.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value.toLocaleString()}원`}
                  contentStyle={{ backgroundColor: "white", border: "1px solid #ccc", borderRadius: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {statistics.categoryBreakdown.map((category) => (
                <div key={category.category} className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }} />
                  <span className="text-sm">{category.category}</span>
                  <span className="text-sm font-semibold ml-auto">{category.amount.toLocaleString()}원</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {statistics.categoryBreakdown.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <p>카테고리별 지출 데이터가 없습니다</p>
          </CardContent>
        </Card>
      )}

      {/* Personal Breakdown - Bar Chart */}
      {statistics.personalBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>개인별 지출 (모든 멤버)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statistics.personalBreakdown}>
                <XAxis dataKey="userName" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `${value.toLocaleString()}원`}
                  contentStyle={{ backgroundColor: "white", border: "1px solid #ccc", borderRadius: "8px" }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {statistics.personalBreakdown.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <p>개인별 지출 데이터가 없습니다</p>
          </CardContent>
        </Card>
      )}

      {/* Daily Expenses - Line Chart */}
      {statistics.dailyExpenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>일별 지출 추이 (나 기준)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statistics.dailyExpenses}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `${value.toLocaleString()}원`}
                  contentStyle={{ backgroundColor: "white", border: "1px solid #ccc", borderRadius: "8px" }}
                />
                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {statistics.dailyExpenses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <p>일별 지출 데이터가 없습니다</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

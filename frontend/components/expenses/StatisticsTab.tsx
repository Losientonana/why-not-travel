"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { expenseStatistics } from "@/lib/mock/expenseMockData"
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
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-1">총 지출액</p>
            <p className="text-3xl font-bold text-blue-600">{expenseStatistics.totalExpense.toLocaleString()}원</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-1">1인당 평균 지출액</p>
            <p className="text-3xl font-bold text-green-600">{expenseStatistics.averagePerPerson.toLocaleString()}원</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown - Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>카테고리별 지출</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseStatistics.categoryBreakdown}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, percentage }) => `${category} ${percentage.toFixed(1)}%`}
              >
                {expenseStatistics.categoryBreakdown.map((entry, index) => (
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
            {expenseStatistics.categoryBreakdown.map((category) => (
              <div key={category.category} className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }} />
                <span className="text-sm">{category.category}</span>
                <span className="text-sm font-semibold ml-auto">{category.amount.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Breakdown - Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>개인별 지출</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseStatistics.personalBreakdown}>
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

      {/* Daily Expenses - Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>일별 지출 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={expenseStatistics.dailyExpenses}>
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
    </div>
  )
}

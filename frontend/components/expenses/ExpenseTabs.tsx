"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SharedFundTab from "./SharedFundTab"
import IndividualExpenseTab from "./IndividualExpenseTab"
import SettlementHistoryTab from "./SettlementHistoryTab"
import StatisticsTab from "./StatisticsTab"

export default function ExpenseTabs() {
  const [activeTab, setActiveTab] = useState("shared")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">경비 관리</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="shared">공동 경비</TabsTrigger>
          <TabsTrigger value="individual">개별 정산</TabsTrigger>
          <TabsTrigger value="history">정산 내역</TabsTrigger>
          <TabsTrigger value="statistics">통계</TabsTrigger>
        </TabsList>

        <TabsContent value="shared" className="mt-6">
          <SharedFundTab />
        </TabsContent>

        <TabsContent value="individual" className="mt-6">
          <IndividualExpenseTab />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <SettlementHistoryTab />
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <StatisticsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

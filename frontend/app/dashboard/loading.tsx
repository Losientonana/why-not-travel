import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-32 h-6" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="w-16 h-8" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <Skeleton className="w-32 h-8 mb-2" />
            <Skeleton className="w-48 h-4" />
          </div>
          <Skeleton className="w-40 h-10 mt-4 md:mt-0" />
        </div>

        {/* Search and Filters Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="flex-1 h-10" />
          <div className="flex items-center space-x-2">
            <Skeleton className="w-20 h-10" />
            <Skeleton className="w-20 h-10" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-6">
          <Skeleton className="w-80 h-10 mb-6" />

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-0">
                  <Skeleton className="w-full h-48 rounded-t-lg" />
                  <div className="p-4">
                    <Skeleton className="w-3/4 h-5 mb-2" />
                    <Skeleton className="w-1/2 h-4 mb-3" />
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-16 h-3" />
                      <Skeleton className="w-8 h-3" />
                      <Skeleton className="w-8 h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

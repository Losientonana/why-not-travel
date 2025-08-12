import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white font-bold text-2xl">T</span>
        </div>
        <Skeleton className="w-32 h-6 mx-auto mb-2" />
        <Skeleton className="w-48 h-4 mx-auto" />
      </div>
    </div>
  )
}

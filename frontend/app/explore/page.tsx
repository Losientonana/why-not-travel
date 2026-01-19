import { Construction } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
            <Construction className="w-10 h-10 text-amber-600" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            준비중인 서비스입니다
          </h1>
          <p className="text-gray-600">
            더 나은 여행 경험을 위해 열심히 준비하고 있습니다.
            <br />
            조금만 기다려주세요!
          </p>
        </div>

        <div className="pt-6">
          <Button asChild size="lg">
            <Link href="/">메인으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await login(formData);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message || "로그인에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            홈으로 돌아가기
          </Link>
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <CardTitle className="text-2xl font-bold">TravelMate 로그인</CardTitle>
          <p className="text-gray-600 mt-2">여행의 모든 순간을 함께 기록하세요</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Login */}
          <div className="space-y-3">
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`} className="block w-full" passHref>
              <Button variant="outline" className="w-full bg-transparent" size="lg">
                <img src="/placeholder.svg?height=20&width=20&text=G" alt="Google" className="w-5 h-5 mr-3" />
                Google로 계속하기
              </Button>
            </Link>
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/naver`} className="block w-full" passHref>
              <Button variant="outline" className="w-full bg-transparent" size="lg">
                <img src="/placeholder.svg?height=20&width=20&text=N" alt="Naver" className="w-5 h-5 mr-3" />
                네이버로 계속하기
              </Button>
            </Link>
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao`} className="block w-full" passHref>
              <Button variant="outline" className="w-full bg-transparent" size="lg">
                <img src="/placeholder.svg?height=20&width=20&text=K" alt="Kakao" className="w-5 h-5 mr-3" />
                카카오로 계속하기
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* Email Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
              size="lg"
            >
              로그인
            </Button>
          </form>

          <div className="text-center">
            <span className="text-gray-600">아직 계정이 없으신가요? </span>
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              회원가입
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

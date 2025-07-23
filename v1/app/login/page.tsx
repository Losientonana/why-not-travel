"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import api from "@/lib/axios"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const response = await api.post("/api/login", formData)
      const accessToken = response.headers["access"]
      if (accessToken) {
        await login(accessToken)
        router.push("/dashboard") // 무조건 대시보드로 리디렉션
      } else {
        setError("로그인에 실패했습니다. 토큰을 받지 못했습니다.")
      }
    } catch (err: any) {
      console.error("Login failed:", err)
      setError(err.response?.data?.message || "로그인 중 오류가 발생했습니다.")
    }
  }

  const onSocialLogin = (provider: string) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`
  }

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
            <Button variant="outline" className="w-full bg-transparent" size="lg" onClick={() => onSocialLogin("google")}>
              <img src="/google-logo.svg" alt="Google" className="w-5 h-5 mr-3" />
              Google로 계속하기
            </Button>
            <Button variant="outline" className="w-full bg-transparent" size="lg" onClick={() => onSocialLogin("naver")}>
              <img src="/naver-logo.svg" alt="Naver" className="w-5 h-5 mr-3" />
              네이버로 계속하기
            </Button>
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
            <div>
              <Input
                type="text"
                name="username"
                placeholder="아이디를 입력하세요"
                value={formData.username}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleFormChange}
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
            {error && <p className="text-sm text-red-600">{error}</p>}
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

'use client'

import { Separator } from "@/components/ui/separator"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Eye, EyeOff, Check, ArrowLeft } from "lucide-react"
import api from '../../lib/api';

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToMarketing: false,
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await api.post('/api/join', { 
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.')
      router.push('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.')
    }
  }

  const passwordRequirements = [
    { text: "8자 이상", met: formData.password.length >= 8 },
    { text: "영문, 숫자 포함", met: /^(?=.*[A-Za-z])(?=.*\d)/.test(formData.password) },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <ArrowLeft className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">TravelMate</span>
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">회원가입</CardTitle>
            <p className="text-gray-600">새로운 여행을 시작해보세요</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Button variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 bg-transparent">
                <img src="/placeholder.svg?height=20&width=20&text=G" alt="Google" className="w-5 h-5 mr-3" />
                Google로 계속하기
              </Button>
              <Button variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 bg-transparent">
                <img src="/placeholder.svg?height=20&width=20&text=N" alt="Naver" className="w-5 h-5 mr-3" />
                네이버로 계속하기
              </Button>
              <Button variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 bg-transparent">
                <img src="/placeholder.svg?height=20&width=20&text=K" alt="Kakao" className="w-5 h-5 mr-3" />
                카카오로 계속하기
              </Button>
            </div>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">또는</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <div>
                <Input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {formData.password && (
                  <div className="space-y-1 mt-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <Check className={`w-3 h-3 ${req.met ? "text-green-500" : "text-gray-300"}`} />
                        <span className={req.met ? "text-green-600" : "text-gray-500"}>{req.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">비밀번호 확인</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">비밀번호가 일치하지 않습니다</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      이용약관
                    </Link>{" "}
                    및{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      개인정보처리방침
                    </Link>
                    에 동의합니다
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={formData.agreeToMarketing}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeToMarketing: checked as boolean })}
                  />
                  <label htmlFor="marketing" className="text-sm text-gray-600">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                size="lg"
                disabled={!formData.agreeToTerms}
              >
                회원가입
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                로그인
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
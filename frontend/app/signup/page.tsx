"use client"

import { Separator } from "@/components/ui/separator"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Eye, EyeOff, Check, ArrowLeft, Mail, Shield } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showVerificationInput, setShowVerificationInput] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToMarketing: false,
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // 이메일 인증 코드 발송
  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: "이메일을 입력해주세요." }))
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: "올바른 이메일 형식이 아닙니다." }))
      return
    }

    setIsSendingCode(true)
    setErrors(prev => ({ ...prev, email: "", verificationCode: "" }))

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setShowVerificationInput(true)
        setSuccessMessage("인증 코드가 이메일로 발송되었습니다. (5분간 유효)")
        setTimeout(() => setSuccessMessage(""), 5000)
      } else {
        setErrors(prev => ({
          ...prev,
          email: data.message || "인증 코드 발송에 실패했습니다."
        }))
      }
    } catch (error) {
      console.error('인증 코드 발송 실패:', error)
      setErrors(prev => ({ ...prev, email: "네트워크 오류가 발생했습니다." }))
    } finally {
      setIsSendingCode(false)
    }
  }

  // 인증 코드 검증
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setErrors(prev => ({ ...prev, verificationCode: "6자리 인증 코드를 입력해주세요." }))
      return
    }

    setIsVerifying(true)
    setErrors(prev => ({ ...prev, verificationCode: "" }))

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode
        })
      })

      const data = await response.json()

      if (response.ok && data.success && data.data.verified) {
        setIsVerified(true)
        setSuccessMessage("이메일 인증이 완료되었습니다!")
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        setErrors(prev => ({
          ...prev,
          verificationCode: data.data?.message || "인증 코드가 올바르지 않습니다."
        }))
      }
    } catch (error) {
      console.error('인증 코드 검증 실패:', error)
      setErrors(prev => ({ ...prev, verificationCode: "검증 중 오류가 발생했습니다." }))
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 이메일 인증 확인
    if (!isVerified) {
      setErrors(prev => ({ ...prev, general: "이메일 인증을 완료해주세요." }))
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "비밀번호가 일치하지 않습니다." }))
      return
    }

    if (!formData.agreeToTerms) {
      setErrors(prev => ({ ...prev, terms: "이용약관에 동의해주세요." }))
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch(`${API_BASE_URL}/api/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push('/login?signup=success')
      } else {
        setErrors(prev => ({
          ...prev,
          general: data.message || "회원가입에 실패했습니다."
        }))
      }
    } catch (error) {
      console.error('회원가입 실패:', error)
      setErrors(prev => ({ ...prev, general: "회원가입 중 오류가 발생했습니다." }))
    } finally {
      setIsLoading(false)
    }
  }

  const passwordRequirements = [
    { text: "8자 이상", met: formData.password.length >= 8 },
    { text: "영문, 숫자 포함", met: /^(?=.*[A-Za-z])(?=.*\d)/.test(formData.password) },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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
            {/* Social Signup */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 bg-transparent">
                <img src="/placeholder.svg?height=20&width=20&text=G" alt="Google" className="w-5 h-5 mr-3" />
                Google로 계속하기
              </Button>
              <Button variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 bg-transparent">
                <img src="/placeholder.svg?height=20&width=20&text=N" alt="Naver" className="w-5 h-5 mr-3" />
                네이버로 계속하기
              </Button>
            </div>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">또는</span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {successMessage && (
                <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg border border-green-200">
                  {successMessage}
                </div>
              )}

              {errors.general && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  {errors.general}
                </div>
              )}

              <div>
                <Input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12"
                />
              </div>

              {/* 이메일 인증 섹션 */}
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">이메일 인증</span>
                  {isVerified && <Check className="w-5 h-5 text-green-600" />}
                </div>

                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      setErrors(prev => ({ ...prev, email: "" }))
                    }}
                    required
                    disabled={isVerified}
                    className="flex-1 h-12"
                  />
                  <Button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode || isVerified || !formData.email}
                    className="whitespace-nowrap"
                  >
                    {isSendingCode ? "발송 중..." : isVerified ? "인증완료" : showVerificationInput ? "재발송" : "인증"}
                  </Button>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}

                {/* 인증 코드 입력란 */}
                {showVerificationInput && !isVerified && (
                  <div className="space-y-2 pt-2">
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="6자리 인증 코드"
                        value={verificationCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
                          setVerificationCode(value)
                          setErrors(prev => ({ ...prev, verificationCode: "" }))
                        }}
                        maxLength={6}
                        className="flex-1 h-12 text-center text-lg tracking-widest"
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={isVerifying || verificationCode.length !== 6}
                      >
                        {isVerifying ? "확인 중..." : "확인"}
                      </Button>
                    </div>
                    {errors.verificationCode && (
                      <p className="text-red-500 text-xs">{errors.verificationCode}</p>
                    )}
                    <p className="text-xs text-gray-600">
                      이메일로 전송된 6자리 인증 코드를 입력하세요 (5분간 유효)
                    </p>
                  </div>
                )}

                {isVerified && (
                  <div className="flex items-center space-x-2 text-green-600 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>이메일 인증이 완료되었습니다</span>
                  </div>
                )}
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
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                )}
                {formData.confirmPassword && formData.password !== formData.confirmPassword && !errors.confirmPassword && (
                  <p className="text-xs text-red-500">비밀번호가 일치하지 않습니다</p>
                )}
              </div>

              {/* Terms Agreement */}
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
                disabled={!formData.agreeToTerms || !isVerified || isLoading}
              >
                {isLoading ? "회원가입 중..." : "회원가입"}
              </Button>
              {errors.terms && (
                <p className="text-red-500 text-xs text-center">{errors.terms}</p>
              )}
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

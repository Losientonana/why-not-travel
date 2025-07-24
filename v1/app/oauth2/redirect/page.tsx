"use client"

import React, { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth"
import api from "@/lib/axios"

function RedirectComponent() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchToken = async () => {
      // 백엔드 CustomSuccessHandler에서 httpOnly 쿠키로 refresh 토큰을 이미 설정했으므로,
      // 프론트에서는 /api/token을 호출하여 access 토큰만 받아오면 됩니다.
      try {
        const response = await api.post("/api/token")
        const accessToken = response.headers["access"]

        if (accessToken) {
          await login(accessToken)
          router.push("/dashboard") // 무조건 대시보드로 리디렉션
        } else {
          // 토큰 받아오기 실패
          router.push("/login")
        }
      } catch (error) {
        console.error("Token fetch failed:", error)
        router.push("/login")
      }
    }

    fetchToken()
  }, [login, router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>로그인 처리 중입니다...</p>
    </div>
  )
}

export default function OAuth2RedirectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectComponent />
    </Suspense>
  )
}

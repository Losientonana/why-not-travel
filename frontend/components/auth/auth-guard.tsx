"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
}

// 로그인 없이 접근 가능한 경로들
const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/oauth2/redirect",
  "/", // 홈페이지는 공개
  "/explore", // 여행 둘러보기
  "/community", // 커뮤니티
  "/pricing", // 요금제
  "/help", // 도움말
  "/faq", // 자주 묻는 질문
  "/contact", // 문의하기
  "/terms", // 이용약관
  "/privacy", // 개인정보처리방침
]

// OAuth2 관련 경로들
const OAUTH2_ROUTES = [
  "/oauth2"
]

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn, isLoading } = useAuth()

  useEffect(() => {
    // 로딩 중이면 아직 체크하지 않음
    if (isLoading) return

    // 현재 경로가 공개 경로인지 확인
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
    const isOAuth2Route = OAUTH2_ROUTES.some(route => pathname.startsWith(route))

    // pathname이 변경되었을 때만 인증 체크 (페이지 이동 시점에만)
    if (!isPublicRoute && !isOAuth2Route && !isLoggedIn) {
      console.log("🔒 인증이 필요한 페이지입니다. 로그인 페이지로 이동합니다.")
      router.push("/login")
      return
    }
  }, [pathname, isLoading]) // isLoggedIn과 router 의존성 제거하여 상태 변화로 인한 리렌더링 방지

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 인증이 필요한 페이지인데 로그인하지 않은 경우
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
  const isOAuth2Route = OAUTH2_ROUTES.some(route => pathname.startsWith(route))

  if (!isLoggedIn && !isPublicRoute && !isOAuth2Route) {
    // 리다이렉트 중이므로 아무것도 렌더링하지 않음
    return null
  }

  return <>{children}</>
}
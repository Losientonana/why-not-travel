"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function LogoutRedirectHandler() {
  const router = useRouter()

  useEffect(() => {
    const handleLogoutRedirect = () => {
      console.log('🏠 로그아웃 후 홈페이지로 리다이렉트')
      router.push('/')
    }

    // 로그아웃 리다이렉트 이벤트 리스너 등록
    window.addEventListener('auth-logout-redirect', handleLogoutRedirect)

    return () => {
      window.removeEventListener('auth-logout-redirect', handleLogoutRedirect)
    }
  }, [router])

  return null // UI를 렌더링하지 않음
}
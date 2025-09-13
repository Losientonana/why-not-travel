"use client"

import { useEffect } from 'react'
import { initializeSecureTokenSystem } from '@/lib/token-cleanup'

export function ClientTokenCleanup() {
  useEffect(() => {
    // 앱 시작 시 한 번만 실행하여 레거시 토큰들 정리
    initializeSecureTokenSystem()
  }, [])

  return null // UI를 렌더링하지 않음
}
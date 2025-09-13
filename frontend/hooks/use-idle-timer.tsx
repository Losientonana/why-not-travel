"use client"

import { useEffect, useRef, useCallback } from 'react'

interface UseIdleTimerProps {
  timeout: number // 밀리초 단위
  onIdle: () => void
  enabled: boolean
}

export function useIdleTimer({ timeout, onIdle, enabled }: UseIdleTimerProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const onIdleRef = useRef(onIdle)

  // onIdle 콜백을 최신 상태로 유지
  useEffect(() => {
    onIdleRef.current = onIdle
  }, [onIdle])

  // 타이머 리셋 함수
  const resetTimer = useCallback(() => {
    if (!enabled) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      console.log('⏰ 사용자 비활성으로 인한 자동 로그아웃')
      onIdleRef.current()
    }, timeout)
  }, [timeout, enabled])

  // 사용자 활동 감지
  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    // 감지할 이벤트 목록 (실무에서 가장 많이 사용하는 이벤트들)
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'focus'
    ]

    // 이벤트 리스너 등록
    const resetTimerThrottled = throttle(resetTimer, 1000) // 1초에 한 번만 실행
    events.forEach(event => {
      document.addEventListener(event, resetTimerThrottled, { passive: true })
    })

    // 초기 타이머 설정
    resetTimer()

    // API 요청 시에도 타이머 리셋 (axios interceptor 활용)
    const apiActivityListener = () => resetTimer()
    window.addEventListener('api-activity', apiActivityListener)

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimerThrottled)
      })
      window.removeEventListener('api-activity', apiActivityListener)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [enabled, resetTimer])

  return { resetTimer }
}

// 쓰로틀링 유틸리티 (성능 최적화)
function throttle(func: Function, limit: number) {
  let inThrottle: boolean
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
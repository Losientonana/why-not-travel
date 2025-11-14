"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { isAuthenticated, getUserInfo, logout as authLogout, UserInfo } from '@/lib/auth'
import { useIdleTimer } from '@/hooks/use-idle-timer'

interface AuthContextType {
  isLoggedIn: boolean
  user: UserInfo | null
  isLoading: boolean
  login: (userData: UserInfo) => void
  logout: () => Promise<void>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 실무 표준: 30분 비활성 시 자동 로그아웃 (은행/금융: 15분, 일반 서비스: 30-60분)
  const IDLE_TIMEOUT = 30 * 60 * 1000 // 30분

  // 인증 상태 확인 및 사용자 정보 가져오기
  const checkAuthStatus = async () => {
    console.log('🔍 [AuthContext] checkAuthStatus 시작')
    try {
      setIsLoading(true)
      console.log('⏳ [AuthContext] isLoading = true')

      const authenticated = isAuthenticated()
      console.log('🔐 [AuthContext] isAuthenticated() 결과:', authenticated)

      if (authenticated) {
        console.log('✅ [AuthContext] 인증됨 - 사용자 정보 가져오는 중...')
        const userInfo = await getUserInfo()
        console.log('👤 [AuthContext] getUserInfo() 결과:', userInfo)

        if (userInfo) {
          setIsLoggedIn(true)
          setUser(userInfo)
          console.log('✅ [AuthContext] 로그인 상태 확인됨:', userInfo.name, '(ID:', userInfo.id, ')')
        } else {
          // 토큰은 있지만 사용자 정보를 가져올 수 없는 경우 (만료된 토큰 등)
          setIsLoggedIn(false)
          setUser(null)
          console.log('❌ [AuthContext] 토큰이 유효하지 않음 - 사용자 정보 없음')
        }
      } else {
        setIsLoggedIn(false)
        setUser(null)
        console.log('🔓 [AuthContext] 로그인되지 않음 - 토큰 없음')
      }
    } catch (error) {
      console.error('❌ [AuthContext] 인증 상태 확인 중 오류:', error)
      setIsLoggedIn(false)
      setUser(null)
    } finally {
      setIsLoading(false)
      console.log('✅ [AuthContext] checkAuthStatus 완료 - isLoading = false')
    }
  }

  // 로그인 함수 (로그인 성공 후 호출)
  const login = (userData: UserInfo) => {
    console.log('🔐 [AuthContext] login() 호출됨:', userData)
    setIsLoggedIn(true)
    setUser(userData)
    console.log('✅ [AuthContext] 로그인 상태 업데이트:', userData.name, '(ID:', userData.id, ')')
  }

  // 로그아웃 함수
  const logout = async () => {
    console.log('🚪 [AuthContext] logout() 호출됨')
    try {
      await authLogout() // 백엔드 로그아웃 API 호출
      setIsLoggedIn(false)
      setUser(null)
      console.log('🔓 [AuthContext] 로그아웃 완료')

      // 홈페이지로 리다이렉트 이벤트 발생
      window.dispatchEvent(new CustomEvent('auth-logout-redirect'))
      console.log('📤 [AuthContext] auth-logout-redirect 이벤트 발생')
    } catch (error) {
      console.error('❌ [AuthContext] 로그아웃 중 오류:', error)
      // 오류가 발생해도 로컬 상태는 초기화하고 리다이렉트
      setIsLoggedIn(false)
      setUser(null)
      window.dispatchEvent(new CustomEvent('auth-logout-redirect'))
      console.log('📤 [AuthContext] auth-logout-redirect 이벤트 발생 (에러 후)')
    }
  }

  // 사용자 정보 새로고침
  const refreshUserData = async () => {
    if (isAuthenticated()) {
      const userInfo = await getUserInfo()
      if (userInfo) {
        setUser(userInfo)
      }
    }
  }

  // 토큰 만료 이벤트 리스너 (보안 강화)
  useEffect(() => {
    const handleTokenExpired = () => {
      console.log('🔓 토큰 만료로 인한 자동 로그아웃')
      setIsLoggedIn(false)
      setUser(null)
      // 토큰 만료 시에도 홈페이지로 리다이렉트
      window.dispatchEvent(new CustomEvent('auth-logout-redirect'))
    }

    // 토큰 만료 이벤트 리스너 등록
    window.addEventListener('auth-token-expired', handleTokenExpired)

    return () => {
      window.removeEventListener('auth-token-expired', handleTokenExpired)
    }
  }, [])

  // Idle Timer 설정 (비활성 시 자동 로그아웃)
  useIdleTimer({
    timeout: IDLE_TIMEOUT,
    onIdle: () => {
      if (isLoggedIn) {
        console.log('⏰ 30분 비활성으로 인한 자동 로그아웃')
        logout()
      }
    },
    enabled: isLoggedIn // 로그인 상태에서만 활성화
  })

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const value: AuthContextType = {
    isLoggedIn,
    user,
    isLoading,
    login,
    logout,
    refreshUserData
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Context 사용을 위한 custom hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import api from '../../../lib/api'

export default function OAuth2RedirectPage() {
  const router = useRouter()
  const { login } = useAuth()

  useEffect(() => {
    console.log("OAuth2 리디렉션 페이지 진입");

    const handleOAuth2Success = async () => {
      try {
        console.log("OAuth2 성공 - 쿠키 기반 로그인 처리");
        // OAuth2 성공 후 서버가 이미 access, refresh 쿠키를 설정했으므로
        // 바로 로그인 처리
        await login();
        console.log("로그인 처리 완료, 대시보드로 이동");
        router.push('/dashboard');
      } catch (error) {
        console.error('OAuth2 로그인 처리 실패:', error);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
        router.push('/login');
      }
    };

    handleOAuth2Success();
  }, [login, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>로그인 정보를 확인 중입니다...</p>
    </div>
  )
}
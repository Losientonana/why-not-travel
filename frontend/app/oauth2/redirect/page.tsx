'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { tokenManager } from '@/lib/api';

export default function OAuth2RedirectPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>('소셜 로그인 처리 중...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleSocialLoginSuccess = async () => {
      try {
        setStatus('토큰 교환 중...');
        
        // 백엔드의 /api/token 엔드포인트 호출
        // refresh 토큰은 쿠키에 자동 포함됨
        const response = await api.post('/api/token');
        
        // 응답 헤더에서 access 토큰 추출
        const accessToken = response.headers['access'];
        
        if (accessToken) {
          // localStorage에 access 토큰 저장
          tokenManager.setAccessToken(accessToken);
          
          setStatus('로그인 성공! 홈으로 이동 중...');
          
          // 잠시 후 홈으로 이동
          setTimeout(() => {
            router.push('/trips');
          }, 1000);
        } else {
          throw new Error('Access 토큰을 받지 못했습니다');
        }
      } catch (error: any) {
        console.error('❌ 소셜 로그인 토큰 교환 실패:', error);
        
        setStatus('로그인에 실패했습니다. 다시 시도해주세요.');
        
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    // 페이지 로드 시 즉시 토큰 교환 시도
    handleSocialLoginSuccess();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          ) : (
            <div className="text-4xl mb-4">
              {status.includes('성공') ? '✅' : '❌'}
            </div>
          )}
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            소셜 로그인 처리
          </h1>
          
          <p className="text-gray-600">
            {status}
          </p>
        </div>

        {!isLoading && status.includes('실패') && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">
              잠시 후 로그인 페이지로 이동합니다...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
'use client'

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState<string>('확인 중...');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인
    setIsLoggedIn(isAuthenticated());
  }, []);

  const testBackendConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('연결 테스트 중...');
    
    try {
      // 백엔드 헬스체크 (간단한 GET 요청)
      const response = await api.get('/');
      setConnectionStatus(`✅ 백엔드 연결 성공! (응답: ${response.status})`);
    } catch (error: any) {
      console.error('Backend connection failed:', error);
      if (error.code === 'ECONNREFUSED') {
        setConnectionStatus('❌ 백엔드 서버가 실행되지 않았습니다. (http://localhost:8080)');
      } else if (error.response) {
        setConnectionStatus(`⚠️ 백엔드 응답: ${error.response.status} ${error.response.statusText}`);
      } else {
        setConnectionStatus('❌ 네트워크 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          V2 프로젝트
        </h1>
        <p className="text-gray-600 mb-8">
          Next.js + TypeScript + 백엔드 연동
        </p>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">백엔드 연결 상태</h3>
          <p className="text-sm text-gray-600 mb-4">
            {connectionStatus}
          </p>
          <button
            onClick={testBackendConnection}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '테스트 중...' : '백엔드 연결 테스트'}
          </button>
        </div>

        <div className="space-y-4">
          {isLoggedIn ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-800 font-medium">로그인됨</span>
                </div>
              </div>
              <button
                onClick={() => window.location.href = '/profile'}
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                👤 내 정보 보기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                  <span className="text-gray-600">로그인 필요</span>
                </div>
              </div>
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                🔐 로그인 페이지로 이동
              </button>
            </div>
          )}

          <div className="space-y-2 text-sm text-gray-500">
            <p>🚀 개발 서버: http://localhost:3000</p>
            <p>🔗 백엔드 API: {process.env.NEXT_PUBLIC_API_URL}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserInfo, logout, isAuthenticated, type UserInfo } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      // 로그인 상태 확인
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        const data = await getUserInfo();
        if (data) {
          setUserInfo(data);
        } else {
          setError('사용자 정보를 가져올 수 없습니다.');
          // 정보를 가져올 수 없으면 로그인 페이지로 리다이렉트
          router.push('/login');
        }
      } catch (err) {
        setError('사용자 정보를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">내 정보</h1>
            <p className="text-gray-600">로그인한 사용자의 정보입니다</p>
          </div>

          {error && (
            <div className="text-red-600 text-center bg-red-50 py-3 px-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {userInfo && (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">기본 정보</h2>
                <div className="grid gap-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">ID:</span>
                    <span className="text-gray-800">{userInfo.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">이메일:</span>
                    <span className="text-gray-800">{userInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">이름:</span>
                    <span className="text-gray-800">{userInfo.name || '설정되지 않음'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">사용자명:</span>
                    <span className="text-gray-800">{userInfo.username || '설정되지 않음'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">권한:</span>
                    <span className="text-gray-800">{userInfo.role}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">인증 상태</h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-green-800 font-medium">JWT 토큰으로 인증됨</span>
                  </div>
                  <p className="text-green-600 text-sm mt-2">
                    백엔드 /api/user/me 엔드포인트에서 성공적으로 데이터를 받아왔습니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              홈으로 가기
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
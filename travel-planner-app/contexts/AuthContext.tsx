'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// api 클라이언트와 토큰 설정 함수를 함께 import 합니다.
import api, { setAccessToken } from '../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  role: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (accessToken: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    console.log("AuthContext: fetchUser 시작 - 쿠키로 인증");

    try {
      console.log("AuthContext: /api/user/me API 호출 시도");
      const response = await api.get('/api/user/me');
      console.log("AuthContext: API 응답 성공", response.data);

      if (response.data && response.data.email) {
        setUser(response.data);
        setIsLoggedIn(true);
        console.log("AuthContext: 사용자 정보 상태 업데이트 완료", response.data);
      } else {
        throw new Error("API 응답에 사용자 데이터가 없습니다.");
      }

    } catch (error) {
      console.error("AuthContext: 사용자 정보 로드 실패", error);
      setIsLoggedIn(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async () => {
    // 쿠키 방식에서는 서버가 이미 쿠키를 설정했으므로 바로 사용자 정보 조회
    console.log("AuthContext: 쿠키 기반 로그인 처리");
    await fetchUser();
  };

  const logout = async () => {
    try {
        console.log("AuthContext: 로그아웃 API 호출");
        await api.post('/api/logout'); // 서버에서 쿠키 삭제
    } catch (error) {
        console.error("Logout failed:", error);
    }
    // 상태 초기화
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
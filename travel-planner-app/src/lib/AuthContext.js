'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient, { setAccessToken, getAccessToken } from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        try {
            const { data } = await apiClient.get('/api/user/me');
            setUser(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch user', error);
            logout(); // 유저 정보 가져오기 실패 시 로그아웃 처리
            return null;
        }
    }, []);

    const hydrateSession = useCallback(async () => {
        setLoading(true);
        try {
            // 페이지 로드 시 쿠키(refreshToken)로 accessToken 갱신 시도
            await apiClient.post('/api/token');
            if (getAccessToken()) {
                await fetchUser();
            }
        } catch (error) {
            // 유효한 refreshToken이 없으면 에러 발생, 조용히 무시
            console.log('No active session found.');
        } finally {
            setLoading(false);
        }
    }, [fetchUser]);

    useEffect(() => {
        hydrateSession();

        const handleForceLogout = () => {
            console.log('Force logout event received');
            logout();
        };

        window.addEventListener('force-logout', handleForceLogout);
        return () => {
            window.removeEventListener('force-logout', handleForceLogout);
        };
    }, [hydrateSession]);

    const login = async (email, password) => {
        try {
            setLoading(true);
            // 백엔드의 일반 로그인 엔드포인트 호출 (refreshToken 쿠키 설정 목적)
            await apiClient.post('/api/auth/login', { email, password });
            
            // 성공 시 accessToken 헤더는 인터셉터가 처리
            // 사용자 정보 가져오기
            const userData = await fetchUser();
            if (userData) {
                router.push(userData.nickname ? '/' : '/nickname');
            }
        } catch (error) {
            console.error('Login failed', error);
            // 에러 메시지 표시 등의 처리
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(() => {
        setUser(null);
        setAccessToken(null);
        // 서버에 로그아웃 요청 (쿠키 삭제 목적)
        apiClient.post('/api/logout').catch(err => console.error('Server logout failed', err));
        router.push('/login');
    }, [router]);

    const value = {
        user,
        isLoggedIn: !!user,
        loading,
        login,
        logout,
        fetchUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

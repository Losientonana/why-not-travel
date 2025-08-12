'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import apiClient from '@/lib/api';

const OAuth2RedirectPage = () => {
    const router = useRouter();
    const { fetchUser } = useAuth();

    useEffect(() => {
        const finalizeLogin = async () => {
            try {
                // 1. 백엔드가 심어준 refreshToken(쿠키)으로 accessToken을 요청합니다.
                // 요청은 apiClient의 인터셉터가 처리하며, 성공 시 accessToken이 내부에 저장됩니다.
                await apiClient.post('/api/token');

                // 2. accessToken으로 사용자 정보를 가져옵니다.
                const user = await fetchUser();

                // 3. 사용자 정보에 따라 적절한 페이지로 리다이렉트합니다.
                if (user) {
                    if (user.nickname) {
                        router.push('/'); // 닉네임이 있으면 메인 페이지로
                    } else {
                        router.push('/nickname'); // 닉네임이 없으면 설정 페이지로
                    }
                } else {
                    // 사용자 정보를 가져오지 못하면 로그인 페이지로 보냅니다.
                    router.push('/login');
                }
            } catch (error) {
                console.error('OAuth login finalization failed', error);
                alert('로그인에 실패했습니다. 다시 시도해주세요.');
                router.push('/login');
            }
        };

        finalizeLogin();
    }, [router, fetchUser]);

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>로그인 중입니다...</h2>
            <p>잠시만 기다려주세요.</p>
        </div>
    );
};

export default OAuth2RedirectPage;

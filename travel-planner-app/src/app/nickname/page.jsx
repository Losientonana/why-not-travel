'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

const NicknamePage = () => {
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, fetchUser } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nickname.length < 2 || nickname.length > 15) {
            setError('닉네임은 2자 이상 15자 이하로 입력해주세요.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            // 백엔드에 닉네임 업데이트 요청
            await apiClient.patch('/api/user/me', { nickname });
            
            // 유저 정보 다시 불러오기 (AuthContext 상태 업데이트)
            await fetchUser();

            alert('닉네임이 설정되었습니다.');
            router.push('/'); // 메인 페이지로 이동
        } catch (err) {
            setError('닉네임 설정에 실패했습니다. 다른 닉네임을 시도해보세요.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <p>사용자 정보를 불러오는 중이거나, 로그인이 필요합니다...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>닉네임 설정</h2>
            <p>서비스를 이용하려면 닉네임을 설정해야 합니다.</p>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>닉네임</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                        minLength={2}
                        maxLength={15}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
                    {loading ? '설정 중...' : '닉네임 설정 완료'}
                </button>
            </form>
        </div>
    );
};

export default NicknamePage;

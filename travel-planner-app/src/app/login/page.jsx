'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            // 성공 시 AuthContext에서 라우팅 처리
        } catch (err) {
            setError('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.');
            console.error(err);
        }
    };

    // 백엔드 주소를 하드코딩하지 않도록 API 클라이언트의 baseURL을 사용합니다.
    const oauthLogin = (provider) => {
        window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>이메일</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
                    {loading ? '로그인 중...' : '로그인'}
                </button>
            </form>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p>소셜 로그인</p>
                <button onClick={() => oauthLogin('google')} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#db4437', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Google로 로그인
                </button>
                <button onClick={() => oauthLogin('naver')} style={{ width: '100%', padding: '10px', backgroundColor: '#03C75A', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Naver로 로그인
                </button>
            </div>
        </div>
    );
};

export default LoginPage;

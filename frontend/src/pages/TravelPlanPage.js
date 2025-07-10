import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';

const TravelPlanPage = () => {
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        title: '',
        startDate: '',
        endDate: '',
        description: '',
        visibility: 'PUBLIC' // 기본값 PUBLIC
    });
    const [message, setMessage] = useState('');

    // 여행 계획 목록 불러오기
    const fetchPlans = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/trips');
            setPlans(response.data);
        } catch (err) {
            console.error('Failed to fetch travel plans:', err);
            setError('여행 계획을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) { // user 정보가 로드된 후에만 fetch
            fetchPlans();
        }
    }, [user]); // user 객체가 변경될 때마다 fetch

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 여행 계획 생성
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/api/trips', form);
            setMessage('여행 계획이 성공적으로 생성되었습니다!');
            setForm({ // 폼 초기화
                title: '',
                startDate: '',
                endDate: '',
                description: '',
                visibility: 'PUBLIC'
            });
            fetchPlans(); // 목록 새로고침
        } catch (err) {
            console.error('Failed to create travel plan:', err);
            setMessage(err.response?.data || '여행 계획 생성에 실패했습니다.');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>여행 계획 로딩 중...</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2563eb' }}>내 여행 계획</h2>

            {/* 여행 계획 생성 폼 */}
            <div style={{ marginBottom: '40px', border: '1px solid #eee', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '20px', color: '#334155' }}>새 여행 계획 만들기</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        name="title"
                        placeholder="여행 계획 제목"
                        value={form.title}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>
                    <textarea
                        name="description"
                        placeholder="여행 계획 설명 (선택 사항)"
                        value={form.description}
                        onChange={handleChange}
                        rows="4"
                        style={{ ...inputStyle, resize: 'vertical' }}
                    ></textarea>
                    <select
                        name="visibility"
                        value={form.visibility}
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        <option value="PUBLIC">공개</option>
                        <option value="PRIVATE">비공개</option>
                    </select>
                    <button type="submit" style={buttonStyle}>계획 생성</button>
                </form>
                {message && <p style={{ marginTop: '15px', color: message.includes('성공') ? 'green' : 'red' }}>{message}</p>}
            </div>

            {/* 여행 계획 목록 */}
            <h3 style={{ marginBottom: '20px', color: '#334155' }}>내 여행 계획 목록</h3>
            {plans.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b' }}>아직 생성된 여행 계획이 없습니다.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {plans.map(plan => (
                        <div key={plan.id} style={planCardStyle}>
                            <h4 style={{ color: '#2563eb', marginBottom: '5px' }}>{plan.title}</h4>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>
                                {plan.startDate} ~ {plan.endDate}
                            </p>
                            {plan.description && <p style={{ fontSize: '14px', color: '#475569', marginTop: '5px' }}>{plan.description}</p>}
                            <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'right' }}>
                                작성자: {plan.nickname}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
};

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
};

const planCardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#f8fafc',
    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
};

export default TravelPlanPage;

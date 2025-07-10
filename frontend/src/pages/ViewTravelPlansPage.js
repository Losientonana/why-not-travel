import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';

const ViewTravelPlansPage = () => {
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>여행 계획 로딩 중...</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2563eb' }}>내 여행 계획 목록</h2>

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

const planCardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#f8fafc',
    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
};

export default ViewTravelPlansPage;
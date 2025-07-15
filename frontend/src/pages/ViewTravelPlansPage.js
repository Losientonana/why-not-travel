import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom'; // Link import 추가

const ViewTravelPlansPage = () => {
    const { user, loading: authLoading } = useAuth(); // authLoading 추가
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

    // 여행 계획 삭제
    const handleDelete = async (tripId) => {
        if (window.confirm('정말로 이 여행 계획을 삭제하시겠습니까?')) {
            try {
                await api.delete(`/api/trips/${tripId}`);
                alert('여행 계획이 성공적으로 삭제되었습니다.');
                fetchPlans(); // 목록 새로고침
            } catch (err) {
                console.error('Failed to delete travel plan:', err);
                alert('여행 계획 삭제에 실패했습니다.');
            }
        }
    };

    useEffect(() => {
        if (!authLoading && user) { // authLoading이 끝나고 user가 있을 때만 fetch
            fetchPlans();
        }
    }, [user, authLoading]); // authLoading도 의존성에 추가

    if (authLoading || loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>여행 계획 로딩 중...</div>; // authLoading 또는 fetch loading일 때
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                                    작성자: {plan.nickname}
                                </p>
                                <Link to={`/travel-plans/edit/${plan.id}`} style={editButtonStyle}>수정</Link>
                                <button onClick={() => handleDelete(plan.id)} style={deleteButtonStyle}>삭제</button>
                            </div>
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

const editButtonStyle = {
    padding: '5px 10px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '12px',
};

const deleteButtonStyle = {
    padding: '5px 10px',
    border: 'none',
    backgroundColor: '#dc2626', /* Red color for delete */
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '12px',
};

export default ViewTravelPlansPage;
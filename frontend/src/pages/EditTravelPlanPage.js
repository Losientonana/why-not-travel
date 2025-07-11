import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const EditTravelPlanPage = () => {
    const { id: tripId } = useParams(); // MyRoutes.js에서 :id로 설정했으므로 id를 tripId로 사용
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        startDate: '',
        endDate: '',
        description: '',
        visibility: 'PUBLIC'
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await api.get(`/api/trips/${tripId}`);
                const { title, startDate, endDate, description, visibility } = response.data;
                // 날짜 형식이 YYYY-MM-DD가 아닐 경우를 대비하여 포맷팅
                setForm({
                    title,
                    startDate: startDate.split('T')[0],
                    endDate: endDate.split('T')[0],
                    description: description || '', // null일 경우 빈 문자열로
                    visibility
                });
            } catch (err) {
                console.error('Failed to fetch travel plan:', err);
                setMessage('여행 계획을 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [tripId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.patch(`/api/trips/${tripId}`, form);
            setMessage('여행 계획이 성공적으로 수정되었습니다!');
            // 수정 성공 후, 1.5초 뒤에 내 여행 목록 페이지로 이동
            setTimeout(() => navigate('/travel-plans/view'), 1500);
        } catch (err) {
            console.error('Failed to update travel plan:', err);
            setMessage(err.response?.data?.message || '여행 계획 수정에 실패했습니다.');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2563eb' }}>여행 계획 수정</h2>

            <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #eee', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
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
                    <button type="submit" style={buttonStyle}>수정 완료</button>
                </form>
                {message && <p style={{ marginTop: '15px', textAlign: 'center', color: message.includes('성공') ? 'green' : 'red' }}>{message}</p>}
            </div>
        </div>
    );
};

const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
};

const buttonStyle = {
    padding: '12px 20px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
};

export default EditTravelPlanPage;
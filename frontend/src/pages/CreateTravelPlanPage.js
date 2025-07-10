import React, { useState } from 'react';
import api from '../api/axiosConfig';

const CreateTravelPlanPage = () => {
    const [form, setForm] = useState({
        title: '',
        startDate: '',
        endDate: '',
        description: '',
        visibility: 'PUBLIC' // 기본값 PUBLIC
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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
        } catch (err) {
            console.error('Failed to create travel plan:', err);
            setMessage(err.response?.data || '여행 계획 생성에 실패했습니다.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2563eb' }}>새 여행 계획 만들기</h2>

            <div style={{ marginBottom: '40px', border: '1px solid #eee', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
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

export default CreateTravelPlanPage;
import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const { user: authUser, setIsLoggedIn, setUser: setAuthUser } = useAuth();
    const navigate = useNavigate();

    const [currentNickname, setCurrentNickname] = useState("");
    const [newNickname, setNewNickname] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/user/me");
                const fetchedUser = res.data;
                setAuthUser(fetchedUser); // context도 동기화
                setCurrentNickname(fetchedUser.nickname || "");
                setNewNickname(fetchedUser.nickname || "");
                setLoading(false);

                // 닉네임이 없거나 비어있으면 닉네임 등록 페이지로 이동 (MyPage 진입 시 강제)
                if (!fetchedUser.nickname || fetchedUser.nickname.trim() === "") {
                    navigate("/nickname");
                }
            } catch (err) {
                console.error("Failed to fetch user info:", err);
                // 401 에러는 인터셉터가 처리하므로, 여기서는 다른 에러 처리
                setLoading(false);
                setMessage("사용자 정보를 불러오는 데 실패했습니다.");
            }
        };
        fetchUser();
    }, [setAuthUser, navigate]);

    const handleNicknameChange = (e) => {
        setNewNickname(e.target.value);
    };

    const handleNicknameSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        if (!newNickname || newNickname.trim() === "") {
            setMessage("닉네임을 입력해주세요.");
            return;
        }
        if (newNickname === currentNickname) {
            setMessage("현재 닉네임과 동일합니다.");
            return;
        }

        try {
            await api.patch("/api/user/me", { nickname: newNickname });
            setAuthUser((prev) => ({ ...prev, nickname: newNickname })); // Context 업데이트
            setCurrentNickname(newNickname);
            setMessage("닉네임이 성공적으로 변경되었습니다!");
        } catch (err) {
            console.error("Failed to update nickname:", err);
            setMessage(err.response?.data || "닉네임 변경에 실패했습니다.");
        }
    };

    if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>사용자 정보 로딩 중...</div>;
    if (!authUser) return <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>사용자 정보를 불러올 수 없습니다.</div>;

    return (
        <div style={{ textAlign: "center", marginTop: 50 }}>
            <h2 style={{ fontWeight: 700, color: "#2563eb", marginBottom: 32 }}>
                MyPage
            </h2>
            <table
                style={{
                    margin: "0 auto 24px",
                    borderCollapse: "collapse",
                    borderRadius: 10,
                    background: "#f9fafb",
                    minWidth: 350,
                    fontSize: 16,
                    boxShadow: "0 2px 12px #0001"
                }}
            >
                <tbody>
                <tr>
                    <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>이메일</th>
                    <td style={{ textAlign: "left", padding: "6px 18px" }}>{authUser.email}</td>
                </tr>
                <tr>
                    <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>아이디</th>
                    <td style={{ textAlign: "left", padding: "6px 18px" }}>{authUser.username}</td>
                </tr>
                <tr>
                    <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>닉네임</th>
                    <td style={{ textAlign: "left", padding: "6px 18px" }}>{currentNickname}</td>
                </tr>
                </tbody>
            </table>

            {/* 닉네임 수정 폼 */}
            <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "30px" }}>
                <h3 style={{ marginBottom: "20px", color: "#334155" }}>닉네임 변경</h3>
                <form onSubmit={handleNicknameSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
                    <input
                        type="text"
                        placeholder="새 닉네임 입력"
                        value={newNickname}
                        onChange={handleNicknameChange}
                        style={inputStyle}
                        required
                    />
                    <button type="submit" style={buttonStyle}>닉네임 변경</button>
                </form>
                {message && (
                    <p style={{ marginTop: "15px", color: message.includes("성공") ? "green" : "red" }}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '80%',
    maxWidth: '300px'
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

export default MyPage;

// src/pages/MyPage.js
import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const [user, setUser] = useState(null);
    const { setIsLoggedIn, setUser: setAuthUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/userinfo");
                setUser(res.data);
                setAuthUser(res.data); // context도 동기화
                if (!res.data.nickname || res.data.nickname.trim() === "") {
                    navigate("/nickname");
                }
            } catch (err) {
                // 인터셉터가 401을 처리하므로, 여기서는 주로 네트워크 오류나 기타 서버 오류를 처리
                // 사용자를 강제로 로그아웃 시키기보다는 에러 메시지를 보여주는 것이 더 나은 UX일 수 있음
                console.error("Failed to fetch user info:", err);
                // setUser(null);
                // setIsLoggedIn(false);
                // localStorage.removeItem("access");
                // navigate("/login");
            }
        };
        fetchUser();
    }, [setIsLoggedIn, setAuthUser, navigate]);

    if (!user) return <div>Loading...</div>; // user 정보가 로드되기 전에는 로딩 상태를 보여줌

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
                    <td style={{ textAlign: "left", padding: "6px 18px" }}>{user.email}</td>
                </tr>
                <tr>
                    <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>아이디</th>
                    <td style={{ textAlign: "left", padding: "6px 18px" }}>{user.username}</td>
                </tr>
                <tr>
                    <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>닉네임</th>
                    <td style={{ textAlign: "left", padding: "6px 18px" }}>{user.nickname}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MyPage;
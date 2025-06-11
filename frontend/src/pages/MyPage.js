// import React, { useEffect, useState } from "react";
// import api from "../api/axiosConfig";
// import { useAuth } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
//
// const MyPage = () => {
//     const [userDetail, setUserDetail] = useState(null);
//     const [msg, setMsg] = useState("");
//     const { setIsLoggedIn, setUser } = useAuth();
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const token = localStorage.getItem("access");
//                 const res = await api.get("/my", { headers: { access: token } });
//                 setUserDetail(res.data);
//                 if (!res.data.nickname || res.data.nickname.trim() === "") {
//                     navigate("/nickname");
//                 }
//             } catch (err) {
//                 setUserDetail(null);
//                 setMsg(err.response?.data?.message || err.message);
//                 if (err.response?.status === 401) {
//                     setIsLoggedIn(false);
//                     setUser(null);
//                     localStorage.removeItem("access");
//                     navigate("/login");
//                 }
//             }
//         };
//         fetchUser();
//     }, [setIsLoggedIn, setUser, navigate]);
//
//     const onLogout = async () => {
//         try {
//             const token = localStorage.getItem("access");
//             await api.post("/logout", {}, { headers: { access: token } });
//             setIsLoggedIn(false);
//             setUser(null);
//             localStorage.removeItem("access");
//             navigate("/");
//         } catch (err) {
//             setMsg(err.response?.data?.message || err.message);
//         }
//     };
//
//     if (!userDetail) return null;
//
//     return (
//         <div style={{ textAlign: "center", marginTop: 50 }}>
//             <h2 style={{ fontWeight: 700, color: "#2563eb", marginBottom: 32 }}>
//                 {userDetail.name || userDetail.username ? `${userDetail.name || userDetail.username}님 환영합니다!` : "이름 정보를 불러오지 못했습니다."}
//             </h2>
//             <table
//                 style={{
//                     margin: "0 auto 24px",
//                     borderCollapse: "collapse",
//                     borderRadius: 10,
//                     background: "#f9fafb",
//                     minWidth: 350,
//                     fontSize: 16,
//                     boxShadow: "0 2px 12px #0001"
//                 }}
//             >
//                 <tbody>
//                 <tr>
//                     <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>이메일</th>
//                     <td style={{ textAlign: "left", padding: "6px 18px" }}>{userDetail.email}</td>
//                 </tr>
//                 <tr>
//                     <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>아이디</th>
//                     <td style={{ textAlign: "left", padding: "6px 18px" }}>{userDetail.username}</td>
//                 </tr>
//                 <tr>
//                     <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>이름</th>
//                     <td style={{ textAlign: "left", padding: "6px 18px" }}>{userDetail.name}</td>
//                 </tr>
//                 <tr>
//                     <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>닉네임</th>
//                     <td style={{ textAlign: "left", padding: "6px 18px" }}>{userDetail.nickname}</td>
//                 </tr>
//                 </tbody>
//             </table>
//
//             <button
//                 onClick={onLogout}
//                 style={{
//                     background: "#3b82f6",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: 8,
//                     padding: "10px 32px",
//                     fontSize: 16,
//                     fontWeight: 600,
//                     cursor: "pointer",
//                     marginBottom: 16,
//                     marginTop: 8,
//                     transition: "background 0.2s"
//                 }}
//             >
//                 로그아웃
//             </button>
//             {msg && <div style={{ color: "#ef4444", marginTop: 18 }}>{msg}</div>}
//         </div>
//     );
// };
//
// export default MyPage;

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
                const token = localStorage.getItem("access");
                const res = await api.get("/userinfo", { headers: { access: token } });
                setUser(res.data);
                setAuthUser(res.data); // context도 동기화
                if (!res.data.nickname || res.data.nickname.trim() === "") {
                    navigate("/nickname");
                }
            } catch (err) {
                setUser(null);
                setIsLoggedIn(false);
                localStorage.removeItem("access");
                navigate("/login");
            }
        };
        fetchUser();
    }, [setIsLoggedIn, setAuthUser, navigate]);

    if (!user) return null;

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

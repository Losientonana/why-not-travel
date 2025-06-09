//
// import React, { useEffect, useState } from "react";
// import api from "../api/axiosConfig";
// import { useAuth } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
//
// const MyPage = () => {
//     const [user, setUser] = useState(null);
//     const [msg, setMsg] = useState("");
//     const { setIsLoggedIn, setLoginUser } = useAuth();
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const token = localStorage.getItem("access");
//                 const res = await api.get("/my", {
//                     headers: { access: token }
//                 });
//                 setUser(res.data);
//                 setMsg("");
//             } catch (err) {
//                 setUser(null);
//                 setMsg(err.response?.data?.message || err.message);
//                 if (err.response?.status === 401) {
//                     setIsLoggedIn(false);
//                     setLoginUser("");
//                     localStorage.removeItem("access");
//                     localStorage.removeItem("username");
//                     navigate("/login");
//                 }
//             }
//         };
//         fetchUser();
//     }, [setIsLoggedIn, setLoginUser, navigate]);
//
//     const onLogout = async () => {
//         try {
//             const token = localStorage.getItem("access");
//             await api.post("/logout", {}, { headers: { access: token } });
//             setIsLoggedIn(false);
//             setLoginUser("");
//             localStorage.removeItem("access");
//             localStorage.removeItem("username");
//             navigate("/");
//         } catch (err) {
//             setMsg(err.response?.data?.message || err.message);
//         }
//     };
//
//     // 간결하게 필요한 정보만 표시
//     return (
//         <div style={{ textAlign: "center", marginTop: 50 }}>
//             <h2 style={{ fontWeight: 700, color: "#2563eb", marginBottom: 32 }}>
//                 {user && (user.name || user.username)
//                     ? `${user.name || user.username}님 환영합니다!`
//                     : "이름 정보를 불러오지 못했습니다."}
//             </h2>
//
//             {user && (
//                 <table
//                     style={{
//                         margin: "0 auto 24px",
//                         borderCollapse: "collapse",
//                         borderRadius: 10,
//                         background: "#f9fafb",
//                         minWidth: 350,
//                         fontSize: 16,
//                         boxShadow: "0 2px 12px #0001"
//                     }}
//                 >
//                     <tbody>
//                     <tr>
//                         <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>이메일</th>
//                         <td style={{ textAlign: "left", padding: "6px 18px" }}>{user.email}</td>
//                     </tr>
//                     <tr>
//                         <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>아이디</th>
//                         <td style={{ textAlign: "left", padding: "6px 18px" }}>{user.username}</td>
//                     </tr>
//                     <tr>
//                         <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>이름</th>
//                         <td style={{ textAlign: "left", padding: "6px 18px" }}>{user.name}</td>
//                     </tr>
//                     <tr>
//                         <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>닉네임</th>
//                         <td style={{ textAlign: "left", padding: "6px 18px" }}>{user.nickname}</td>
//                     </tr>
//                     </tbody>
//                 </table>
//             )}
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
import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const [user, setUser] = useState(null);
    const [msg, setMsg] = useState("");
    const { setIsLoggedIn, setLoginUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("access");
                const res = await api.get("/my", { headers: { access: token } });
                setUser(res.data);
                setMsg("");
                // 닉네임 없으면 닉네임 등록 페이지로 강제 이동
                if (!res.data.nickname || res.data.nickname.trim() === "") {
                    navigate("/nickname");
                }
            } catch (err) {
                setUser(null);
                setMsg(err.response?.data?.message || err.message);
                if (err.response?.status === 401) {
                    setIsLoggedIn(false);
                    setLoginUser("");
                    localStorage.removeItem("access");
                    localStorage.removeItem("username");
                    navigate("/login");
                }
            }
        };
        fetchUser();
        // eslint-disable-next-line
    }, [setIsLoggedIn, setLoginUser, navigate]);

    const onLogout = async () => {
        try {
            const token = localStorage.getItem("access");
            await api.post("/logout", {}, { headers: { access: token } });
            setIsLoggedIn(false);
            setLoginUser("");
            localStorage.removeItem("access");
            localStorage.removeItem("username");
            navigate("/");
        } catch (err) {
            setMsg(err.response?.data?.message || err.message);
        }
    };

    if (!user) return null;

    return (
        <div style={{ textAlign: "center", marginTop: 50 }}>
            <h2 style={{ fontWeight: 700, color: "#2563eb", marginBottom: 32 }}>
                {user.name || user.username ? `${user.name || user.username}님 환영합니다!` : "이름 정보를 불러오지 못했습니다."}
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
                    <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>이름</th>
                    <td style={{ textAlign: "left", padding: "6px 18px" }}>{user.name}</td>
                </tr>
                <tr>
                    <th style={{ textAlign: "right", padding: "6px 18px", color: "#666", fontWeight: 500 }}>닉네임</th>
                    <td style={{ textAlign: "left", padding: "6px 18px" }}>{user.nickname}</td>
                </tr>
                </tbody>
            </table>

            <button
                onClick={onLogout}
                style={{
                    background: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 32px",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginBottom: 16,
                    marginTop: 8,
                    transition: "background 0.2s"
                }}
            >
                로그아웃
            </button>
            {msg && <div style={{ color: "#ef4444", marginTop: 18 }}>{msg}</div>}
        </div>
    );
};

export default MyPage;

// // import React, { useEffect, useState } from "react";
// // import api from "../api/axiosConfig";
// // import { useAuth } from "../contexts/AuthContext";
// // import { useNavigate } from "react-router-dom";
// //
// // const MyPage = () => {
// //     const [user, setUser] = useState(null);
// //     const [msg, setMsg] = useState("");
// //     const { setIsLoggedIn, setLoginUser } = useAuth();
// //     const navigate = useNavigate();
// //
// //     useEffect(() => {
// //         const fetchUser = async () => {
// //             try {
// //                 const token = localStorage.getItem("access");
// //                 const res = await api.get("/my", {
// //                     headers: { access: token }
// //                 });
// //                 setUser(res.data);
// //             } catch (err) {
// //                 setUser(null);
// //                 setMsg(err.response?.data?.message || err.message);
// //                 if (err.response?.status === 401) {
// //                     setIsLoggedIn(false);
// //                     setLoginUser("");
// //                     localStorage.removeItem("access");
// //                     localStorage.removeItem("username");
// //                     navigate("/login");
// //                 }
// //             }
// //         };
// //         fetchUser();
// //     }, [setIsLoggedIn, setLoginUser, navigate]);
// //
// //     const onLogout = async () => {
// //         try {
// //             const token = localStorage.getItem("access");
// //             await api.post("/logout", {}, { headers: { access: token } });
// //             setIsLoggedIn(false);
// //             setLoginUser("");
// //             localStorage.removeItem("access");
// //             localStorage.removeItem("username");
// //             navigate("/");
// //         } catch (err) {
// //             setMsg(err.response?.data?.message || err.message);
// //         }
// //     };
// //
// //     return (
// //         <div>
// //             <h2>내 정보</h2>
// //             {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
// //             <button onClick={onLogout}>로그아웃</button>
// //             {msg && <div>{msg}</div>}
// //         </div>
// //     );
// // };
// //
// // export default MyPage;
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
//     return (
//         <div style={{ textAlign: "center", marginTop: 50 }}>
//             <h2 style={{ fontWeight: 700, color: "#2563eb", marginBottom: 32 }}>
//                 {user && user.name ? `${user.name}님 환영합니다!` : "이름 정보를 불러오지 못했습니다."}
//             </h2>
//             <button onClick={onLogout}
//                     style={{
//                         background: "#3b82f6",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: 8,
//                         padding: "10px 32px",
//                         fontSize: 16,
//                         fontWeight: 600,
//                         cursor: "pointer",
//                         marginBottom: 16,
//                         marginTop: 8,
//                         transition: "background 0.2s"
//                     }}
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
                const res = await api.get("/my", {
                    headers: { access: token }
                });
                setUser(res.data);
                setMsg("");
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

    // 여기에서 name이 null이면 username 사용!
    const displayName = user
        ? (user.name ? user.name : user.username)
        : "";

    return (
        <div style={{ textAlign: "center", marginTop: 50 }}>
            <h2 style={{ fontWeight: 700, color: "#2563eb", marginBottom: 32 }}>
                {displayName ? `${displayName}님 환영합니다!` : "이름 정보를 불러오지 못했습니다."}
            </h2>
            <button onClick={onLogout}
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

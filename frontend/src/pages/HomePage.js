// // // import { Link } from "react-router-dom";
// // // import { useAuth } from "../contexts/AuthContext";
// // //
// // // const HomePage = () => {
// // //     const { isLoggedIn, loginUser } = useAuth();
// // //
// // //     return (
// // //         <div>
// // //             <h2>홈</h2>
// // //             <p>Spring OAuth2+JWT 예제</p>
// // //             {!isLoggedIn && (
// // //                 <div>
// // //                     <Link to="/login">로그인</Link> | <Link to="/join">회원가입</Link>
// // //                 </div>
// // //             )}
// // //             {isLoggedIn && <div>안녕하세요, {loginUser}님!</div>}
// // //         </div>
// // //     );
// // // };
// // //
// // // export default HomePage;
// // import { Link } from "react-router-dom";
// // import { useAuth } from "../contexts/AuthContext";
// //
// // const HomePage = () => {
// //     const { isLoggedIn, loginUser } = useAuth();
// //
// //     return (
// //         <div style={{ textAlign: "center", marginTop: 30 }}>
// //             <img
// //                 src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f511.png"
// //                 alt="OAuth2"
// //                 width={70}
// //                 style={{ marginBottom: 20 }}
// //             />
// //             <h2 style={{ fontSize: 26, color: "#2563eb", marginBottom: 10 }}>
// //                 Spring OAuth2 + JWT 인증 예제
// //             </h2>
// //             <p style={{ color: "#64748b", marginBottom: 28 }}>
// //                 소셜/일반 로그인 · JWT 토큰 이중인증 · React 예제
// //             </p>
// //             {!isLoggedIn && (
// //                 <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
// //                     <Link to="/login">
// //                         <button style={btnStyle}>로그인</button>
// //                     </Link>
// //                     <Link to="/join">
// //                         <button style={btnStyleOutline}>회원가입</button>
// //                     </Link>
// //                 </div>
// //             )}
// //             {isLoggedIn && (
// //                 <div style={{ color: "#334155", fontWeight: 600, fontSize: 18 }}>
// //                     안녕하세요, {loginUser}님!
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };
// //
// // const btnStyle = {
// //     background: "#3b82f6",
// //     color: "#fff",
// //     border: "none",
// //     borderRadius: 8,
// //     padding: "10px 32px",
// //     fontSize: 16,
// //     fontWeight: 600,
// //     cursor: "pointer",
// //     transition: "background 0.2s"
// // };
// // const btnStyleOutline = {
// //     ...btnStyle,
// //     background: "#fff",
// //     color: "#3b82f6",
// //     border: "2px solid #3b82f6"
// // };
// //
// // export default HomePage;
// import { useEffect, useState } from "react";
// import api from "../api/axiosConfig"; // axios 설정
// import { Link } from "react-router-dom";
//
// const HomePage = () => {
//     const [nickname, setNickname] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);
//
//     useEffect(() => {
//         const token = localStorage.getItem("access");
//         if (!token) {
//             setLoading(false);
//             return;
//         }
//
//         api.get("/userinfo", {
//             headers: {
//                 access: token,
//             }
//         }).then((res) => {
//             setNickname(res.data.nickname);
//             setLoading(false);
//         }).catch((err) => {
//             if (err.response?.status === 409) {
//                 window.location.href = "/nickname"; // 닉네임 미등록 시
//             } else {
//                 setError(true);
//                 setLoading(false);
//             }
//         });
//     }, []);
//
//     if (loading) return <div>로딩 중...</div>;
//     if (error) return <div>에러 발생</div>;
//
//     return (
//         <div style={{ textAlign: "center", marginTop: 30 }}>
//             <img
//                 src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f511.png"
//                 alt="OAuth2"
//                 width={70}
//                 style={{ marginBottom: 20 }}
//             />
//             <h2 style={{ fontSize: 26, color: "#2563eb", marginBottom: 10 }}>
//                 Spring OAuth2 + JWT 인증 예제
//             </h2>
//             <p style={{ color: "#64748b", marginBottom: 28 }}>
//                 소셜/일반 로그인 · JWT 토큰 이중인증 · React 예제
//             </p>
//
//             {nickname ? (
//                 <div style={{ color: "#334155", fontWeight: 600, fontSize: 18 }}>
//                     안녕하세요, {nickname}님!
//                 </div>
//             ) : (
//                 <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
//                     <Link to="/login">
//                         <button style={btnStyle}>로그인</button>
//                     </Link>
//                     <Link to="/join">
//                         <button style={btnStyleOutline}>회원가입</button>
//                     </Link>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// const btnStyle = {
//     background: "#3b82f6",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     padding: "10px 32px",
//     fontSize: 16,
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "background 0.2s"
// };
// const btnStyleOutline = {
//     ...btnStyle,
//     background: "#fff",
//     color: "#3b82f6",
//     border: "2px solid #3b82f6"
// };
//
// export default HomePage;
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const HomePage = () => {
    const { user, isLoggedIn, loading } = useAuth();

    if (loading) return <div>로딩 중...</div>;

    return (
        <div style={{ textAlign: "center", marginTop: 30 }}>
            <img
                src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f511.png"
                alt="OAuth2"
                width={70}
                style={{ marginBottom: 20 }}
            />
            <h2 style={{ fontSize: 26, color: "#2563eb", marginBottom: 10 }}>
                Spring OAuth2 + JWT 인증 예제
            </h2>
            <p style={{ color: "#64748b", marginBottom: 28 }}>
                소셜/일반 로그인 · JWT 토큰 이중인증 · React 예제
            </p>

            {isLoggedIn && user && user.nickname ? (
                <div style={{ color: "#334155", fontWeight: 600, fontSize: 18 }}>
                    안녕하세요, {user.nickname}님!
                </div>
            ) : (
                <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                    <Link to="/login">
                        <button style={btnStyle}>로그인</button>
                    </Link>
                    <Link to="/join">
                        <button style={btnStyleOutline}>회원가입</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

const btnStyle = {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 32px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s"
};
const btnStyleOutline = {
    ...btnStyle,
    background: "#fff",
    color: "#3b82f6",
    border: "2px solid #3b82f6"
};

export default HomePage;

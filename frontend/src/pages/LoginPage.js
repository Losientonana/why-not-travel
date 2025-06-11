// // import React, { useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import api from "../api/axiosConfig";
// // import { useAuth } from "../contexts/AuthContext";
// //
// // const LoginPage = () => {
// //     const [form, setForm] = useState({ username: "", password: "" });
// //     const [msg, setMsg] = useState("");
// //     const { setIsLoggedIn, setLoginUser } = useAuth();
// //     const navigate = useNavigate();
// //
// //     const handleChange = (e) => {
// //         setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
// //     };
// //
// //     const onLogin = async (e) => {
// //         e.preventDefault();
// //         try {
// //             const res = await api.post("/login", form);
// //             const token = res.headers["access"];
// //             setIsLoggedIn(true);
// //             setLoginUser(form.username);
// //             localStorage.setItem("access", token);
// //             localStorage.setItem("username", form.username);
// //             setMsg("로그인 성공!");
// //             navigate("/mypage");
// //         } catch (err) {
// //             setMsg(err.response?.data?.message || err.message);
// //         }
// //     };
// //
// //     const onSocialLogin = (provider) => {
// //         window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
// //     };
// //
// //     return (
// //         <div style={{ textAlign: "center" }}>
// //             <h2 style={{ color: "#2563eb" }}>로그인</h2>
// //             <form onSubmit={onLogin} style={{ margin: "24px 0" }}>
// //                 <input
// //                     name="username"
// //                     placeholder="아이디"
// //                     value={form.username}
// //                     onChange={handleChange}
// //                     style={{ marginBottom: 10, padding: 8, width: "80%" }}
// //                 /><br />
// //                 <input
// //                     name="password"
// //                     placeholder="비밀번호"
// //                     type="password"
// //                     value={form.password}
// //                     onChange={handleChange}
// //                     style={{ marginBottom: 10, padding: 8, width: "80%" }}
// //                 /><br />
// //                 <button type="submit" style={{ ...btnStyle, marginBottom: 16 }}>일반 로그인</button>
// //             </form>
// //             <button onClick={() => onSocialLogin("naver")} style={btnStyleOutline}>네이버 로그인</button>{" "}
// //             <button onClick={() => onSocialLogin("google")} style={btnStyleOutline}>구글 로그인</button>
// //             <div style={{ marginTop: 18 }}>
// //                 <span>계정이 없으신가요? </span>
// //                 <Link to="/join" style={{ color: "#2563eb", fontWeight: 600 }}>회원가입</Link>
// //             </div>
// //             {msg && <div style={{ color: "#ef4444", marginTop: 18 }}>{msg}</div>}
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
// //     margin: "10px 0",
// //     transition: "background 0.2s"
// // };
// // const btnStyleOutline = {
// //     ...btnStyle,
// //     background: "#fff",
// //     color: "#3b82f6",
// //     border: "2px solid #3b82f6"
// // };
// //
// // export default LoginPage;
// import React, { useState } from "react";
// import api from "../api/axiosConfig";
// import { useAuth } from "../contexts/AuthContext";
// import { useNavigate, Link } from "react-router-dom";
//
// const LoginPage = () => {
//     const [form, setForm] = useState({ username: "", password: "" });
//     const [msg, setMsg] = useState("");
//     const { setUser, setIsLoggedIn } = useAuth();
//     const navigate = useNavigate();
//
//     const handleChange = (e) => {
//         setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };
//
//     const onLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await api.post("/login", form);
//             const token = res.headers["access"];
//             localStorage.setItem("access", token);
//
//             // userinfo로 유저 정보 다시 받아와서 context에 저장
//             const userInfo = await api.get("/userinfo", { headers: { access: token } });
//             setUser(userInfo.data);
//             setIsLoggedIn(true);
//
//             setMsg("로그인 성공!");
//             // 닉네임 없으면 /nickname, 있으면 /mypage
//             if (!userInfo.data.nickname) {
//                 navigate("/nickname");
//             } else {
//                 navigate("/mypage");
//             }
//         } catch (err) {
//             setMsg(err.response?.data?.message || err.message);
//         }
//     };
//
//     const onSocialLogin = (provider) => {
//         window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
//     };
//
//     return (
//         <div style={{ textAlign: "center" }}>
//             {/* ... 생략 ... */}
//         </div>
//     );
// };
//
// export default LoginPage;
import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [msg, setMsg] = useState("");
    const { setIsLoggedIn, setUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/login", form);
            const token = res.headers["access"];
            localStorage.setItem("access", token);
            setIsLoggedIn(true);

            // 유저 정보 받아서 분기
            const userRes = await api.get("/userinfo", { headers: { access: token } });
            setUser(userRes.data);

            if (userRes.data.nickname && userRes.data.nickname.trim() !== "") {
                setMsg("로그인 성공!");
                navigate("/"); // 닉네임 있으면 홈으로
            } else {
                setMsg("닉네임을 먼저 등록해주세요.");
                navigate("/nickname"); // 닉네임 없으면 닉네임 등록 페이지로
            }
        } catch (err) {
            setMsg(err.response?.data?.message || err.message);
        }
    };
    const onSocialLogin = (provider) => {
        window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2 style={{ color: "#2563eb" }}>로그인</h2>
            <form onSubmit={onLogin} style={{ margin: "24px 0" }}>
                <input
                    name="username"
                    placeholder="아이디"
                    value={form.username}
                    onChange={handleChange}
                    style={{ marginBottom: 10, padding: 8, width: "80%" }}
                /><br />
                <input
                    name="password"
                    placeholder="비밀번호"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    style={{ marginBottom: 10, padding: 8, width: "80%" }}
                /><br />
                <button type="submit" style={{ ...btnStyle, marginBottom: 16 }}>일반 로그인</button>
            </form>
            <button onClick={() => onSocialLogin("naver")} style={btnStyleOutline}>네이버 로그인</button>{" "}
            <button onClick={() => onSocialLogin("google")} style={btnStyleOutline}>구글 로그인</button>
            <div style={{ marginTop: 18 }}>
                <span>계정이 없으신가요? </span>
                <Link to="/join" style={{ color: "#2563eb", fontWeight: 600 }}>회원가입</Link>
            </div>
            {msg && <div style={{ color: "#ef4444", marginTop: 18 }}>{msg}</div>}
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
    margin: "10px 0",
    transition: "background 0.2s"
};
const btnStyleOutline = {
    ...btnStyle,
    background: "#fff",
    color: "#3b82f6",
    border: "2px solid #3b82f6"
};

export default LoginPage;

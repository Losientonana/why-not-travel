import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [msg, setMsg] = useState("");
    const { setIsLoggedIn, setLoginUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/login", form);
            const token = res.headers["access"];
            setIsLoggedIn(true);
            setLoginUser(form.username);
            localStorage.setItem("access", token);
            localStorage.setItem("username", form.username);
            setMsg("로그인 성공!");
            navigate("/mypage");
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

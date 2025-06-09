// import React, { useState } from "react";
// import api from "../api/axiosConfig";
// import { useNavigate } from "react-router-dom";
//
// const JoinPage = () => {
//     const [form, setForm] = useState({ username: "", password: "" });
//     const [msg, setMsg] = useState("");
//     const navigate = useNavigate();
//
//     const handleChange = (e) => {
//         setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };
//
//     const onJoin = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await api.post("/join", form);
//             setMsg("회원가입 성공! 로그인 해주세요.");
//             setTimeout(() => navigate("/login"), 1000);
//         } catch (err) {
//             setMsg(err.response?.data?.message || err.message);
//         }
//     };
//
//     return (
//         <div>
//             <h2>회원가입</h2>
//             <form onSubmit={onJoin}>
//                 <input name="username" placeholder="아이디" value={form.username} onChange={handleChange} />
//                 <input name="password" placeholder="비밀번호" type="password" value={form.password} onChange={handleChange} />
//                 <button type="submit">회원가입</button>
//             </form>
//             {msg && <div>{msg}</div>}
//         </div>
//     );
// };
//
// export default JoinPage;

import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const JoinPage = () => {
    // 기존 username, password → email, username, name, nickname, password 추가
    const [form, setForm] = useState({
        email: "",
        username: "",
        name: "",
        nickname: "",
        password: ""
    });
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onJoin = async (e) => {
        e.preventDefault();
        try {
            await api.post("/join", form);
            setMsg("회원가입 성공! 로그인 해주세요.");
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            setMsg(err.response?.data || err.message);
        }
    };

    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={onJoin}>
                <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
                <input name="username" placeholder="아이디" value={form.username} onChange={handleChange} />
                <input name="name" placeholder="이름" value={form.name} onChange={handleChange} />
                <input name="nickname" placeholder="닉네임" value={form.nickname} onChange={handleChange} />
                <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} />
                <button type="submit">회원가입</button>
            </form>
            {msg && <div>{msg}</div>}
        </div>
    );
};

export default JoinPage;

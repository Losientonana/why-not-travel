import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axiosConfig";

const NicknameForm = ({ onSuccess }) => {
    const [nickname, setNickname] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setLoading(true);
        try {
            await api.patch("/api/user/me", { nickname });
            setUser((prev) => ({ ...prev, nickname }));
            setMsg("닉네임이 성공적으로 등록되었습니다!");
            setLoading(false);
            if (onSuccess) onSuccess();
        } catch (err) {
            setMsg(err.response?.data?.message || err.response?.data || "알 수 없는 에러가 발생했습니다.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} style={{ marginTop: 30, textAlign: "center" }}>
            <input
                name="nickname"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: "1px solid #aaa" }}
                disabled={loading}
                required
            />
            <button
                type="submit"
                disabled={loading}
                style={{
                    marginLeft: 10,
                    padding: "8px 18px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontWeight: 600
                }}
            >
                등록
            </button>
            {msg && (
                <div style={{ marginTop: 14, color: msg.includes("성공") ? "#2563eb" : "#ef4444" }}>
                    {msg}
                </div>
            )}
        </form>
    );
};

export default NicknameForm;
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const Logout = () => {
    const { setUser, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const doLogout = async () => {
            try {
                await api.post("/logout");
            } catch (err) {
                console.error("Logout failed:", err);
            } finally {
                // API 호출 성공 여부와 관계없이 프론트엔드 상태는 확실히 정리
                setUser(null);
                setIsLoggedIn(false);
                localStorage.removeItem("access");
                navigate("/");
            }
        };
        doLogout();
    }, [setUser, setIsLoggedIn, navigate]);

    return <div>로그아웃 중...</div>;
};

export default Logout;
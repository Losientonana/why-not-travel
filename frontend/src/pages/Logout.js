import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const Logout = () => {
    const { setIsLoggedIn, setLoginUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const doLogout = async () => {
            try {
                const token = localStorage.getItem("access");
                await api.post("/logout", {}, { headers: { access: token } });
            } catch {}
            setIsLoggedIn(false);
            setLoginUser("");
            localStorage.removeItem("access");
            localStorage.removeItem("username");
            navigate("/");
        };
        doLogout();
    }, [setIsLoggedIn, setLoginUser, navigate]);

    return <div>로그아웃 중...</div>;
};

export default Logout;

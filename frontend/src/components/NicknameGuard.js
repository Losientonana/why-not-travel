import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// 닉네임 없이 허용되는 경로(필요시 더 추가)
const EXCLUDE_PATHS = ["/nickname", "/logout", "/oauth2/redirect", "/api/login", "/api/join", "/api/logout", "/api/user/me"];

export default function NicknameGuard({ children }) {
    const { user, isLoggedIn, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return; // user 정보 받아오기 전이면 기다림

        // 로그인 중 + 닉네임 미설정 + 예외 경로가 아니면
        if (
            isLoggedIn &&
            user &&
            (!user.nickname || user.nickname.trim() === "") &&
            !EXCLUDE_PATHS.includes(location.pathname)
        ) {
            navigate("/nickname", { replace: true });
        }
    }, [isLoggedIn, user, loading, location.pathname, navigate]);

    return children;
}

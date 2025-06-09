import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// 닉네임 없이 허용되는 경로(필요시 더 추가)
const EXCLUDE_PATHS = ["/nickname", "/logout", "/oauth2/redirect"];

export default function NicknameGuard({ children }) {
    const { user, isLoggedIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // 로그인 중 + 닉네임 미설정 + 현재경로가 EXCLUDE_PATHS에 없음 → 닉네임 등록으로 리다이렉트
        if (
            isLoggedIn &&
            user &&
            (!user.nickname || user.nickname.trim() === "") &&
            !EXCLUDE_PATHS.includes(location.pathname)
        ) {
            navigate("/nickname", { replace: true });
        }
    }, [isLoggedIn, user, location.pathname, navigate]);

    return children;
}

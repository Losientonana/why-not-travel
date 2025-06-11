// import React, { useEffect } from "react";
// import api from "../api/axiosConfig";
// import { useAuth } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
//
// const OAuth2Redirect = () => {
//     const { setIsLoggedIn, setLoginUser } = useAuth();
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const fetchAccessToken = async () => {
//             try {
//                 const res = await api.post("/api/token");
//                 const token = res.headers["access"];
//                 if (token) {
//                     localStorage.setItem("access", token);
//                     setIsLoggedIn(true);
//                     // 유저 정보도 같이 fetch
//                     const userRes = await api.get("/my", { headers: { access: token } });
//                     setLoginUser(userRes.data?.name || "");
//                     navigate("/mypage");
//                 } else {
//                     setIsLoggedIn(false);
//                     navigate("/login");
//                 }
//             } catch (err) {
//                 setIsLoggedIn(false);
//                 navigate("/login");
//             }
//         };
//         fetchAccessToken();
//     }, [setIsLoggedIn, setLoginUser, navigate]);
//
//     return <div>로그인 처리중...</div>;
// };
//
// export default OAuth2Redirect;
import React, { useEffect } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const OAuth2Redirect = () => {
    const { setIsLoggedIn, setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const res = await api.post("/api/token");
                const token = res.headers["access"];
                if (token) {
                    localStorage.setItem("access", token);
                    setIsLoggedIn(true);
                    // 유저 정보도 같이 fetch
                    const userRes = await api.get("/userinfo", { headers: { access: token } });
                    setUser(userRes.data);
                    if (!userRes.data.nickname) {
                        navigate("/nickname");
                    } else {
                        navigate("/mypage");
                    }
                } else {
                    setIsLoggedIn(false);
                    navigate("/login");
                }
            } catch (err) {
                setIsLoggedIn(false);
                navigate("/login");
            }
        };
        fetchAccessToken();
    }, [setIsLoggedIn, setUser, navigate]);

    return <div>로그인 처리중...</div>;
};

export default OAuth2Redirect;

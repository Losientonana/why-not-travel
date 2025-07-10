// src/api/axiosConfig.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true, // 중요! 쿠키 전달
});

// 요청 인터셉터: 모든 요청에 Access Token을 자동으로 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");
        if (token) {
            config.headers["access"] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 에러 발생 시 토큰 재발급 처리
api.interceptors.response.use(
    (response) => response, // 성공 응답은 그대로 반환
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고, 재발급 요청이 아니며(무한 루프 방지), 재시도한 요청이 아닐 때
        if (error.response.status === 401 && originalRequest.url !== '/reissue' && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 재시도 방지를 위해 플래그 설정

            try {
                console.log("Access token expired. Attempting to reissue...");
                const res = await api.post("/reissue");

                if (res.status === 200) {
                    const newAccessToken = res.headers["access"];
                    console.log("Token reissued successfully.");
                    localStorage.setItem("access", newAccessToken);
                    api.defaults.headers.common["access"] = newAccessToken;

                    // 원래 실패했던 요청의 헤더를 교체하여 재시도
                    originalRequest.headers["access"] = newAccessToken;
                    return api(originalRequest);
                }
            } catch (reissueError) {
                console.error("Failed to reissue token (Refresh token might be expired). Logging out.", reissueError);
                // 모든 인증 정보 삭제 및 로그인 페이지로 리디렉션
                localStorage.removeItem("access");
                delete api.defaults.headers.common["access"];
                window.location.href = "/login";
                return Promise.reject(reissueError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

import axios from 'axios';

// accessToken을 저장할 변수 (메모리 저장)
let accessToken = null;

const apiClient = axios.create({
    baseURL: 'http://localhost:8080', // 백엔드 API 주소
    withCredentials: true, // 쿠키 전송을 위해 필수
});

// 요청 인터셉터
apiClient.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 (401 에러 시 토큰 재발급 로직은 현재 AuthContext에서 처리하므로 여기서는 단순화)
// 필요 시 여기에 토큰 재발급 로직을 추가할 수 있습니다.
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // 여기서 401 에러 발생 시 강제 로그아웃 이벤트를 발생시킬 수 있습니다.
        if (error.response?.status === 401) {
            // AuthContext에서 이 이벤트를 수신하여 로그아웃 처리
            window.dispatchEvent(new Event('force-logout'));
        }
        return Promise.reject(error);
    }
);

// 이 함수를 AuthContext에서 호출하여 API 클라이언트의 토큰을 동기화합니다.
export const setAccessToken = (token) => {
    accessToken = token;
};

export default apiClient;

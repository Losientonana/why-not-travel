
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

// 응답 인터셉터
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => {
        // 응답 헤더에서 accessToken 갱신 (로그인, 토큰 재발급 시)
        const newAccessToken = response.headers['authorization'] || response.headers['access'];
        if (newAccessToken) {
            const tokenValue = newAccessToken.startsWith('Bearer ') ? newAccessToken.split(' ')[1] : newAccessToken;
            setAccessToken(tokenValue);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고, 재시도 요청이 아닐 때
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return apiClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await apiClient.post('/api/token'); // 또는 /reissue
                
                const newAccessToken = response.headers['authorization'] || response.headers['access'];
                if (!newAccessToken) {
                    throw new Error('새로운 accessToken이 없습니다.');
                }
                
                const tokenValue = newAccessToken.startsWith('Bearer ') ? newAccessToken.split(' ')[1] : newAccessToken;
                setAccessToken(tokenValue);
                
                originalRequest.headers['Authorization'] = `Bearer ${tokenValue}`;
                processQueue(null, tokenValue);
                
                return apiClient(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                // 강제 로그아웃 처리 필요 (Context에서 처리)
                console.error('Token refresh failed:', refreshError);
                // 여기서 AuthContext의 logout을 호출해야 함
                window.dispatchEvent(new Event('force-logout'));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export const setAccessToken = (token) => {
    accessToken = token;
};

export const getAccessToken = () => {
    return accessToken;
};

export default apiClient;

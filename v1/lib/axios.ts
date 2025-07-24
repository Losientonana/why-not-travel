
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // 401 에러이고, 재발급 요청이 아니며(무한 루프 방지), 로그인 요청이 아닐 때
        if (error.response.status === 401 && originalRequest.url !== '/reissue' && originalRequest.url !== '/api/login' && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await api.post('/reissue');
                if (res.status === 200) {
                    const newAccessToken = res.headers['access'];
                    localStorage.setItem('access', newAccessToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (reissueError) {
                console.error('Failed to reissue token', reissueError);
                localStorage.removeItem('access');
                window.location.href = '/login';
                return Promise.reject(reissueError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;

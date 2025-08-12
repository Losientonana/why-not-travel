import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:8080
  withCredentials: true, // 쿠키 자동 전송 (refresh token용)
  timeout: 10000, // 10초 타임아웃
});

// 토큰 저장/조회 함수들
export const tokenManager = {
  getAccessToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },
  setAccessToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  },
  removeAccessToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  },
  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }
};

// 요청 인터셉터 (모든 요청에 대해 실행)
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API 요청: ${config.method?.toUpperCase()} ${config.url}`);
    
    // JWT 토큰이 있으면 access 헤더에 추가 (백엔드가 'access' 헤더를 사용)
    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      config.headers.access = accessToken;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ API 요청 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (모든 응답에 대해 실행)
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API 응답 성공: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API 응답 오류:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
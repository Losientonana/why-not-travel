import axios from 'axios';

let accessToken: string | null = null;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 쿠키 전송을 위해 필요
});

// accessToken을 설정하는 함수
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// 401 재시도 중복 방지 플래그
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    // 쿠키는 withCredentials: true로 자동 전송되므로 별도 헤더 설정 불필요
    console.log('API 요청:', config.method?.toUpperCase(), config.url, '- 쿠키 자동 전송');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // 쿠키 방식에서는 서버가 Set-Cookie로 토큰을 자동 설정하므로 
    // 클라이언트에서 별도 저장 불필요
    console.log('API 응답 성공:', response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('401 오류 발생 - 토큰 만료 가능성');
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('refresh 토큰으로 재발급 시도');
        const response = await api.post('/api/token'); // 또는 /reissue
        
        if (response.status === 200) {
          console.log('토큰 재발급 성공');
          processQueue(null);
          return api(originalRequest);
        } else {
          throw new Error('토큰 재발급 실패');
        }
      } catch (refreshError) {
        console.log('토큰 재발급 실패 - 로그인 페이지로 이동');
        processQueue(refreshError);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
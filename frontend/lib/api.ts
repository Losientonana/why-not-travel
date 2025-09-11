
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

// 토큰 재발급 요청 중복 방지 플래그
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

// 응답 인터셉터 (모든 응답에 대해 실행)
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API 응답 성공: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('❌ API 응답 오류:', error.response?.status, error.response?.data);
    
    // 401 에러이고 access token expired 메시지인 경우 토큰 재발급 시도
    if (
      error.response?.status === 401 && 
      error.response?.data?.message === "access token expired" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // 이미 토큰 재발급 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.access = token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔄 Access 토큰 만료됨. Refresh 토큰으로 재발급 시도...');
        
        // 백엔드의 /reissue 엔드포인트 호출 (refresh 토큰은 쿠키에 자동 포함)
        const reissueResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/reissue`,
          {},
          { withCredentials: true }
        );
        
        const newAccessToken = reissueResponse.headers['access'];
        
        if (newAccessToken) {
          console.log('✅ 새로운 Access 토큰 발급 성공');
          tokenManager.setAccessToken(newAccessToken);
          
          // 대기 중인 요청들 처리
          processQueue(null, newAccessToken);
          
          // 원래 요청에 새 토큰을 추가하여 재시도
          originalRequest.headers.access = newAccessToken;
          return api(originalRequest);
        } else {
          throw new Error('새로운 Access 토큰을 받지 못했습니다');
        }
      } catch (refreshError: any) {
        console.error('❌ 토큰 재발급 실패:', refreshError);
        
        // 재발급 실패시 로그인 페이지로 리다이렉트하기 위해 토큰 삭제
        tokenManager.clearAll();
        processQueue(refreshError, null);
        
        // 토큰 재발급 실패를 알리는 커스텀 에러
        const tokenRefreshError = new Error('토큰 재발급에 실패했습니다. 다시 로그인해주세요.');
        (tokenRefreshError as any).isTokenRefreshError = true;
        
        return Promise.reject(tokenRefreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

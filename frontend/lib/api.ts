
import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:8080
  withCredentials: true, // 쿠키 자동 전송 (refresh token용)
  timeout: 10000, // 10초 타임아웃
});

// 메모리 기반 보안 토큰 관리 (XSS 공격으로부터 안전)
class SecureTokenManager {
  private accessToken: string | null = null;

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  removeAccessToken(): void {
    this.accessToken = null;
  }

  clearAll(): void {
    this.accessToken = null;
    // localStorage의 기존 토큰들도 정리
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('access');
      localStorage.removeItem('token');
    }
  }

  hasToken(): boolean {
    return !!this.accessToken;
  }
}

export const tokenManager = new SecureTokenManager();

// 요청 인터셉터 (모든 요청에 대해 실행)
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API 요청: ${config.method?.toUpperCase()} ${config.url}`);

    // JWT 토큰이 있으면 access 헤더에 추가 (백엔드가 'access' 헤더를 사용)
    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      config.headers.access = accessToken;
    }

    // API 활동을 idle timer에 알림 (사용자가 활발하게 사용 중임을 표시)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('api-activity'));
    }

    return config;
  },
  (error) => {
    console.error('❌ API 요청 오류:', error);
    return Promise.reject(error);
  }
);

// 토큰 재발급 관리 클래스 (중복 요청 방지 및 대기열 관리)
class TokenRefreshManager {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    this.failedQueue = [];
  }

  async handleTokenRefresh(originalRequest: any): Promise<any> {
    if (this.isRefreshing) {
      // 이미 토큰 재발급 중이면 대기열에 추가
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers.access = token;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

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
        this.processQueue(null, newAccessToken);

        // 원래 요청에 새 토큰을 추가하여 재시도
        originalRequest.headers.access = newAccessToken;
        return api(originalRequest);
      } else {
        throw new Error('새로운 Access 토큰을 받지 못했습니다');
      }
    } catch (refreshError: any) {
      console.error('❌ 토큰 재발급 실패:', refreshError);

      // 재발급 실패시 모든 토큰 삭제
      tokenManager.clearAll();
      this.processQueue(refreshError, null);

      // 토큰 재발급 실패를 알리는 커스텀 에러
      const tokenRefreshError = new Error('토큰 재발급에 실패했습니다. 다시 로그인해주세요.');
      (tokenRefreshError as any).isTokenRefreshError = true;

      // AuthContext에 로그아웃 이벤트 전달
      window.dispatchEvent(new CustomEvent('auth-token-expired'));

      return Promise.reject(tokenRefreshError);
    } finally {
      this.isRefreshing = false;
    }
  }
}

const refreshManager = new TokenRefreshManager();

// 응답 인터셉터 (보안 강화된 토큰 갱신 로직)
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
      (error.response?.data?.message === "access token expired" ||
       error.response?.data === "access token expired") &&
      !originalRequest._retry
    ) {
      return refreshManager.handleTokenRefresh(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;

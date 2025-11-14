
import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:8080
  withCredentials: true, // 쿠키 자동 전송 (refresh token용)
  timeout: 10000, // 10초 타임아웃
});

// localStorage 기반 토큰 관리 (새로고침 시에도 유지)
class SecureTokenManager {
  private readonly TOKEN_KEY = 'accessToken';

  getAccessToken(): string | null {
    if (typeof window === 'undefined') {
      console.log('🔴 [TokenManager] getAccessToken: window가 undefined (SSR 환경)');
      return null;
    }
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log('🔑 [TokenManager] getAccessToken:', token ? `토큰 존재 (길이: ${token.length})` : '토큰 없음');
    return token;
  }

  setAccessToken(token: string): void {
    if (typeof window === 'undefined') {
      console.log('🔴 [TokenManager] setAccessToken: window가 undefined (SSR 환경)');
      return;
    }
    console.log('✅ [TokenManager] setAccessToken: 토큰 저장 중... (길이:', token.length, ')');
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log('✅ [TokenManager] setAccessToken: 토큰 저장 완료');
    // 저장 후 즉시 확인
    const saved = localStorage.getItem(this.TOKEN_KEY);
    console.log('🔍 [TokenManager] setAccessToken: 저장 확인 -', saved ? '성공' : '실패');
  }

  removeAccessToken(): void {
    if (typeof window === 'undefined') {
      console.log('🔴 [TokenManager] removeAccessToken: window가 undefined (SSR 환경)');
      return;
    }
    console.log('🗑️ [TokenManager] removeAccessToken: 토큰 삭제 중...');
    localStorage.removeItem(this.TOKEN_KEY);
    console.log('🗑️ [TokenManager] removeAccessToken: 토큰 삭제 완료');
  }

  clearAll(): void {
    if (typeof window === 'undefined') {
      console.log('🔴 [TokenManager] clearAll: window가 undefined (SSR 환경)');
      return;
    }
    console.log('🧹 [TokenManager] clearAll: 모든 토큰 정리 중...');
    // 모든 토큰 관련 항목 정리
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('access');
    localStorage.removeItem('token');
    console.log('🧹 [TokenManager] clearAll: 정리 완료');
  }

  hasToken(): boolean {
    const token = this.getAccessToken();
    const result = !!token;
    console.log('❓ [TokenManager] hasToken:', result);
    return result;
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

// 타입 import
import { TravelPlanResponse, TravelPlanStatusResponse } from './types';

export default api;

// 여행 계획 API 함수
export const getTravelPlans = async (): Promise<TravelPlanResponse[]> => {
  const response = await api.get('/api/trips');
  return response.data;
};

// 단일 여행 계획 상태 조회
export const getTravelPlanStatus = async (tripId: number): Promise<TravelPlanStatusResponse> => {
  const response = await api.get(`/api/trips/${tripId}/status`);
  return response.data;
};

// 여러 여행 계획 상태 배치 조회
export const getTravelPlanStatuses = async (tripIds: number[]): Promise<TravelPlanStatusResponse[]> => {
  const response = await api.post('/api/trips/statuses', tripIds);
  return response.data;
};

// 여행 상세 정보 조회
export const getTripDetail = async (tripId: number) => {
  const response = await api.get(`/api/trips/${tripId}/detail`);
  return response.data;
};

// 여행 일정 조회
export const getItineraries = async (tripId: number) => {
  const response = await api.get(`/api/trips/${tripId}/itineraries`);
  return response.data;
};

// 여행 사진 조회
export const getPhotos = async (tripId: number) => {
  const response = await api.get(`/api/trips/${tripId}/photos`);
  return response.data;
};

// 여행 체크리스트 조회
export const getChecklists = async (tripId: number) => {
  const response = await api.get(`/api/trips/${tripId}/checklists`);
  return response.data;
};

// 여행 경비 조회
export const getExpenses = async (tripId: number) => {
  const response = await api.get(`/api/trips/${tripId}/expenses`);
  return response.data;
};

// 체크리스트 항목 추가
export const createChecklist = async (tripId: number, task: string, assigneeUserId?: number, displayOrder?: number) => {
  const response = await api.post('/api/trips/detail/checklists', {
    tripId,
    task,
    assigneeUserId,
    displayOrder,
  });
  return response.data.data; // ApiResponse의 data 필드
};

// 체크리스트 항목 체크 토글 (완료/미완료)
export const toggleChecklist = async (checklistId: number) => {
  const response = await api.patch(`/api/trips/${checklistId}/checklists`);
  return response.data.data; // ApiResponse의 data 필드
};

// 체크리스트 항목 삭제
export const deleteChecklist = async (checklistId: number) => {
  const response = await api.delete(`/api/trips/${checklistId}/checklists`);
  return response.data.data; // ApiResponse의 data 필드
};

// 일정(하루) 생성
export const createItinerary = async (tripId: number, dayNumber: number, date: string) => {
  const response = await api.post('/api/trips/detail/itineraries', {
    tripId,
    dayNumber,
    date,
  });
  return response.data.data; // ApiResponse의 data 필드
};

// 일정(하루) 삭제
export const deleteItinerary = async (itineraryId: number) => {
  const response = await api.delete(`/api/trips/${itineraryId}/itineraries`);
  return response.data.data; // ApiResponse의 data 필드
};


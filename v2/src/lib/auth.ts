import api, { tokenManager } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}

// 로그인 API 호출
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post('/api/login', credentials);
    
    // 백엔드에서 access 토큰을 응답 헤더로 전송
    const accessToken = response.headers['access'];
    
    if (accessToken) {
      // localStorage에 access 토큰 저장
      tokenManager.setAccessToken(accessToken);
      
      console.log('✅ 로그인 성공 - 토큰 저장됨');
      return { success: true };
    } else {
      throw new Error('Access token not found in response');
    }
  } catch (error: any) {
    console.error('❌ 로그인 실패:', error);
    
    // 에러 메시지 처리
    const errorMessage = error.response?.data?.message || 
                        error.response?.data || 
                        '로그인에 실패했습니다.';
    
    return { success: false, message: errorMessage };
  }
};

// 로그아웃 함수
export const logout = () => {
  tokenManager.clearAll();
  console.log('✅ 로그아웃 완료');
};

// 로그인 상태 확인
export const isAuthenticated = (): boolean => {
  return !!tokenManager.getAccessToken();
};

// 사용자 정보 인터페이스 (백엔드 UserDTO 기반)
export interface UserInfo {
  id: number;
  role: string;
  name: string;
  username: string;
  email: string;
}

// 내 정보 조회 API
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const response = await api.get('/api/user/me');
    console.log('✅ 사용자 정보 조회 성공');
    return response.data;
  } catch (error: any) {
    console.error('❌ 사용자 정보 조회 실패:', error);
    
    // 401 에러면 토큰이 만료된 것으로 간주하고 로그아웃
    if (error.response?.status === 401) {
      logout();
    }
    
    return null;
  }
};
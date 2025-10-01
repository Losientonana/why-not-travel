
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

// 로그아웃 함수 (백엔드 로그아웃 API 호출 포함)
export const logout = async () => {
  try {
    // 백엔드 로그아웃 API 호출 (refresh 토큰을 Redis에서 삭제하기 위함)
    await api.post('/api/logout');
    console.log('✅ 백엔드 로그아웃 성공');
  } catch (error) {
    console.warn('⚠️ 백엔드 로그아웃 실패 (토큰이 이미 만료되었을 수 있음):', error);
  } finally {
    // 로컬 토큰 삭제 (백엔드 호출 실패해도 로컬에서는 제거)
    tokenManager.clearAll();
    console.log('✅ 로컬 로그아웃 완료');
  }
};

// 로그인 상태 확인 (메모리 기반)
export const isAuthenticated = (): boolean => {
  return tokenManager.hasToken();
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
    
    // 토큰 재발급 실패로 인한 에러인 경우 로그아웃 처리
    if ((error as any).isTokenRefreshError) {
      await logout();
    }
    
    return null;
  }
};

// 회원가입 API
export const signup = async (formData: any) => {
  try {
    const response = await api.post('/api/join', formData);
    console.log('✅ 회원가입 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('❌ 회원가입 실패:', error.response?.data);
    return { success: false, message: error.response?.data?.message || '회원가입에 실패했습니다.' };
  }
};

// 이메일 중복 확인 API
export const checkEmail = async (email: string) => {
  try {
    const response = await api.get(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    return response.data; // { isAvailable: boolean }
  } catch (error: any) {
    console.error('❌ 이메일 중복 확인 실패:', error.response?.data);
    return { isAvailable: false, message: '이메일 확인 중 오류가 발생했습니다.' };
  }
};

// 닉네임 중복 확인 API
export const checkUsername = async (username: string) => {
  try {
    const response = await api.get(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
    return response.data; // { isAvailable: boolean }
  } catch (error: any) {
    console.error('❌ 닉네임 중복 확인 실패:', error.response?.data);
    return { isAvailable: false, message: '닉네임 확인 중 오류가 발생했습니다.' };
  }
};

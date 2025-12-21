
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
  console.log('🔐 [Auth] login() 호출됨:', credentials.email);
  try {
    const response = await api.post('/api/login', credentials);
    console.log('📨 [Auth] 로그인 응답 받음:', response.status);

    // 백엔드에서 access 토큰을 응답 헤더로 전송
    const accessToken = response.headers['access'];
    console.log('🔑 [Auth] access 토큰:', accessToken ? `존재 (길이: ${accessToken.length})` : '없음');

    if (accessToken) {
      // localStorage에 access 토큰 저장
      tokenManager.setAccessToken(accessToken);

      console.log('✅ [Auth] 로그인 성공 - 토큰 저장됨');
      return { success: true };
    } else {
      console.error('❌ [Auth] 응답에 access 토큰이 없음');
      throw new Error('Access token not found in response');
    }
  } catch (error: any) {
    console.error('❌ [Auth] 로그인 실패:', error);

    // 에러 메시지 처리
    const errorMessage = error.response?.data?.message ||
                        error.response?.data ||
                        '로그인에 실패했습니다.';

    console.error('❌ [Auth] 에러 메시지:', errorMessage);
    return { success: false, message: errorMessage };
  }
};

// 로그아웃 함수 (백엔드 로그아웃 API 호출 포함)
export const logout = async () => {
  console.log('🚪 [Auth] logout() 호출됨');
  try {
    // 백엔드 로그아웃 API 호출 (refresh 토큰을 Redis에서 삭제하기 위함)
    await api.post('/api/logout');
    console.log('✅ [Auth] 백엔드 로그아웃 성공');
  } catch (error) {
    console.warn('⚠️ [Auth] 백엔드 로그아웃 실패 (토큰이 이미 만료되었을 수 있음):', error);
  } finally {
    // 로컬 토큰 삭제 (백엔드 호출 실패해도 로컬에서는 제거)
    tokenManager.clearAll();
    console.log('✅ [Auth] 로컬 로그아웃 완료');
  }
};

// 로그인 상태 확인 (localStorage 기반)
export const isAuthenticated = (): boolean => {
  const result = tokenManager.hasToken();
  console.log('🔐 [Auth] isAuthenticated() 결과:', result);
  return result;
};

// 사용자 정보 인터페이스 (백엔드 MyInfoResponse 기반)
export interface UserInfo {
  id: number;
  username: string;
  name: string;
  email: string;
  introduction: string;
  createdAt: string;
}

// 내 정보 조회 API
export const getUserInfo = async (): Promise<UserInfo | null> => {
  console.log('👤 [Auth] getUserInfo() 호출됨');
  try {
    const response = await api.get('/api/user/me');
    console.log('✅ [Auth] 사용자 정보 조회 성공:', response.data);
    // ApiResponse 패턴: response.data.data 추출
    return response.data.data;
  } catch (error: any) {
    console.error('❌ [Auth] 사용자 정보 조회 실패:', error);
    console.error('❌ [Auth] 에러 상세:', {
      status: error.response?.status,
      data: error.response?.data,
      isTokenRefreshError: (error as any).isTokenRefreshError
    });

    // 토큰 재발급 실패로 인한 에러인 경우 로그아웃 처리
    if ((error as any).isTokenRefreshError) {
      console.log('🚨 [Auth] 토큰 재발급 실패로 로그아웃 처리');
      await logout();
    }

    return null;
  }
};

// 회원가입 API
export const signup = async (formData: any) => {
  try {
    console.log('📤 회원가입 요청 전송:', formData.email);
    const response = await api.post('/api/join', formData);
    console.log('📥 회원가입 응답 받음:', response);
    console.log('📊 응답 데이터:', response.data);
    console.log('✅ 회원가입 성공 - success:', response.data?.success);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('❌ 회원가입 실패:', error);
    console.error('❌ 에러 응답:', error.response?.data);
    return { success: false, message: error.response?.data?.message || error.response?.data?.error || '회원가입에 실패했습니다.' };
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

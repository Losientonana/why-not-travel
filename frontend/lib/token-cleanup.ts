// 기존 localStorage 토큰 정리 유틸리티 (보안 강화 마이그레이션용)
export const cleanupLegacyTokens = () => {
  if (typeof window !== 'undefined') {
    // 기존 localStorage의 불필요한 토큰들 모두 제거
    const legacyTokenKeys = [
      'accessToken',
      'access',
      'token',
      'refreshToken',
      'Authorization'
    ];

    legacyTokenKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🧹 Legacy token removed: ${key}`);
    });

    // sessionStorage의 토큰들도 정리
    const sessionKeys = Object.keys(sessionStorage).filter(key =>
      key.toLowerCase().includes('token') ||
      key.toLowerCase().includes('access') ||
      key.toLowerCase().includes('auth')
    );

    sessionKeys.forEach(key => {
      sessionStorage.removeItem(key);
      console.log(`🧹 Session token removed: ${key}`);
    });

    console.log('✅ 모든 레거시 토큰이 정리되었습니다.');
  }
};

// 앱 시작 시 한 번 실행하여 기존 토큰들 정리
export const initializeSecureTokenSystem = () => {
  cleanupLegacyTokens();
  console.log('🔒 보안 강화된 토큰 시스템이 초기화되었습니다.');
};
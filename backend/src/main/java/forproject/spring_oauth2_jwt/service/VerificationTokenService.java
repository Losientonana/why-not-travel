//package forproject.spring_oauth2_jwt.service;
//
//import forproject.spring_oauth2_jwt.entity.UserEntity;
//import forproject.spring_oauth2_jwt.entity.VerificationToken;
//import forproject.spring_oauth2_jwt.enums.TokenType;
//import forproject.spring_oauth2_jwt.repository.VerificationTokenRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class VerificationTokenService {
//    private final VerificationTokenRepository tokenRepository;
//
//    @Transactional
//    public VerificationToken createEmailVerificationToken(UserEntity user) {
//        log.info("🔑 createEmailVerificationToken 시작 - 사용자 ID: {}", user.getId());
//        String tokenType = TokenType.EMAIL_VERIFICATION.getValue();
//        log.info("📝 토큰 타입: {}", tokenType);
//
//        // 기존 토큰 삭제 (재발급 대비) - 디버깅을 위해 주석처리
//        log.info("🗑️ 기존 토큰 삭제 로직 - 디버깅을 위해 스킵");
//        // try {
//        //     tokenRepository.deleteByUserAndTokenType(user, tokenType);
//        //     tokenRepository.flush(); // 즉시 DB에 반영
//        //     log.info("✅ 기존 토큰 삭제 완료");
//        // } catch (Exception e) {
//        //     log.warn("⚠️ 기존 토큰 삭제 중 예외 발생 (처음 생성 시 정상): {}", e.getMessage());
//        // }
//
//        // 새 토큰 생성
//        String tokenValue = UUID.randomUUID().toString();
//        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(60);
//        log.info("🎲 생성된 토큰값: {}", tokenValue);
//        log.info("⏰ 만료 시간: {}", expiresAt);
//
//        VerificationToken token = VerificationToken.builder()
//                .user(user)
//                .token(tokenValue)
//                .tokenType(tokenType)
//                .expiresAt(expiresAt)
//                .build();
//
//        log.info("💾 토큰 DB 저장 시도...");
//        VerificationToken savedToken = tokenRepository.save(token);
//        log.info("✅ 토큰 저장 완료 - ID: {}", savedToken.getId());
//
//        return savedToken;
//    }
//    public VerificationToken validateToken(String tokenValue, TokenType expectedType) {
//        // 토큰 존재 여부
//        VerificationToken token = tokenRepository.findByToken(tokenValue)
//                .orElseThrow(() ->  new RuntimeException("유효하지 않은 토큰입니다."));
//
//        // 토큰 타입 확인
//        if (!token.getTokenType().equals(expectedType.getValue())) {
//            throw new RuntimeException("토큰 타입이 일치하지 않습니다.");
//        }
//
//        // 만료 여부 확인
//        if (isTokenExpired(token)) {
//            throw new RuntimeException("토큰이 만료되었습니다.");
//        }
//
//        return token;
//    }
//
//    // 만료 체크
//    public boolean isTokenExpired(VerificationToken token) {
//        return LocalDateTime.now().isAfter(token.getExpiresAt());
//    }
//
//    // 토큰 삭제 (일회성) - 디버깅을 위해 주석처리
//    public void consumeToken(VerificationToken token) {
//        log.info("🗑️ consumeToken 호출됨 - 토큰 ID: {}, 삭제는 주석처리됨", token.getId());
//        // tokenRepository.delete(token);  // 디버깅용 주석처리
//    }
//
//    // Rate Limit 체크 (1시간에 5번)
//    public void checkRateLimit(UserEntity user, TokenType tokenType) {
//        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
//        long count = tokenRepository.countByUserAndTokenTypeAndCreatedAtAfter(
//                user,
//                tokenType.getValue(),
//                oneHourAgo
//        );
//
//        if (count >= 5) {
//            throw new RuntimeException("너무 많은 요청입니다. 1시간 후 다시 시도해주세요.");
//        }
//    }
//}

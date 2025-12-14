//package forproject.spring_oauth2_jwt.service;
//
//import forproject.spring_oauth2_jwt.dto.response.EmailVerificationResponse;
//import forproject.spring_oauth2_jwt.dto.response.ResendVerificationResponse;
//import forproject.spring_oauth2_jwt.entity.UserEntity;
//import forproject.spring_oauth2_jwt.entity.VerificationToken;
//import forproject.spring_oauth2_jwt.enums.TokenType;
//import forproject.spring_oauth2_jwt.repository.UserRepository;
//import jakarta.mail.MessagingException;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//
//@Service
//@RequiredArgsConstructor
//public class EmailVerificationService {
//
//    private final VerificationTokenService tokenService;
//    private final UserRepository userRepository;
//    private final EmailService emailService;
//
//    /**
//     * 이메일 인증 처리
//     */
//    @Transactional
//    public EmailVerificationResponse verifyEmail(String tokenValue) {
//        try {
//            // ① 토큰 검증
//            VerificationToken token = tokenService.validateToken(
//                    tokenValue,
//                    TokenType.EMAIL_VERIFICATION
//            );
//
//            // ② 사용자 인증 완료
//            UserEntity user = token.getUser();
//            user.setVerified(true);
//            userRepository.save(user);
//
//            // ③ 토큰 삭제 (일회성)
//            tokenService.consumeToken(token);
//
//            // ④ 성공 응답
//            return EmailVerificationResponse.success(user.getEmail());
//
//        } catch (Exception e) {
//            return EmailVerificationResponse.failure(e.getMessage());
//        }
//    }
//
//    /**
//     * 인증 메일 재발송
//     */
//    @Transactional
//    public ResendVerificationResponse resendVerificationEmail(String email) throws MessagingException {
//        // ① 사용자 조회
//        UserEntity user = userRepository.findByEmail(email);
//        if (user == null) {
//            throw new RuntimeException("사용자를 찾을 수 없습니다.");
//        }
//
//        // ② 이미 인증된 사용자 체크
//        if (user.isVerified()) {
//            throw new RuntimeException("이미 인증된 이메일입니다.");
//        }
//
//        // ③ Rate Limit 체크 (1시간에 5번)
//        tokenService.checkRateLimit(user, TokenType.EMAIL_VERIFICATION);
//
//        // ④ 새 토큰 생성
//        VerificationToken token = tokenService.createEmailVerificationToken(user);
//
//        // ⑤ 이메일 재발송
//        emailService.sendVerificationEmail(
//                user.getEmail(),
//                user.getName(),
//                token.getToken()
//        );
//
//        // ⑥ 응답
//        return ResendVerificationResponse.success(
//                user.getEmail(),
//                TokenType.EMAIL_VERIFICATION.getExpirationMinutes()
//        );
//    }
//}
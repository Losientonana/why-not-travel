package forproject.spring_oauth2_jwt.controller;


import forproject.spring_oauth2_jwt.dto.ApiResponse;
import forproject.spring_oauth2_jwt.dto.request.SendVerificationCodeRequest;
import forproject.spring_oauth2_jwt.dto.request.VerifyCodeRequest;
import forproject.spring_oauth2_jwt.dto.response.SendVerificationCodeResponse;
import forproject.spring_oauth2_jwt.dto.response.VerifyCodeResponse;
import forproject.spring_oauth2_jwt.service.EmailService;
import forproject.spring_oauth2_jwt.service.EmailVerificationCodeService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class EmailVerificationCodeController {

    private final EmailVerificationCodeService verificationCodeService;
    private final EmailService emailService;

    /**
     * 인증 코드 발송
     * POST /api/auth/send-verification-code
     */
    @PostMapping("/send-verification-code")
    public ResponseEntity<ApiResponse<SendVerificationCodeResponse>> sendVerificationCode(
            @RequestBody @Valid SendVerificationCodeRequest request
    ) {
        log.info("인증 코드 발송 요청: email={}", request.getEmail());

        try {
            // Rate Limit 체크
            verificationCodeService.checkRateLimit(request.getEmail());

            // 6자리 코드 생성
            String code = verificationCodeService.generateVerificationCode();

            // Redis 저장
            verificationCodeService.saveVerificationCode(request.getEmail(), code);

            // 이메일 발송
            emailService.sendVerificationCodeEmail(request.getEmail(), code);

            SendVerificationCodeResponse response =
                SendVerificationCodeResponse.success(request.getEmail());
            log.info("인증 코드 발송 성공: email={}", request.getEmail());

            return ResponseEntity.ok(ApiResponse.success(response));

        } catch (RuntimeException e) {
            log.error("인증 코드 발송 실패 (Rate Limit): {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(ApiResponse.error("RATE_LIMIT_EXCEEDED", e.getMessage()));

        } catch (MessagingException e) {
            log.error("이메일 발송 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("EMAIL_SEND_ERROR", "이메일 발송에 실패했습니다."));
        }
    }

    /**
     * 인증 코드 검증
     * POST /api/auth/verify-code
     */
    @PostMapping("/verify-code")
    public ResponseEntity<ApiResponse<VerifyCodeResponse>> verifyCode(
            @RequestBody @Valid VerifyCodeRequest request
    ) {
        log.info("인증 코드 검증 요청: email={}, code={}", request.getEmail(), request.getCode());

        boolean isValid = verificationCodeService.verifyCode(request.getEmail(), request.getCode());

        if (isValid) {
            VerifyCodeResponse response = VerifyCodeResponse.success();
            log.info("인증 코드 검증 성공: email={}", request.getEmail());
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            VerifyCodeResponse response = VerifyCodeResponse.failure("인증 코드가 올바르지 않거나 만료되었습니다.");
            log.warn("인증 코드 검증 실패: email={}", request.getEmail());
            return ResponseEntity.ok(ApiResponse.success(response));
        }
    }
}

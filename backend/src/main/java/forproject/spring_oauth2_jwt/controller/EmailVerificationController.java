//package forproject.spring_oauth2_jwt.controller;
//
//import forproject.spring_oauth2_jwt.dto.ApiResponse;
//import forproject.spring_oauth2_jwt.dto.request.ResendVerificationRequest;
//import forproject.spring_oauth2_jwt.dto.response.EmailVerificationResponse;
//import forproject.spring_oauth2_jwt.dto.response.ResendVerificationResponse;
//import forproject.spring_oauth2_jwt.service.EmailVerificationService;
//import jakarta.mail.MessagingException;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@Slf4j
//@RestController
//@RequestMapping("/api/auth")
//@RequiredArgsConstructor
//public class EmailVerificationController {
//
//    private final EmailVerificationService emailVerificationService;
//
//    /**
//     * 이메일 인증 처리
//     * GET /api/auth/verify?token=xxx
//     */
//    @GetMapping("/verify")
//    public ResponseEntity<ApiResponse<EmailVerificationResponse>> verifyEmail(
//            @RequestParam String token  // ✅ 수정: @PathVariable → @RequestParam
//    ) {
//        EmailVerificationResponse response =
//                emailVerificationService.verifyEmail(token);
//        return ResponseEntity.ok(ApiResponse.success(response));
//    }
//
//    /**
//     * 인증 메일 재발송
//     * POST /api/auth/resend-verification
//     */
//    @PostMapping("/resend-verification")
//    public ResponseEntity<ApiResponse<ResendVerificationResponse>> resendVerification(
//            @RequestBody @Valid ResendVerificationRequest request
//    ) throws MessagingException {
//        ResendVerificationResponse response = emailVerificationService
//                .resendVerificationEmail(request.getEmail());
//        return ResponseEntity.ok(ApiResponse.success(response));
//    }
//}
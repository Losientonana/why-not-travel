//package forproject.spring_oauth2_jwt.dto.response;
//
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Getter
//@Setter
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class ResendVerificationResponse {
//
//    private boolean sent;                   // 발송 성공 여부
//    private String message;                 // 결과 메시지
//    private String email;                   // 발송된 이메일 (마스킹)
//    private LocalDateTime sentAt;           // 발송 시간
//    private Integer expirationMinutes;      // 만료 시간
//
//    /**
//     * 발송 성공 응답
//     */
//    public static ResendVerificationResponse success(String email, int expirationMinutes) {
//        return ResendVerificationResponse.builder()
//                .sent(true)
//                .message("인증 메일이 발송되었습니다. 메일함을 확인해주세요.")
//                .email(maskEmail(email))
//                .sentAt(LocalDateTime.now())
//                .expirationMinutes(expirationMinutes)
//                .build();
//    }
//
//    /**
//     * 발송 실패 응답
//     */
//    public static ResendVerificationResponse failure(String message) {
//        return ResendVerificationResponse.builder()
//                .sent(false)
//                .message(message)
//                .build();
//    }
//
//    /**
//     * 이메일 마스킹 (보안)
//     * 예: user@example.com → u***@example.com
//     */
//    private static String maskEmail(String email) {
//        if (email == null || !email.contains("@")) {
//            return email;
//        }
//        String[] parts = email.split("@");
//        String localPart = parts[0];
//        String domain = parts[1];
//
//        if (localPart.length() <= 1) {
//            return email;
//        }
//
//        return localPart.charAt(0) + "***@" + domain;
//    }
//}

//package forproject.spring_oauth2_jwt.dto.response;
//
//import lombok.*;
//import org.checkerframework.checker.units.qual.A;
//
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class EmailVerificationResponse {
//
//    private boolean verified;
//    private String message;
//    private String userEmail;
//    private String redirectUri;
//
//    public static EmailVerificationResponse success(String email) {
//        return EmailVerificationResponse.builder()
//                .verified(true)
//                .message("이메일 인증이 완료되었습니다.")
//                .userEmail(email)
//                .redirectUri("/login")
//                .build();
//    }
//
//    /**
//     * 인증 실패 응답
//     */
//    public static EmailVerificationResponse failure(String message) {
//        return EmailVerificationResponse.builder()
//                .verified(false)
//                .message(message)
//                .build();
//    }
//}

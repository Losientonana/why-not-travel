package forproject.spring_oauth2_jwt.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendVerificationCodeResponse {

    private String email;
    private String message;
    private int expirationMinutes;

    public static SendVerificationCodeResponse success(String email) {
        return SendVerificationCodeResponse.builder()
                .email(email)
                .message("인증 코드가 이메일로 발송되었습니다.")
                .expirationMinutes(5)
                .build();
    }
}

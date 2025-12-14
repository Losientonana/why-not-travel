package forproject.spring_oauth2_jwt.dto.response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyCodeResponse {

    private boolean verified;
    private String message;

    public static VerifyCodeResponse success() {
        return VerifyCodeResponse.builder()
                .verified(true)
                .message("이메일 인증이 완료되었습니다.")
                .build();
    }

    public static VerifyCodeResponse failure(String message) {
        return VerifyCodeResponse.builder()
                .verified(false)
                .message(message)
                .build();
    }
}

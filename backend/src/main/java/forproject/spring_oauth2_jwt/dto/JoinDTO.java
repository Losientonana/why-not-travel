package forproject.spring_oauth2_jwt.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

//@Getter
//@Setter
//public class JoinDTO {
//
//    private String username;
//    private String password;
//}



    @Getter
    @Setter
    public class JoinDTO {

        @NotBlank(message = "이메일은 필수입니다.")
        @Email(message = "유효하지 않은 이메일 형식입니다.")
        private String email;

        @NotBlank(message = "아이디는 필수입니다.")
        private String username;

        @NotBlank(message = "이름은 필수입니다.")
        private String name;

        @NotBlank(message = "닉네임은 필수입니다.")
        private String nickname;

        @NotBlank(message = "비밀번호는 필수입니다.")
        private String password;
    }


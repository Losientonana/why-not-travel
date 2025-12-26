package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.entity.TravelInvitation;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.security.Principal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class MyInfoResponse {
    private Long id;
    private String username;
    private String name;
    private String email;
    private String introduction;
    private LocalDate createdAt;

    public static  MyInfoResponse fromEntity(UserEntity user) {
        return MyInfoResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .introduction(user.getIntroduction())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

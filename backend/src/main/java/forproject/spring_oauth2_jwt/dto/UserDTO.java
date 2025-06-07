package forproject.spring_oauth2_jwt.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

    private Long id;
    private String role;
    private String name;
    private String username;
    private String email;
}

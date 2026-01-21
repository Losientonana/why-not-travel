package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.enums.InvitationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InvitationStatusResponse {
    private Long id;
    private String invitedEmail;
    private String Name;
    private InvitationStatus status;
}

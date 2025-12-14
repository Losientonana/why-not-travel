package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.entity.TravelInvitation;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InvitationRejectResponse {
    private String message;
    private Long invitationId;
    private String status;

    public static InvitationRejectResponse fromEntity(TravelInvitation invitation) {
        return InvitationRejectResponse.builder()
                .message("초대를 거절했습니다.")
                .invitationId(invitation.getId())
                .status(invitation.getStatus().name())
                .build();
    }
}

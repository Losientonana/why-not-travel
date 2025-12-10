package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.entity.TravelInvitation;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationAcceptResponse {
    private String message;
    private Long invitationId;
    private Long tripId;
    private String status;
    private LocalDateTime acceptedAt;

    public static InvitationAcceptResponse fromEntity(TravelInvitation invitation) {
        return InvitationAcceptResponse.builder()
                .message("초대를 수락했습니다.")
                .invitationId(invitation.getId())
                .tripId(invitation.getTripId())
                .status(invitation.getStatus().name())
                .acceptedAt(invitation.getAcceptedAt())
                .build();
    }
}

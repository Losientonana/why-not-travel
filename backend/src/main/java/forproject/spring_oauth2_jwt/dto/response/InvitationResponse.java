package forproject.spring_oauth2_jwt.dto.response;


import forproject.spring_oauth2_jwt.entity.TravelInvitation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationResponse {
    private Long invitationId;
    private Long tripId;
    private String tripTitle;
    private String inviterName;
    private String status; // PENDING, ACCEPTED, REJECTED, EXPIRED
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;

    public static InvitationResponse fromEntity(
            TravelInvitation invitation,
            String tripTitle,
            String inviterName
    ) {
        return InvitationResponse.builder()
                .invitationId(invitation.getId())
                .tripId(invitation.getTripId())
                .tripTitle(tripTitle)
                .inviterName(inviterName)
                .status(invitation.getStatus().name())
                .expiresAt(invitation.getExpiresAt())
                .createdAt(invitation.getCreatedAt())
                .build();
    }
}

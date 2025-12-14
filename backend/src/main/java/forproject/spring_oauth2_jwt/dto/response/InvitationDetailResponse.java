package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.entity.TravelInvitation;
import forproject.spring_oauth2_jwt.entity.TravelPlanEntity;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvitationDetailResponse {
    private Long invitationId;
    private Long tripId;
    private String tripTitle;
    private String tripDescription;
    private LocalDate tripStartDate;
    private LocalDate tripEndDate;
    private String tripImageUrl;
    private String inviterName;
    private String inviterEmail;
    private String invitedEmail;
    private String status; // PENDING, ACCEPTED, REJECTED, EXPIRED
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;

    public static InvitationDetailResponse fromEntity(
            TravelInvitation invitation,
            TravelPlanEntity trip,
            UserEntity inviter
    ) {
        return InvitationDetailResponse.builder()
                .invitationId(invitation.getId())
                .tripId(trip.getId())
                .tripTitle(trip.getTitle())
                .tripDescription(trip.getDescription())
                .tripStartDate(trip.getStartDate())
                .tripEndDate(trip.getEndDate())
                .tripImageUrl(trip.getImageUrl())
                .inviterName(inviter.getName())
                .inviterEmail(inviter.getEmail())
                .invitedEmail(invitation.getInvitedEmail())
                .status(invitation.getStatus().name())
                .expiresAt(invitation.getExpiresAt())
                .createdAt(invitation.getCreatedAt())
                .build();
    }
}

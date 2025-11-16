package forproject.spring_oauth2_jwt.dto;

import forproject.spring_oauth2_jwt.entity.TravelParticipant;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 참여자 정보 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantDTO {

    private Long participantId;
    private Long userId;
    private String userName;
    private String userEmail;
    private String role; // OWNER, EDITOR, VIEWER
    private LocalDateTime joinedAt;

    public static ParticipantDTO fromEntity(TravelParticipant participant, UserEntity user) {
        return ParticipantDTO.builder()
                .participantId(participant.getId())
                .userId(participant.getUserId())
                .userName(user != null ? user.getUsername() : "Unknown")
                .userEmail(user != null ? user.getEmail() : "")
                .role(participant.getRole())
                .joinedAt(participant.getJoinedAt())
                .build();
    }
}
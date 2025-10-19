package forproject.spring_oauth2_jwt.dto;

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
}
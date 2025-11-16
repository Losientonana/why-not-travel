package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.entity.TravelChecklist;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateChecklistResponse {
    private Long id;
    private Boolean completed;
    private LocalDateTime completedAt;

    public static UpdateChecklistResponse fromEntity(TravelChecklist checklist) {
        return UpdateChecklistResponse.builder()
                .id(checklist.getId())
                .completed(checklist.getCompleted())
                .completedAt(checklist.getCompletedAt())
                .build();
    }
}

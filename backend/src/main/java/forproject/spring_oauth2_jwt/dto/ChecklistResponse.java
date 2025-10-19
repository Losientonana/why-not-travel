package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistResponse {
    private Long id;
    private String task;
    private Boolean completed;
    private Long assigneeUserId;
    private String assigneeName;
    private LocalDateTime completedAt;
}

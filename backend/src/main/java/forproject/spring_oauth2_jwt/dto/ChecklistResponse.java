package forproject.spring_oauth2_jwt.dto;

import forproject.spring_oauth2_jwt.entity.TravelChecklist;
import forproject.spring_oauth2_jwt.entity.UserEntity;
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
    private Integer displayOrder;

    public static ChecklistResponse fromEntity(TravelChecklist checklist, UserEntity assignee) {
        return ChecklistResponse.builder()
                .id(checklist.getId())
                .task(checklist.getTask())
                .completed(checklist.getCompleted())
                .assigneeUserId(checklist.getAssigneeUserId())
                .assigneeName(assignee != null ? assignee.getName() : null)
                .completedAt(checklist.getCompletedAt())
                .displayOrder(checklist.getDisplayOrder())
                .build();
    }
}

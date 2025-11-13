package forproject.spring_oauth2_jwt.dto.response;

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
}

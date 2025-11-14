package forproject.spring_oauth2_jwt.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeleteChecklistResponse {
    private Long deletedChecklistId;
    private Long tripId;
    private int newTotalCount; // 삭제 후 남은 개수
}

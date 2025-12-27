package forproject.spring_oauth2_jwt.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistCreateRequestDTO {

    @NotNull(message = "여행 ID값은 필수입니다.")
    private Long tripId;

    @NotBlank(message = "체크리스트 내용은 필수입니다.")
    private String task;

    private Long assigneeUserId;
    // displayOrder는 백엔드에서 자동 할당 (제거됨)

    private Boolean isShared;

}

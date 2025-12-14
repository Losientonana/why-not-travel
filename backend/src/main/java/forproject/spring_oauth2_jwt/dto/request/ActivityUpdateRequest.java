package forproject.spring_oauth2_jwt.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActivityUpdateRequest {

    @NotNull(message = "시작 시간은 필수 입니다.")
    private LocalTime time;

    @NotNull(message = "활동 제목은 필수입니다.")
    private String title;

    @NotNull(message = "장소는 필수입니다.")
    private String location;

    @NotNull(message = "활동 타입은 필수입니다.")
    private String activityType;

    private Integer durationMinutes;
    private BigDecimal cost;
    private String notes;
}

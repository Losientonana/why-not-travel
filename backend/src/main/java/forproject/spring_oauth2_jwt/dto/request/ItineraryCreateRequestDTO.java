package forproject.spring_oauth2_jwt.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryCreateRequestDTO {

    @NotNull(message = "여행 ID는 필수입니다")
    private Long tripId;

    @NotNull(message = "일차는 필수입니다")
    private Integer dayNumber;      // 1, 2, 3...

    @NotNull(message = "날짜는 필수입니다")
    private LocalDate date;         // 2024-03-15

}

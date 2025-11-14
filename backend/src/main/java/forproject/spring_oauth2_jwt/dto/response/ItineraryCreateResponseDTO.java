package forproject.spring_oauth2_jwt.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryCreateResponseDTO {

    private Long id;
    private Long tripId;
    private Integer dayNumber;
    private LocalDate date;
    private LocalDateTime createdAt;
}

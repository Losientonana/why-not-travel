package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * 일정 응답 DTO
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItineraryResponse {private Long id;
    private Integer dayNumber;
    private LocalDate date;
    private String title;
    private String notes;
    private List<ActivityResponse> activities;

}

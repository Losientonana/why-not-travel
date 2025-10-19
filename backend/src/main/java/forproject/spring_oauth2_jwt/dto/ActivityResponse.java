package forproject.spring_oauth2_jwt.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ActivityResponse {

    private Long id;
    private LocalTime time;
    private String title;
    private String location;
    private String activityType;
    private Integer durationMinutes;
    private BigDecimal cost;
    private String notes;
}

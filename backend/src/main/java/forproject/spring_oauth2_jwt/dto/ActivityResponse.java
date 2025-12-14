package forproject.spring_oauth2_jwt.dto;


import forproject.spring_oauth2_jwt.entity.TravelActivity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ActivityResponse {

    private Long id;
    private Long itineraryId;
    private LocalTime time;
    private String title;
    private String location;
    private String activityType;
    private Integer durationMinutes;
    private BigDecimal cost;
    private String notes;
    private Integer displayOrder = 0;
    private LocalDateTime createdAt;

    public static ActivityResponse fromEntity(TravelActivity entity) {
        return ActivityResponse.builder()
                .id(entity.getId())
                .itineraryId(entity.getItineraryId())
                .time(entity.getTime())
                .title(entity.getTitle())
                .location(entity.getLocation())
                .activityType(entity.getActivityType())
                .durationMinutes(entity.getDurationMinutes())
                .cost(entity.getCost())
                .notes(entity.getNotes())
                .displayOrder(entity.getDisplayOrder())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static List<ActivityResponse> fromEntities(List<TravelActivity> activities) {
        if (activities == null) {
            return List.of();
        }
        return activities.stream()
                .map(ActivityResponse::fromEntity)
                .collect(Collectors.toList());
    }
}

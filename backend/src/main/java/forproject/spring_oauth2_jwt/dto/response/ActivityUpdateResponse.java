package forproject.spring_oauth2_jwt.dto.response;


import forproject.spring_oauth2_jwt.entity.TravelActivity;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityUpdateResponse {
    private Long id;
    private Long itineraryId;
    private LocalTime time;
    private String title;
    private String location;
    private String activityType;
    private Integer durationMinutes;
    private BigDecimal cost;
    private String notes;
    private Integer displayOrder;

    public static ActivityUpdateResponse fromEntity(TravelActivity
                                                            activity) {
        return ActivityUpdateResponse.builder()
                .id(activity.getId())
                .itineraryId(activity.getItineraryId())
                .time(activity.getTime())
                .title(activity.getTitle())
                .location(activity.getLocation())
                .activityType(activity.getActivityType())
                .durationMinutes(activity.getDurationMinutes())
                .cost(activity.getCost())
                .notes(activity.getNotes())
                .displayOrder(activity.getDisplayOrder())
                .build();
    }
}

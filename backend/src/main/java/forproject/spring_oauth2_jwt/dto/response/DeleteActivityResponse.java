package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.entity.TravelActivity;
import lombok.*;

import java.time.LocalTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeleteActivityResponse {
    private Long deletedActivityId;
    private Long itineraryId;
    private String title;
    private LocalTime time;
    private String activityType;

    public static DeleteActivityResponse fromEntity(TravelActivity activity) {
        return DeleteActivityResponse.builder()
                .deletedActivityId(activity.getId())
                .itineraryId(activity.getItineraryId())
                .title(activity.getTitle())
                .time(activity.getTime())
                .activityType(activity.getActivityType())
                .build();
    }
}

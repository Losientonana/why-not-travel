package forproject.spring_oauth2_jwt.dto;

import forproject.spring_oauth2_jwt.entity.TravelActivity;
import forproject.spring_oauth2_jwt.entity.TravelItinerary;
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
public class ItineraryResponse {
    private Long id;
    private Integer dayNumber;
    private LocalDate date;
    private List<ActivityResponse> activities;

    public static ItineraryResponse fromEntity(TravelItinerary itinerary, List<TravelActivity> activities) {
        return ItineraryResponse.builder()
                .id(itinerary.getId())
                .dayNumber(itinerary.getDayNumber())
                .date(itinerary.getDate())
                .activities(ActivityResponse.fromEntities(activities))
                .build();
    }
}

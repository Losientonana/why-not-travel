package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.entity.TravelItinerary;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeleteItineraryResponse {
    private Long deletedItineraryId;
    private Long tripId;
    private Integer dayNumber;
    private LocalDate date;
//    private  Integer deletedActivitiesCount;

    public static DeleteItineraryResponse fromEntity(TravelItinerary itinerary) {
        return DeleteItineraryResponse.builder()
                .deletedItineraryId(itinerary.getId())
                .tripId(itinerary.getTripId())
                .dayNumber(itinerary.getDayNumber())
                .date(itinerary.getDate())
                .build();
    }
}

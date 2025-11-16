package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.entity.TravelItinerary;
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

    public static ItineraryCreateResponseDTO fromEntity(TravelItinerary itinerary) {
        return ItineraryCreateResponseDTO.builder()
                .id(itinerary.getId())
                .tripId(itinerary.getTripId())
                .dayNumber(itinerary.getDayNumber())
                .date(itinerary.getDate())
                .createdAt(itinerary.getCreatedAt())
                .build();
    }
}

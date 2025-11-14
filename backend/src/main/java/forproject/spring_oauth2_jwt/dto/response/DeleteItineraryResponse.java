package forproject.spring_oauth2_jwt.dto.response;

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
}

package forproject.spring_oauth2_jwt.dto;

import forproject.spring_oauth2_jwt.enums.TravelPlanStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class TravelPlanStatusResponse {
    private Long tripId;
    private TravelPlanStatus status;
    private String statusDescription;

    public static TravelPlanStatusResponse from(Long tripId, LocalDate startDate, LocalDate
            endDate) {
        TravelPlanStatus status = calculateStatus(startDate, endDate);

        return TravelPlanStatusResponse.builder()
                .tripId(tripId)
                .status(status)
                .statusDescription(status.getDescription())
                .build();
    }

    private static TravelPlanStatus calculateStatus(LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();

        if (today.isBefore(startDate)) {
            return TravelPlanStatus.PLANNING;
        } else if (today.isAfter(endDate)) {
            return TravelPlanStatus.COMPLETED;
        } else {
            return TravelPlanStatus.ONGOING;
        }
    }
}

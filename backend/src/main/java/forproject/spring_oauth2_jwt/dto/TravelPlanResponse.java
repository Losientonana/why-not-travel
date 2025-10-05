package forproject.spring_oauth2_jwt.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.quartz.SimpleTrigger;

import java.time.LocalDate;

@Getter
@Setter
public class TravelPlanResponse {
    private Long id;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private String destination;
    private String description;
    private String name;
    private String visibility;

    private String status;
    private String imageUrl;
    private String participants;

}

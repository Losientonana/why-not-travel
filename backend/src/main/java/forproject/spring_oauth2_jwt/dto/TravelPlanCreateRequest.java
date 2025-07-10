package forproject.spring_oauth2_jwt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TravelPlanCreateRequest {
    @NotBlank
    private String title;
    @NotNull
    private LocalDate startDate;
    @NotNull
    private LocalDate endDate;
    private String description;
    @NotBlank
    private String visibility;
}
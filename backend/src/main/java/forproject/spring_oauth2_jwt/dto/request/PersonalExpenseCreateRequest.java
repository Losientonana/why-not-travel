package forproject.spring_oauth2_jwt.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalExpenseCreateRequest {

    @NotNull(message = "날짜는 필수입니다")
    private LocalDate date;

    @NotBlank(message = "카테고리는 필수입니다")
    @Size(max = 50, message = "카테고리는 50자 이하여야 합니다")
    private String category;

    @NotNull(message = "금액은 필수입니다")
    @Min(value = 1, message = "금액은 1원 이상이어야 합니다")
    private Long amount;

    /**
     * 외화 금액 (선택사항, 예: JPY)
     */
    @Min(value = 0, message = "외화 금액은 0 이상이어야 합니다")
    private Long foreignCurrencyAmount;

    @NotBlank(message = "설명은 필수입니다")
    @Size(max = 200, message = "설명은 200자 이하여야 합니다")
    private String description;
}
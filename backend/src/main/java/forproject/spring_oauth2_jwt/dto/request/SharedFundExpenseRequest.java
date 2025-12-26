package forproject.spring_oauth2_jwt.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SharedFundExpenseRequest {
    @NotNull(message = "날짜는 필수입니다.")
    private LocalDate date;

    @NotBlank(message = "카테고리는 필수입니다.")
    // enum 강제
    @Pattern(
            regexp = "식비|교통|숙박|관광|쇼핑|기타",
            message = "카테고리는 '식비', '교통', '숙박', '관광', '쇼핑', '기타' 중 하나여야 합니다."
    )
    private String category;

    @NotNull(message = "금액은 필수입니다.")
    @Min(value = 1, message = "금액은 1원 이상이어야 합니다.")
    private Long amount;

    @NotBlank(message = "설명은 필수입니다.")
    @Size(max = 500, message = "설명은 500자 이하여야 합니다.")
    private String description;
}
